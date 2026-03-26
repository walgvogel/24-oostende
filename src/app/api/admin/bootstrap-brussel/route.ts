import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

function isAuthorized(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.ADMIN_WACHTWOORD}`
  return authHeader === expected
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  const existing = await supabaseServer
    .from('categorieen')
    .select('id, slug, naam')
    .eq('slug', 'brussel')
    .limit(1)
    .maybeSingle()

  if (existing.error) {
    return NextResponse.json({ error: existing.error.message }, { status: 500 })
  }

  if (existing.data) {
    return NextResponse.json({ success: true, created: false, categorie: existing.data })
  }

  const inserted = await supabaseServer
    .from('categorieen')
    .insert({ slug: 'brussel', naam: 'Brussel' })
    .select('id, slug, naam')
    .single()

  if (inserted.error) {
    return NextResponse.json({ error: inserted.error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, created: true, categorie: inserted.data })
}
