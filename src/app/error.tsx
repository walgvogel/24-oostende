'use client'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="max-w-[600px] mx-auto px-6 py-20 text-center">
      <h1 className="font-['Playfair_Display',serif] text-4xl font-extrabold text-blue-deep mb-4">
        Er ging iets mis
      </h1>
      <p className="text-text-light mb-8">
        Er is een onverwachte fout opgetreden. Probeer het opnieuw.
      </p>
      <button
        onClick={reset}
        className="inline-block bg-blue-deep text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        Opnieuw proberen
      </button>
    </div>
  )
}
