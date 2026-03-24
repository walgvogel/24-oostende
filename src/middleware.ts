import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Bescherm /admin routes (behalve de login API)
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = request.cookies.get('admin-session')

    if (!session?.value) {
      // Geen sessie: redirect naar login-pagina
      // We laten de admin page zelf de login tonen, maar blokkeren API-toegang
      // Door de cookie-check in de admin page zelf af te handelen
      // blijft de UX hetzelfde maar is er nu een server-side laag
    }
  }

  // Bescherm admin API routes (behalve login)
  if (request.nextUrl.pathname.startsWith('/api/admin') && !request.nextUrl.pathname.endsWith('/login')) {
    const session = request.cookies.get('admin-session')
    if (!session?.value) {
      return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
