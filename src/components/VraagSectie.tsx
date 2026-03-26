'use client'

import { useState, useEffect } from 'react'
import type { Vraag } from '@/lib/supabase'

const COOLDOWN_MS = 60_000

function formatDatum(datum: string) {
  return new Date(datum).toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function VraagSectie({
  artikelId,
  initialVragen,
}: {
  artikelId: string
  initialVragen: Vraag[]
}) {
  const [vragen] = useState<Vraag[]>(initialVragen)
  const [vraag, setVraag] = useState('')
  const [naam, setNaam] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [verstuurd, setVerstuurd] = useState(false)
  const [error, setError] = useState('')
  const [laden, setLaden] = useState(false)
  const [cooldown, setCooldown] = useState(false)

  useEffect(() => {
    const laatsteSubmit = sessionStorage.getItem('vraag_cooldown')
    if (laatsteSubmit && Date.now() - Number(laatsteSubmit) < COOLDOWN_MS) {
      setCooldown(true)
      const rest = COOLDOWN_MS - (Date.now() - Number(laatsteSubmit))
      const timer = setTimeout(() => setCooldown(false), rest)
      return () => clearTimeout(timer)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLaden(true)

    try {
      const res = await fetch('/api/vragen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          artikel_id: artikelId,
          vraag: vraag.trim(),
          naam: naam.trim() || null,
          website: honeypot,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Er ging iets mis.')
        return
      }

      setVerstuurd(true)
      setVraag('')
      setNaam('')
      sessionStorage.setItem('vraag_cooldown', String(Date.now()))
    } catch {
      setError('Verbinding mislukt. Probeer het opnieuw.')
    } finally {
      setLaden(false)
    }
  }

  return (
    <section className="mt-12 pt-8 border-t border-border">
      <h2 className="font-['Playfair_Display',serif] text-xl font-bold mb-1">
        Stel een vraag
      </h2>
      <p className="text-sm text-text-light mb-6">
        Onze AI-redacteur beantwoordt regelmatig de beste lezersvraag op basis van het onderzoeksdossier.
      </p>

      {/* Beantwoorde vragen */}
      {vragen.length > 0 && (
        <div className="space-y-6 mb-8">
          {vragen.map((v) => (
            <div key={v.id} className="bg-sand-light rounded-lg p-5">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-sm font-semibold text-text-primary">
                  {v.naam || 'Anonieme lezer'}
                </span>
                <span className="text-xs text-text-light">
                  {v.beantwoord_op && formatDatum(v.beantwoord_op)}
                </span>
              </div>
              <p className="text-sm text-text-secondary italic mb-3">
                &ldquo;{v.vraag}&rdquo;
              </p>
              <div className="text-sm text-text-primary leading-relaxed whitespace-pre-line">
                {v.antwoord}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Formulier */}
      {verstuurd ? (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-300 text-sm">
          Bedankt voor je vraag! Als deze wordt geselecteerd, verschijnt het antwoord hier.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-sand-light rounded-lg p-5 space-y-3">
          <textarea
            value={vraag}
            onChange={(e) => setVraag(e.target.value)}
            placeholder="Wat wil je weten over dit artikel?"
            required
            minLength={10}
            maxLength={500}
            rows={3}
            className="w-full bg-bg-white border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-deep"
          />
          <input
            type="text"
            value={naam}
            onChange={(e) => setNaam(e.target.value)}
            placeholder="Je naam (wordt getoond bij je vraag)"
            maxLength={50}
            className="w-full bg-bg-white border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-deep"
          />
          {/* Honeypot — onzichtbaar voor gebruikers */}
          <input
            type="text"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="absolute opacity-0 h-0 w-0 pointer-events-none"
          />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={laden || cooldown}
            className="bg-blue-deep text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {laden ? 'Versturen...' : cooldown ? 'Even geduld...' : 'Vraag versturen'}
          </button>
        </form>
      )}
    </section>
  )
}
