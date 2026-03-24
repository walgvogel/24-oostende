import { getArtikelenByCategorie, getCategorieen } from '@/lib/queries'
import { ArtikelKaart } from '@/components/ArtikelKaart'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { categorieNamenVolledig } from '@/lib/categorieen'

export const revalidate = 300
export const dynamic = 'force-dynamic'

const categorieNamen: Record<string, string> = {
  ...categorieNamenVolledig,
  schuimkoppen: 'Schuimkoppen',
}

type Props = { params: Promise<{ categorie: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categorie } = await params
  const naam = categorieNamen[categorie]
  if (!naam) return {}
  return {
    title: `${naam} - Nieuws uit Oostende`,
    description: `Het laatste ${naam.toLowerCase()}-nieuws uit Oostende.`,
  }
}

export async function generateStaticParams() {
  try {
    const categorieen = await getCategorieen()
    return categorieen.map((cat) => ({ categorie: cat.slug }))
  } catch {
    return []
  }
}

export default async function CategoriePage({ params }: Props) {
  const { categorie } = await params
  const naam = categorieNamen[categorie]
  if (!naam) notFound()

  let artikelen: Awaited<ReturnType<typeof getArtikelenByCategorie>> = []
  try {
    artikelen = await getArtikelenByCategorie(categorie)
  } catch {
    // Supabase unreachable
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8">
      <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-blue-deep mb-8">
        {naam}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artikelen.map((artikel) => (
          <ArtikelKaart key={artikel.id} artikel={artikel} />
        ))}
      </div>

      {artikelen.length === 0 && (
        <p className="text-text-light text-center py-12">
          Nog geen artikelen in deze categorie.
        </p>
      )}
    </div>
  )
}
