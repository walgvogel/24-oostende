import { getArtikelBySlug, getArtikelen, getBeantwoordeVragen } from '@/lib/queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { SocialShare } from '@/components/SocialShare'
import { FeedbackKnop } from '@/components/FeedbackKnop'
import { VraagSectie } from '@/components/VraagSectie'
import { ArtefactWeergave } from '@/components/ArtefactWeergave'
import { categorieNamenVolledig as categorieNamen } from '@/lib/categorieen'
import { getArtikelType, getInhoudsTags, ARTIKEL_TYPES } from '@/lib/artikeltypes'

function stripScripts(html: string): string {
  return html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
}

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
  const htmlInhoud = stripScripts(markdownToHtml(artikel.inhoud))
  const beantwoordeVragen = await getBeantwoordeVragen(artikel.id)
  const type = getArtikelType(artikel.tags)
  const typeConfig = ARTIKEL_TYPES[type]
  const inhoudsTags = getInhoudsTags(artikel.tags)

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
        <span className={`px-2.5 py-0.5 rounded text-[11px] font-semibold uppercase tracking-wider ${typeConfig.kleur}`}>
          {typeConfig.label}
        </span>
        <span className="bg-sand-light px-2.5 py-0.5 rounded-full text-[12px] text-text-secondary">
          {artikel.leestijd_minuten} min leestijd
        </span>
      </div>

      <SocialShare titel={artikel.titel} />

      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: htmlInhoud }}
      />

      {artikel.artefacten_html && (
        <ArtefactWeergave html={artikel.artefacten_html} />
      )}

      {inhoudsTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
          {inhoudsTags.map((tag) => (
            <span key={tag} className="bg-sand-light text-text-secondary text-[12px] px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}


      <SocialShare titel={artikel.titel} />

      <VraagSectie artikelId={artikel.id} initialVragen={beantwoordeVragen} />

      <FeedbackKnop artikelId={artikel.id} />
    </article>
  )
}
