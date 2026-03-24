'use client'

import { useState } from 'react'
import { submitFeedback } from '@/lib/queries'

export function FeedbackKnop({ artikelId }: { artikelId: string }) {
  const [open, setOpen] = useState(false)
  const [bericht, setBericht] = useState('')
  const [email, setEmail] = useState('')
  const [verstuurd, setVerstuurd] = useState(false)
  const [error, setError] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await submitFeedback(artikelId, bericht, email)
      setVerstuurd(true)
      setBericht('')
      setEmail('')
    } catch {
      setError(true)
    }
  }

  if (verstuurd) {
    return (
      <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-green-800 dark:text-green-300 text-sm">
        Bedankt voor je melding! We bekijken het zo snel mogelijk.
      </div>
    )
  }

  return (
    <div className="mt-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="text-sm text-text-light hover:text-blue-deep border border-border rounded-lg px-4 py-2 hover:border-blue-deep transition-colors"
        >
          Fout gezien? Laat het ons weten
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-sand-light rounded-lg p-5 space-y-3">
          <h3 className="font-semibold text-sm">Fout melden</h3>
          <textarea
            value={bericht}
            onChange={(e) => setBericht(e.target.value)}
            placeholder="Beschrijf de fout..."
            required
            rows={3}
            className="w-full bg-bg-white border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-deep"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Je e-mailadres (optioneel)"
            className="w-full bg-bg-white border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-deep"
          />
          {error && <p className="text-red-600 text-sm">Er ging iets mis. Probeer het opnieuw.</p>}
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-deep text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-blue-light transition-colors"
            >
              Versturen
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-text-light hover:text-text-secondary"
            >
              Annuleren
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
