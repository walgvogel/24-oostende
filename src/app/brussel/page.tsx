import { TypeFilter } from '@/components/TypeFilter'
import { BRUSSEL_SECTIE_LABEL, BRUSSEL_SECTIE_SLUG } from '@/lib/categorieen'
import { getBrusselArtikelen } from '@/lib/queries'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `${BRUSSEL_SECTIE_LABEL} - 24/Oostende`,
  description: 'Brussels nieuws in het Nederlands, apart van de Oostendse homepage.',
}

export const revalidate = 300
export const dynamic = 'force-dynamic'

export default async function BrusselPage() {
  let artikelen: Awaited<ReturnType<typeof getBrusselArtikelen>> = []
  try {
    artikelen = await getBrusselArtikelen(20)
  } catch {
    // Supabase unreachable during build
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.2em] text-text-light mb-2">Sectie</p>
        <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-blue-deep">
          {BRUSSEL_SECTIE_LABEL}
        </h1>
        <p className="text-text-light mt-3 max-w-2xl">
          Artikels uit de Brusselse cyclus staan apart onder <span className="font-medium">/{BRUSSEL_SECTIE_SLUG}</span>.
          De homepage blijft bewust volledig Oostends.
        </p>
      </div>

      <TypeFilter artikelen={artikelen} />

      {artikelen.length === 0 && (
        <div className="text-center py-20 text-text-light">
          <p className="text-lg">Nog geen Brusselse artikelen gepubliceerd.</p>
          <p className="text-sm mt-2">De Brusselse Cowork-cyclus moet nog op gang komen.</p>
        </div>
      )}
    </div>
  )
}
