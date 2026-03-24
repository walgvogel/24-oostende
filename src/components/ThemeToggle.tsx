'use client'

import { useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('system')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored) {
      setTheme(stored)
    }
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement

    if (theme === 'system') {
      localStorage.removeItem('theme')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      root.classList.toggle('dark', prefersDark)
    } else {
      localStorage.setItem('theme', theme)
      root.classList.toggle('dark', theme === 'dark')
    }
  }, [theme, mounted])

  // Luister naar systeemwijzigingen als 'system' actief is
  useEffect(() => {
    if (theme !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
    }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [theme])

  if (!mounted) return null

  const next = (): Theme => {
    if (theme === 'light') return 'dark'
    if (theme === 'dark') return 'system'
    return 'light'
  }

  const icon = theme === 'dark' ? (
    // Maan
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ) : theme === 'light' ? (
    // Zon
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  ) : (
    // Systeem (monitor)
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )

  const label = theme === 'light' ? 'Licht' : theme === 'dark' ? 'Donker' : 'Systeem'

  return (
    <button
      onClick={() => setTheme(next())}
      className="text-text-light hover:text-blue-deep transition-colors flex items-center gap-1.5"
      aria-label={`Thema: ${label}. Klik om te wisselen.`}
      title={label}
    >
      {icon}
    </button>
  )
}
