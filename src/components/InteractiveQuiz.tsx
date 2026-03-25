'use client'

import { useEffect, useRef } from 'react'

export function InteractiveQuiz({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const quizCards = container.querySelectorAll<HTMLElement>('.quiz-card')
    const cleanups: (() => void)[] = []

    quizCards.forEach(card => {
      const buttons = card.querySelectorAll<HTMLButtonElement>('.quiz-btn')
      const feedbackCorrect = card.querySelector<HTMLElement>('.feedback-correct')
      const feedbackIncorrect = card.querySelector<HTMLElement>('.feedback-incorrect')
      const resetBtn = card.querySelector<HTMLButtonElement>('.quiz-reset')

      if (buttons.length === 0) return

      const handleAnswer = (btn: HTMLButtonElement) => {
        const isCorrect = btn.getAttribute('data-answer') === 'true'
        buttons.forEach(b => {
          b.disabled = true
          if (b.getAttribute('data-answer') === 'true') b.classList.add('correct')
          else if (b === btn && !isCorrect) b.classList.add('incorrect')
        })
        if (isCorrect) {
          feedbackCorrect?.classList.remove('hidden')
          feedbackIncorrect?.classList.add('hidden')
        } else {
          feedbackIncorrect?.classList.remove('hidden')
          feedbackCorrect?.classList.add('hidden')
        }
        resetBtn?.classList.remove('hidden')
      }

      const handleReset = () => {
        buttons.forEach(b => {
          b.disabled = false
          b.classList.remove('correct', 'incorrect')
        })
        feedbackCorrect?.classList.add('hidden')
        feedbackIncorrect?.classList.add('hidden')
        resetBtn?.classList.add('hidden')
      }

      const listeners: [HTMLButtonElement, () => void][] = []
      buttons.forEach(btn => {
        const fn = () => handleAnswer(btn)
        btn.addEventListener('click', fn)
        listeners.push([btn, fn])
      })
      if (resetBtn) {
        resetBtn.addEventListener('click', handleReset)
        listeners.push([resetBtn, handleReset])
      }
      cleanups.push(() => listeners.forEach(([el, fn]) => el.removeEventListener('click', fn)))
    })

    return () => cleanups.forEach(fn => fn())
  }, [html])

  return (
    <div
      ref={ref}
      className="mt-10 pt-6 border-t border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
