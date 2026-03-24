import Link from 'next/link'
import type { Artikel } from '@/lib/supabase'

const categorieKleuren: Record<string, string> = {
  politiek: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
  samenleving: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  cultuur: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  sport: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  economie: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'verkeer-mobiliteit': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  'natuur-milieu': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  veiligheid: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-300',
  lifestyle: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300',
}

const categorieNamen: Record<string, string> = {
  politiek: 'Politiek',
  samenleving: 'Samenleving',
  cultuur: 'Cultuur',
  sport: 'Sport',
  economie: 'Economie',
  'verkeer-mobiliteit': 'Verkeer',
  'natuur-milieu': 'Natuur',
  veiligheid: 'Veiligheid',
  lifestyle: 'Lifestyle',
}

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function ArtikelKaart({ artikel, groot = false }: { artikel: Artikel; groot?: boolean }) {
  const kleur = categorieKleuren[artikel.categorie_slug] || 'bg-gray-100 text-gray-800'
  const catNaam = categorieNamen[artikel.categorie_slug] || artikel.categorie_slug

  return (
    <article className={`bg-bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow ${groot ? 'col-span-full' : ''}`}>
      <Link href={`/${artikel.categorie_slug}/${artikel.slug}`} className="block p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded ${kleur}`}>
            {catNaam}
          </span>
          {artikel.publicatie_datum && (
            <span className="text-[13px] text-text-light">
              {formatDatum(artikel.publicatie_datum)}
            </span>
          )}
        </div>
        <h2 className={`font-['Playfair_Display',serif] font-bold leading-tight mb-2 ${groot ? 'text-[32px]' : 'text-xl'}`}>
          {artikel.titel}
        </h2>
        {artikel.samenvatting && (
          <p className="text-text-secondary text-[15px] leading-relaxed line-clamp-2">
            {artikel.samenvatting}
          </p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <span className="bg-sand-light text-text-secondary text-[12px] px-2.5 py-0.5 rounded-full">
            {artikel.leestijd_minuten} min leestijd
          </span>
        </div>
      </Link>
    </article>
  )
}
