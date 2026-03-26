// Artikeltypes worden opgeslagen als tag met prefix "type:"
// Voorbeeld: tags: ["type:achtergrond", "oostende", "haven"]

export type ArtikelType = 'nieuws' | 'achtergrond' | 'reportage'

export const ARTIKEL_TYPES: Record<ArtikelType, { label: string; kleur: string }> = {
  nieuws: {
    label: 'Nieuws',
    kleur: 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  },
  achtergrond: {
    label: 'Achtergrond',
    kleur: 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  },
  reportage: {
    label: 'Reportage',
    kleur: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
  },
}

/** Haal het artikeltype uit de tags-array. Default: 'nieuws'. */
export function getArtikelType(tags: string[] | null): ArtikelType {
  if (!tags) return 'nieuws'
  const typeTag = tags.find(t => t.startsWith('type:'))
  if (!typeTag) return 'nieuws'
  const type = typeTag.replace('type:', '') as ArtikelType
  return ARTIKEL_TYPES[type] ? type : 'nieuws'
}

/** Filter type:-tags uit de tags-array (voor weergave als gewone tags). */
export function getInhoudsTags(tags: string[] | null): string[] {
  if (!tags) return []
  return tags.filter(t => !t.startsWith('type:'))
}
