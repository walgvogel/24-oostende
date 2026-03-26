import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

/**
 * GET /api/feedback — Claim de volgende onverwerkte feedback.
 * Retourneert de feedback + bijbehorend artikel (titel, slug, inhoud).
 * Wordt aangeroepen door de scheduled task.
 */
export async function GET(request: NextRequest) {
  // Simpele auth check
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.ADMIN_WACHTWOORD}`
  if (authHeader !== expected) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  // Claim volgende feedback via RPC
  const { data: claimed, error: claimError } = await supabaseServer
    .rpc('claim_volgende_feedback')

  if (claimError) {
    console.error('Fout bij claimen feedback:', claimError)
    return NextResponse.json({ error: 'Claim mislukt' }, { status: 500 })
  }

  if (!claimed || claimed.length === 0) {
    return NextResponse.json({ feedback: null, bericht: 'Geen nieuwe feedback' })
  }

  const fb = claimed[0]

  // Haal artikel op
  let artikel = null
  if (fb.artikel_id) {
    const { data } = await supabaseServer
      .from('artikelen')
      .select('id, titel, slug, categorie_slug, inhoud, bronnen, tags')
      .eq('id', fb.artikel_id)
      .single()
    artikel = data
  }

  return NextResponse.json({ feedback: fb, artikel })
}

/**
 * POST /api/feedback — Schrijf het resultaat van de verwerking terug.
 * Body: { feedback_id, status, conclusie, correctie?: { omschrijving }, artikel_update?: { inhoud } }
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const expected = `Bearer ${process.env.ADMIN_WACHTWOORD}`
  if (authHeader !== expected) {
    return NextResponse.json({ error: 'Niet geautoriseerd' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { feedback_id, status, conclusie, correctie, artikel_update } = body

    if (!feedback_id || !status || !conclusie) {
      return NextResponse.json({ error: 'feedback_id, status en conclusie zijn verplicht' }, { status: 400 })
    }

    // 1. Update feedback record
    const { error: fbError } = await supabaseServer
      .from('feedback')
      .update({
        status,
        conclusie,
        verwerkt_op: new Date().toISOString(),
      })
      .eq('id', feedback_id)

    if (fbError) throw fbError

    // 2. Als er een correctie is: artikel bijwerken + correctienotitie toevoegen
    if (correctie && correctie.artikel_id) {
      // Haal bestaande correcties op
      const { data: artikelData } = await supabaseServer
        .from('artikelen')
        .select('correcties')
        .eq('id', correctie.artikel_id)
        .single()

      const bestaand = (artikelData?.correcties as Array<Record<string, unknown>>) || []
      const nieuweCorrecties = [
        ...bestaand,
        {
          datum: new Date().toISOString(),
          omschrijving: correctie.omschrijving,
          feedback_id,
        },
      ]

      const updatePayload: Record<string, unknown> = {
        correcties: nieuweCorrecties,
        updated_at: new Date().toISOString(),
      }

      // Als de artikelinhoud ook aangepast moet worden
      if (artikel_update?.inhoud) {
        updatePayload.inhoud = artikel_update.inhoud
      }

      const { error: artError } = await supabaseServer
        .from('artikelen')
        .update(updatePayload)
        .eq('id', correctie.artikel_id)

      if (artError) throw artError
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Fout bij verwerken feedback:', err)
    return NextResponse.json({ error: 'Verwerking mislukt' }, { status: 500 })
  }
}
