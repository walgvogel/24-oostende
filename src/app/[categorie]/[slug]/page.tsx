import { getArtikelBySlug, getArtikelen } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SocialShare } from '@/components/SocialShare'
import { FeedbackKnop } from '@/components/FeedbackKnop'
import { categorieNamenVolledig as categorieNamen } from '@/lib/categorieen'
import DOMPurify from 'isomorphic-dompurify'

export const revalidate = 300
export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ categorie: string; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const artikel = await getArtikelBySlug(slug)
  if (!artikel) return {}
  return {
    title: artikel.titel,
    description: artikel.samenvatting || undefined,
  }
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(?!<[hp])(.+)$/gm, '<p>$1</p>')
    .replace(/<p><h([23])>/g, '<h$1>')
    .replace(/<\/h([23])><\/p>/g, '</h$1>')
}

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default async function ArtikelPage({ params }: Props) {
  const { slug, categorie } = await params
  const artikel = await getArtikelBySlug(slug)
  if (!artikel) notFound()

  const catNaam = categorieNamen[artikel.categorie_slug] || artikel.categorie_slug
  const htmlInhoud = DOMPurify.sanitize(markdownToHtml(artikel.inhoud))

  return (
    <article className="max-w-[760px] mx-auto px-6 py-10">
      <div className="text-[13px] text-text-light mb-6">
        <Link href="/" className="text-blue-light hover:underline">Home</Link>
        {' > '}
        <Link href={`/${categorie}`} className="text-blue-light hover:underline">{catNaam}</Link>
        {' > '}
        <span>{artikel.titel.slice(0, 40)}...</span>
      </div>

      <h1 className="font-['Playfair_Display',serif] text-[38px] font-extrabold leading-[1.15] mb-4">
        {artikel.titel}
      </h1>

      <div className="flex items-center gap-4 text-sm text-text-light pb-6 mb-8 border-b border-border">
        {artikel.publicatie_datum && <span>{formatDatum(artikel.publicatie_datum)}</span>}
        <span className="bg-sand-light px-2.5 py-0.5 rounded-full text-[12px] text-text-secondary">
          {artikel.leestijd_minuten} min leestijd
        </span>
      </div>

      <SocialShare titel={artikel.titel} />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlInhoud }}
      />

      {artikel.tags && artikel.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {artikel.tags.map((tag) => (
            <span key={tag} className="bg-sand-light text-text-secondary text-[12px] px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {artikel.bronnen && artikel.bronnen.length > 0 && (
        <div className="text-[13px] text-text-light italic mt-6 pt-4 border-t border-border">
          Bronnen:{' '}
          {artikel.bronnen.map((bron, i) => (
            <span key={i}>
              {i > 0 && ', '}
              <a href={bron.url} target="_blank" rel="noopener noreferrer" className="text-blue-light underline">
                {bron.naam}
              </a>
            </span>
          ))}
        </div>
      )}

      <SocialShare titel={artikel.titel} />

      <FeedbackKnop artikelId={artikel.id} />
    </article>
  )
}
