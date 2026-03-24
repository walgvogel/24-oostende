import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-text-primary text-white/70 py-8 mt-12">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4 text-[13px]">
          <span>&copy; {new Date().getFullYear()} 24/Oostende. Automatisch samengesteld met AI.</span>
          <div className="flex gap-6">
            <Link href="/over-ons" className="text-white/50 hover:text-white transition-colors">
              Over ons
            </Link>
            <span className="text-white/50">Aangedreven door Claude</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
