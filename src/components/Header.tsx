import Link from 'next/link'

const categories = [
  { slug: 'politiek', naam: 'Politiek' },
  { slug: 'samenleving', naam: 'Samenleving' },
  { slug: 'cultuur', naam: 'Cultuur' },
  { slug: 'sport', naam: 'Sport' },
  { slug: 'economie', naam: 'Economie' },
  { slug: 'verkeer-mobiliteit', naam: 'Verkeer' },
  { slug: 'natuur-milieu', naam: 'Natuur' },
  { slug: 'lifestyle', naam: 'Lifestyle' },
]

export function Header() {
  return (
    <header className="bg-bg-white border-b border-border sticky top-0 z-50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="flex items-baseline gap-2.5">
            <div className="bg-blue-deep rounded-lg text-white font-extrabold text-[15px] px-2.5 py-1.5 leading-none tracking-tight self-center">
              24
            </div>
            <div>
              <h1 className="font-['Playfair_Display',serif] text-[28px] font-extrabold text-blue-deep tracking-tight">
                24<span className="text-sunset">/</span>Oostende
              </h1>
              <span className="text-[13px] text-text-light">
                Lokaal nieuws uit de stad der koninginnebaden
              </span>
            </div>
          </Link>
          <Link
            href="/zoeken"
            className="text-text-light hover:text-blue-deep transition-colors"
            aria-label="Zoeken"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
        </div>
        <nav className="flex gap-0 border-t border-border overflow-x-auto">
          <Link href="/" className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-blue-deep hover:border-b-2 hover:border-blue-deep whitespace-nowrap transition-all">
            Home
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-blue-deep hover:border-b-2 hover:border-blue-deep whitespace-nowrap transition-all"
            >
              {cat.naam}
            </Link>
          ))}
          <Link
            href="/schuimkoppen"
            className="px-4 py-3 text-sm font-medium text-sunset-dark italic hover:border-b-2 hover:border-sunset whitespace-nowrap transition-all"
          >
            Schuimkoppen
          </Link>
        </nav>
      </div>
    </header>
  )
}
