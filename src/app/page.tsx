import { getArtikelen } from '@/lib/queries'
import { TypeFilter } from '@/components/TypeFilter'

export const revalidate = 300 // revalidate every 5 minutes

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let artikelen: Awaited<ReturnType<typeof getArtikelen>> = []
  try {
    artikelen = await getArtikelen(20)
  } catch {
    // Supabase unreachable during build
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-blue-deep mb-4">
        Laatste nieuws
      </h2>

      <TypeFilter artikelen={artikelen} />

      {artikelen.length === 0 && (
        <div className="text-center py-20 text-text-light">
          <p className="text-lg">Nog geen artikelen gepubliceerd.</p>
          <p className="text-sm mt-2">De redactie is druk bezig!</p>
        </div>
      )}
    </div>
  )
}
