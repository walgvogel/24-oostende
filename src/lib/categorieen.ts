// Centrale bron van waarheid voor categorieën.
// Alle componenten importeren vanuit dit bestand.

export type CategorieConfig = {
  slug: string
  naam: string
  naamKort: string
  kleur: string
}

const FALLBACK_KLEUR = 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'

export const BRUSSEL_SECTIE_SLUG = 'brussel'
export const BRUSSEL_SECTIE_LABEL = 'Brussel'
export const BRUSSEL_SECTIE_KLEUR = 'bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200'

export const CATEGORIEEN: CategorieConfig[] = [
  { slug: 'politiek', naam: 'Politiek', naamKort: 'Politiek', kleur: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
  { slug: 'samenleving', naam: 'Samenleving', naamKort: 'Samenleving', kleur: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  { slug: 'cultuur', naam: 'Cultuur', naamKort: 'Cultuur', kleur: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300' },
  { slug: 'sport', naam: 'Sport', naamKort: 'Sport', kleur: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { slug: 'economie', naam: 'Economie', naamKort: 'Economie', kleur: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' },
  { slug: 'verkeer-mobiliteit', naam: 'Verkeer & mobiliteit', naamKort: 'Verkeer', kleur: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { slug: 'natuur-milieu', naam: 'Natuur & milieu', naamKort: 'Natuur', kleur: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { slug: 'veiligheid', naam: 'Veiligheid', naamKort: 'Veiligheid', kleur: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300' },
  { slug: 'lifestyle', naam: 'Lifestyle', naamKort: 'Lifestyle', kleur: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300' },
]

// Lookup helpers
export const categorieBySlug = Object.fromEntries(CATEGORIEEN.map(c => [c.slug, c]))
export const categorieNamen: Record<string, string> = Object.fromEntries(CATEGORIEEN.map(c => [c.slug, c.naamKort]))
export const categorieNamenVolledig: Record<string, string> = Object.fromEntries(CATEGORIEEN.map(c => [c.slug, c.naam]))
export const categorieKleuren: Record<string, string> = Object.fromEntries(CATEGORIEEN.map(c => [c.slug, c.kleur]))

export function isBrusselSectie(slug: string | null | undefined): boolean {
  return slug === BRUSSEL_SECTIE_SLUG
}

export function getCategorieLabel(
  slug: string | null | undefined,
  variant: 'kort' | 'volledig' = 'kort'
): string {
  if (!slug) return '-'
  if (isBrusselSectie(slug)) return BRUSSEL_SECTIE_LABEL
  return variant === 'volledig'
    ? categorieNamenVolledig[slug] || slug
    : categorieNamen[slug] || slug
}

export function getCategorieKleur(slug: string | null | undefined): string {
  if (!slug) return FALLBACK_KLEUR
  if (isBrusselSectie(slug)) return BRUSSEL_SECTIE_KLEUR
  return categorieKleuren[slug] || FALLBACK_KLEUR
}

export function getArtikelPad(artikel: { categorie_slug: string; slug: string }): string {
  const categorieSlug = artikel.categorie_slug
  const artikelSlug = artikel.slug
  if (isBrusselSectie(categorieSlug)) {
    return `/${BRUSSEL_SECTIE_SLUG}/${artikelSlug}`
  }
  return `/${categorieSlug}/${artikelSlug}`
}

export function getArtikelPadVanSlug(categorieSlug: string, slug: string): string {
  if (isBrusselSectie(categorieSlug)) {
    return `/${BRUSSEL_SECTIE_SLUG}/${slug}`
  }
  return `/${categorieSlug}/${slug}`
}
