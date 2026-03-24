'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function ZoekForm({ initialQuery }: { initialQuery: string }) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/zoeken?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-lg">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Zoek artikelen..."
        className="flex-1 bg-bg-white border border-border rounded-lg px-4 py-3 text-base focus:outline-none focus:border-blue-deep transition-colors"
      />
      <button
        type="submit"
        className="bg-blue-deep text-white font-medium px-6 py-3 rounded-lg hover:bg-blue-light transition-colors"
      >
        Zoeken
      </button>
    </form>
  )
}
