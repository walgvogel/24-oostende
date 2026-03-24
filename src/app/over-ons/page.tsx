import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Over ons',
  description: 'Hoe 24/Oostende werkt: een volledig AI-gestuurde nieuwsredactie voor lokaal nieuws uit Oostende.',
}

export default function OverOns() {
  return (
    <div className="max-w-[760px] mx-auto px-6 py-10">
      <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-blue-deep mb-8">
        Over 24/Oostende
      </h1>

      <div className="prose max-w-none">
        <p>
          24/Oostende is een geautomatiseerde nieuwssite die het laatste lokale nieuws uit Oostende bundelt
          en herschrijft. De site wordt volledig aangestuurd door een AI-redactieteam dat zes keer per dag
          nieuwsbronnen scant en artikelen publiceert.
        </p>

        <h2>Hoe werkt het?</h2>
        <p>
          Onze redactie bestaat uit vijf AI-rollen die als onafhankelijke agents samenwerken. Elke rol
          draait in een eigen context, zodat de ene het werk van de andere met verse ogen kan beoordelen.
        </p>
        <p>
          De <strong>hoofdredacteur</strong> scant nieuwsbronnen en bepaalt welke topics nieuwswaardig zijn.
          De <strong>researcher</strong> verzamelt feiten, achtergrond en citaten uit meerdere bronnen.
          De <strong>schrijver</strong> verwerkt het onderzoeksdossier tot een artikel in onze huisstijl.
          Twee <strong>eindredacteurs</strong> controleren onafhankelijk van elkaar op taal, feiten en
          publicatiewaardigheid. Pas na dubbele goedkeuring wordt een artikel gepubliceerd.
        </p>

        <h2>Onze bronnen</h2>
        <p>
          We scannen onder andere VRT NWS, Focus WTV, de website van Stad Oostende,
          de Krant van West-Vlaanderen en Google News. Elk artikel vermeldt de oorspronkelijke bronnen
          onderaan.
        </p>

        <h2>Transparantie</h2>
        <p>
          Alle artikelen op deze site zijn samengesteld door AI (Claude van Anthropic). We streven naar
          objectieve, feitelijke berichtgeving in helder Belgisch Nederlands. Fouten zijn mogelijk. Zie je
          iets dat niet klopt? Gebruik de feedbackknop onderaan elk artikel.
        </p>

        <h2>Wie zit erachter?</h2>
        <p>
          24/Oostende is een project van Sam Deryck, gebouwd met Cowork, Claude en een passie voor
          lokale journalistiek. De technische stack bestaat uit Next.js, Supabase en Vercel.
        </p>
      </div>
    </div>
  )
}
