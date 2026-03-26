import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { BRUSSEL_SECTIE_SLUG, BRUSSEL_SECTIE_LABEL, CATEGORIEEN } from '@/lib/categorieen'

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
          <div className="flex items-center gap-3">
            <ThemeToggle />
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
        </div>
        <nav className="flex gap-0 border-t border-border overflow-x-auto">
          <Link href="/" className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-blue-deep hover:border-b-2 hover:border-blue-deep whitespace-nowrap transition-all">
            Home
          </Link>
          {CATEGORIEEN.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-blue-deep hover:border-b-2 hover:border-blue-deep whitespace-nowrap transition-all"
            >
              {cat.naamKort}
            </Link>
          ))}
          <Link
            href={`/${BRUSSEL_SECTIE_SLUG}`}
            className="px-4 py-3 text-sm font-medium text-text-secondary hover:text-blue-deep hover:border-b-2 hover:border-blue-deep whitespace-nowrap transition-all"
          >
            {BRUSSEL_SECTIE_LABEL}
          </Link>
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
