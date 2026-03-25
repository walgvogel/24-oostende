'use client'

import { useEffect, useRef } from 'react'

interface Props {
  html: string
}

export function ArtefactWeergave({ html }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Voer alle <script>-tags uit die in de HTML zitten
    const scripts = container.querySelectorAll('script')
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script')
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      )
      newScript.textContent = oldScript.textContent
      oldScript.parentNode?.replaceChild(newScript, oldScript)
    })
  }, [html])

  return (
    <div
      ref={containerRef}
      className="mt-10 pt-6 border-t border-border"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
