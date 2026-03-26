'use client'

import { useState } from 'react'
import type { Artikel } from '@/lib/supabase'
import { ArtikelKaart } from './ArtikelKaart'
import { getArtikelType, ARTIKEL_TYPES, type ArtikelType } from '@/lib/artikeltypes'

const FILTERS: { value: ArtikelType | 'alle'; label: string }[] = [
  { value: 'alle', label: 'Alles' },
  { value: 'nieuws', label: 'Nieuws' },
  { value: 'achtergrond', label: 'Achtergrond' },
  { value: 'reportage', label: 'Reportage' },
]

export function TypeFilter({ artikelen }: { artikelen: Artikel[] }) {
  const [filter, setFilter] = useState<ArtikelType | 'alle'>('alle')

  const gefilterd = filter === 'alle'
    ? artikelen
    : artikelen.filter(a => getArtikelType(a.tags) === filter)

  const hero = gefilterd[0]
  const rest = gefilterd.slice(1)

  // Tel per type voor de badges
  const counts: Record<string, number> = { alle: artikelen.length }
  for (const a of artikelen) {
    const t = getArtikelType(a.tags)
    counts[t] = (counts[t] || 0) + 1
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-8 flex-wrap">
        {FILTERS.map(f => {
          const count = counts[f.value] || 0
          const active = filter === f.value
          return (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`text-[13px] font-medium px-4 py-2 rounded-full transition-colors ${
                active
                  ? 'bg-blue-deep text-white dark:bg-blue-400 dark:text-gray-900'
                  : 'bg-sand-light text-text-secondary hover:bg-sand dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
              {count > 0 && (
                <span className={`ml-1.5 text-[11px] ${active ? 'opacity-75' : 'opacity-50'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {hero && (
        <section className="mb-10">
          <ArtikelKaart artikel={hero} groot />
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((artikel) => (
              <ArtikelKaart key={artikel.id} artikel={artikel} />
            ))}
          </div>
        </section>
      )}

      {gefilterd.length === 0 && (
        <div className="text-center py-16 text-text-light">
          <p className="text-lg">Geen {filter === 'alle' ? 'artikelen' : ARTIKEL_TYPES[filter as ArtikelType].label.toLowerCase() + 'artikelen'} gevonden.</p>
        </div>
      )}
    </>
  )
}
