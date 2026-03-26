import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase-server'

const VRAAG_MIN = 10
const VRAAG_MAX = 500
const NAAM_MAX = 50

function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '')
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { artikel_id, vraag, naam, website } = body

    // Honeypot: bots vullen dit verborgen veld in
    if (website) {
      return NextResponse.json({ success: true, bericht: 'Vraag ontvangen!' })
    }

    // Validatie
    if (!artikel_id || typeof artikel_id !== 'string') {
      return NextResponse.json({ error: 'Ongeldig artikel.' }, { status: 400 })
    }

    if (!vraag || typeof vraag !== 'string') {
      return NextResponse.json({ error: 'Vraag is verplicht.' }, { status: 400 })
    }

    const schoneVraag = stripHtml(vraag).trim()
    if (schoneVraag.length < VRAAG_MIN) {
      return NextResponse.json(
        { error: `Vraag moet minstens ${VRAAG_MIN} tekens bevatten.` },
        { status: 400 }
      )
    }
    if (schoneVraag.length > VRAAG_MAX) {
      return NextResponse.json(
        { error: `Vraag mag maximaal ${VRAAG_MAX} tekens bevatten.` },
        { status: 400 }
      )
    }

    let schoneNaam: string | null = null
    if (naam && typeof naam === 'string') {
      schoneNaam = stripHtml(naam).trim().slice(0, NAAM_MAX) || null
    }

    // Check of artikel bestaat
    const { data: artikel } = await supabaseServer
      .from('artikelen')
      .select('id')
      .eq('id', artikel_id)
      .eq('status', 'gepubliceerd')
      .single()

    if (!artikel) {
      return NextResponse.json({ error: 'Artikel niet gevonden.' }, { status: 404 })
    }

    // Insert via service role (geen publieke INSERT policy)
    const { error: insertError } = await supabaseServer
      .from('vragen')
      .insert({
        artikel_id,
        vraag: schoneVraag,
        naam: schoneNaam,
      })

    if (insertError) {
      console.error('Fout bij opslaan vraag:', insertError)
      return NextResponse.json({ error: 'Opslaan mislukt.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, bericht: 'Vraag ontvangen!' })
  } catch {
    return NextResponse.json({ error: 'Ongeldige aanvraag.' }, { status: 400 })
  }
}
