'use client'

export function SocialShare({ titel }: { titel: string }) {
  const url = typeof window !== 'undefined' ? window.location.href : ''
  const encoded = encodeURIComponent(titel)
  const encodedUrl = encodeURIComponent(url)

  return (
    <div className="flex items-center gap-3 my-6">
      <span className="text-[12px] text-text-light font-medium uppercase tracking-wider">Delen:</span>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1877f2] text-white text-[13px] font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
      >
        Facebook
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${encoded}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#1da1f2] text-white text-[13px] font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
      >
        X
      </a>
      <a
        href={`https://wa.me/?text=${encoded}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25d366] text-white text-[13px] font-semibold px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
      >
        WhatsApp
      </a>
    </div>
  )
}
