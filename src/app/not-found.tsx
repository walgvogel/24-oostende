import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
      <h1 className="font-['Playfair_Display',serif] text-6xl font-extrabold text-blue-deep mb-4">
        404
      </h1>
      <p className="text-xl text-text-secondary mb-2">
        Pagina niet gevonden
      </p>
      <p className="text-text-light mb-8">
        Deze pagina bestaat niet of is verplaatst.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-deep text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Terug naar de homepage
      </Link>
    </div>
  )
}
