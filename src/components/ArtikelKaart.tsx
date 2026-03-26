import Link from 'next/link'
import type { Artikel } from '@/lib/supabase'
import { categorieKleuren, categorieNamen } from '@/lib/categorieen'
import { getArtikelType, ARTIKEL_TYPES } from '@/lib/artikeltypes'

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
  const type = getArtikelType(artikel.tags)
  const typeConfig = ARTIKEL_TYPES[type]

  return (
    <article className={`bg-bg-white rounded-[10px] overflow-hidden shadow-sm hover:shadow-md transition-shadow ${groot ? 'col-span-full' : ''}`}>
      <Link href={`/${artikel.categorie_slug}/${artikel.slug}`} className="block p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded ${kleur}`}>
            {catNaam}
          </span>
          {type !== 'nieuws' && (
            <span className={`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded ${typeConfig.kleur}`}>
              {typeConfig.label}
            </span>
          )}
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
