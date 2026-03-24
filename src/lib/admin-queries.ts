import { supabase, type Artikel, type Scan, type Opdracht, type Feedback } from './supabase'

export async function getAllArtikelen(): Promise<Artikel[]> {
  const { data, error } = await supabase
    .from('artikelen')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getScans(limit = 10): Promise<Scan[]> {
  const { data, error } = await supabase
    .from('scans')
    .select('*')
    .order('scan_datum', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getOpdrachten(limit = 20): Promise<Opdracht[]> {
  const { data, error } = await supabase
    .from('opdrachten')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function getFeedback(): Promise<(Feedback & { artikel_titel?: string })[]> {
  const { data, error } = await supabase
    .from('feedback')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateArtikel(id: string, updates: Partial<Artikel>): Promise<Artikel> {
  const { data, error } = await supabase
    .from('artikelen')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function archiveerArtikel(id: string): Promise<void> {
  const { error } = await supabase
    .from('artikelen')
    .update({ status: 'gearchiveerd', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function publiceerArtikel(id: string): Promise<void> {
  const { error } = await supabase
    .from('artikelen')
    .update({ status: 'gepubliceerd', publicatie_datum: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function updateFeedbackStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('feedback')
    .update({ status })
    .eq('id', id)

  if (error) throw error
}

export async function getStats() {
  const [artikelen, scans, opdrachten, feedback] = await Promise.all([
    supabase.from('artikelen').select('id, status, categorie_slug, publicatie_datum', { count: 'exact' }),
    supabase.from('scans').select('id', { count: 'exact' }),
    supabase.from('opdrachten').select('id, status', { count: 'exact' }),
    supabase.from('feedback').select('id, status', { count: 'exact' }),
  ])

  const arts = artikelen.data || []
  const gepubliceerd = arts.filter(a => a.status === 'gepubliceerd').length
  const concept = arts.filter(a => a.status === 'concept').length

  const opdr = opdrachten.data || []
  const openOpdrachten = opdr.filter(o => !['gepubliceerd', 'afgewezen'].includes(o.status)).length

  const fb = feedback.data || []
  const nieuweFeedback = fb.filter(f => f.status === 'nieuw').length

  // Artikelen per categorie
  const perCategorie: Record<string, number> = {}
  for (const a of arts) {
    perCategorie[a.categorie_slug] = (perCategorie[a.categorie_slug] || 0) + 1
  }

  // Artikelen per week (laatste 4 weken)
  const nu = new Date()
  const perWeek: { week: string; aantal: number }[] = []
  for (let i = 3; i >= 0; i--) {
    const start = new Date(nu)
    start.setDate(start.getDate() - (i + 1) * 7)
    const end = new Date(nu)
    end.setDate(end.getDate() - i * 7)
    const aantal = arts.filter(a => {
      if (!a.publicatie_datum) return false
      const d = new Date(a.publicatie_datum)
      return d >= start && d < end
    }).length
    const label = `${start.getDate()}/${start.getMonth() + 1}`
    perWeek.push({ week: label, aantal })
  }

  return {
    totaalArtikelen: arts.length,
    gepubliceerd,
    concept,
    totaalScans: scans.count || 0,
    openOpdrachten,
    nieuweFeedback,
    perCategorie,
    perWeek,
  }
}
