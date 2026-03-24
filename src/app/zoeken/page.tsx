import { zoekArtikelen } from '@/lib/queries'
import { ArtikelKaart } from '@/components/ArtikelKaart'
import { ZoekForm } from '@/components/ZoekForm'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Zoeken',
}

type Props = { searchParams: Promise<{ q?: string }> }

export default async function ZoekenPage({ searchParams }: Props) {
  const { q } = await searchParams
  let resultaten: Awaited<ReturnType<typeof zoekArtikelen>> = []
  try {
    resultaten = q ? await zoekArtikelen(q) : []
  } catch {
    // Supabase unreachable
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-blue-deep mb-8">
        Zoeken
      </h1>

      <ZoekForm initialQuery={q || ''} />

      {q && (
        <div className="mt-8">
          <p className="text-text-light mb-6">
            {resultaten.length} resultaten voor &ldquo;{q}&rdquo;
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resultaten.map((artikel) => (
              <ArtikelKaart key={artikel.id} artikel={artikel} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
