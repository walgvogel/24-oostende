import type { Correctie } from '@/lib/supabase'

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function CorrectieNotitie({ correcties }: { correcties: Correctie[] }) {
  if (!correcties || correcties.length === 0) return null

  return (
    <div className="mt-8 pt-6 border-t border-border">
      <h3 className="text-sm font-semibold text-text-secondary mb-3">
        {correcties.length === 1 ? 'Correctie' : 'Correcties'}
      </h3>
      <ul className="space-y-2">
        {correcties.map((c, i) => (
          <li key={i} className="text-sm text-text-light">
            <span className="font-medium text-text-secondary">{formatDatum(c.datum)}</span>
            {' — '}
            {c.omschrijving}
          </li>
        ))}
      </ul>
    </div>
  )
}
