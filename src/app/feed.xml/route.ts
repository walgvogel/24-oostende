import { getArtikelen } from '@/lib/queries'

export const dynamic = 'force-dynamic'
export const revalidate = 300

export async function GET() {
  let artikelen: Awaited<ReturnType<typeof getArtikelen>> = []
  try {
    artikelen = await getArtikelen(50)
  } catch {
    // Supabase unreachable
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://24-oostende.vercel.app'

  const items = artikelen
    .map(
      (artikel) => `
    <item>
      <title><![CDATA[${artikel.titel}]]></title>
      <link>${siteUrl}/${artikel.categorie_slug}/${artikel.slug}</link>
      <guid isPermaLink="true">${siteUrl}/${artikel.categorie_slug}/${artikel.slug}</guid>
      <description><![CDATA[${artikel.samenvatting || ''}]]></description>
      <pubDate>${artikel.publicatie_datum ? new Date(artikel.publicatie_datum).toUTCString() : ''}</pubDate>
      <category>${artikel.categorie_slug}</category>
    </item>`
    )
    .join('')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>24/Oostende</title>
    <link>${siteUrl}</link>
    <description>Lokaal nieuws uit de stad der koninginnebaden</description>
    <language>nl-BE</language>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`

  return new Response(rss.trim(), {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  })
}
