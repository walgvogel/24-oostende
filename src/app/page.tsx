import { getArtikelen } from '@/lib/queries'
import { ArtikelKaart } from '@/components/ArtikelKaart'

export const revalidate = 300 // revalidate every 5 minutes

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let artikelen: Awaited<ReturnType<typeof getArtikelen>> = []
  try {
    artikelen = await getArtikelen(20)
  } catch {
    // Supabase unreachable during build
  }

  const hero = artikelen[0]
  const rest = artikelen.slice(1)

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      {hero && (
        <section className="mb-10">
          <ArtikelKaart artikel={hero} groot />
        </section>
      )}

      <section>
        <h2 className="font-['Playfair_Display',serif] text-2xl font-bold text-blue-deep mb-6">
          Laatste nieuws
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map((artikel) => (
            <ArtikelKaart key={artikel.id} artikel={artikel} />
          ))}
        </div>
      </section>

      {artikelen.length === 0 && (
        <div className="text-center py-20 text-text-light">
          <p className="text-lg">Nog geen artikelen gepubliceerd.</p>
          <p className="text-sm mt-2">De redactie is druk bezig!</p>
        </div>
      )}
    </div>
  )
}
