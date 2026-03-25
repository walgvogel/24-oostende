'use client'

import { useEffect, useRef } from 'react'

export function InteractiveQuiz({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const handleClick = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.quiz-btn')
      if (!btn) return

      const isCorrect = btn.dataset.answer === 'true'

      // Reset alle knoppen in dezelfde vraaggroep
      const parent = btn.closest('.quiz-question') || btn.parentElement
      parent?.querySelectorAll<HTMLButtonElement>('.quiz-btn').forEach((b) => {
        b.style.backgroundColor = ''
        b.style.color = ''
      })

      btn.style.backgroundColor = isCorrect ? '#22c55e' : '#ef4444'
      btn.style.color = 'white'
    }

    container.addEventListener('click', handleClick)
    return () => container.removeEventListener('click', handleClick)
  }, [html])

  return (
    <div
      ref={ref}
      className="mt-10 pt-6 border-t border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
