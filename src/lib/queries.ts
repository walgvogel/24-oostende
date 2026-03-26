import { supabase, type Artikel, type Categorie, type Vraag } from './supabase'

export async function getArtikelen(limit = 20): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .eq('status', 'gepubliceerd')
    .order('publicatie_datum', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getArtikelBySlug(slug: string): Promise<Artikel | null> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'gepubliceerd')
    .single()

  if (error) return null
  return data
}

export async function getArtikelenByCategorie(categorieSlug: string, limit = 20): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .eq('categorie_slug', categorieSlug)
    .eq('status', 'gepubliceerd')
    .order('publicatie_datum', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getCategorieen(): Promise<Categorie[]> {
  const { data, error } = await supabase
    .from('categorieen')
    .select('*')
    .order('naam')

  if (error) throw error
  return data || []
}

export async function zoekArtikelen(query: string, limit = 20): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .eq('status', 'gepubliceerd')
    .or(`titel.ilike.%${query}%,inhoud.ilike.%${query}%,samenvatting.ilike.%${query}%`)
    .order('publicatie_datum', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getLatestPerCategorie(): Promise<Record<string, Artikel[]>> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .eq('status', 'gepubliceerd')
    .order('publicatie_datum', { ascending: false })

  if (error) throw error

  const grouped: Record<string, Artikel[]> = {}
  for (const artikel of data || []) {
    if (!grouped[artikel.categorie_slug]) {
      grouped[artikel.categorie_slug] = []
    }
    if (grouped[artikel.categorie_slug].length < 4) {
      grouped[artikel.categorie_slug].push(artikel)
    }
  }
  return grouped
}

export async function submitFeedback(artikelId: string, bericht: string, email?: string) {
  const { error } = await supabase
    .from('feedback')
    .insert({
      artikel_id: artikelId,
      type: 'fout',
      bericht,
      email: email || null,
    })

  if (error) throw error
}

export async function getBeantwoordeVragen(artikelId: string): Promise<Vraag[]> {
  const { data, error } = await supabase
    .from('vragen')
    .select('id, artikel_id, vraag, naam, status, antwoord, beantwoord_op, created_at')
    .eq('artikel_id', artikelId)
    .eq('status', 'beantwoord')
    .order('beantwoord_op', { ascending: false })
    .limit(10)

  if (error) throw error
  return (data || []) as Vraag[]
}
