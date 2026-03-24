import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Artikel = {
  id: string
  titel: string
  slug: string
  categorie_slug: string
  samenvatting: string | null
  inhoud: string
  artefacten_html: string | null
  tags: string[]
  bronnen: { naam: string; url: string }[]
  status: 'concept' | 'gepubliceerd' | 'gearchiveerd'
  publicatie_datum: string | null
  is_schuimkoppen: boolean
  leestijd_minuten: number
  afbeelding_url: string | null
  created_at: string
  updated_at: string
}

export type Categorie = {
  id: number
  slug: string
  naam: string
}

export type Scan = {
  id: string
  scan_datum: string
  bronnen_gescand: string[]
  bronnen_geblokkeerd: string[]
  aantal_opdrachten: number
  aantal_afgewezen: number
  rapport: string | null
  created_at: string
}

export type Opdracht = {
  id: string
  scan_datum: string
  titel: string
  categorie_slug: string | null
  prioriteit: string
  type: string
  briefing: string | null
  bronnen: { naam: string; url: string }[]
  status: string
  artikel_id: string | null
  created_at: string
}

export type Feedback = {
  id: string
  artikel_id: string | null
  type: string
  bericht: string
  email: string | null
  status: string
  created_at: string
}
