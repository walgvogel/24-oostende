import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

export async function GET() {
  const { data, error } = await supabaseServer
    .from('vragen')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, afgewezen_reden } = await request.json()

    if (!id || !status) {
      return NextResponse.json({ error: 'id en status zijn verplicht' }, { status: 400 })
    }

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    }
    if (afgewezen_reden) updates.afgewezen_reden = afgewezen_reden

    const { error } = await supabaseServer
      .from('vragen')
      .update(updates)
      .eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag' }, { status: 400 })
  }
}
