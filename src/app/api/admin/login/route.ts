import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const ADMIN_WACHTWOORD = process.env.ADMIN_WACHTWOORD || '24oostende-admin'

// Simple token: hash of password + secret. In production, use a proper session library.
function generateToken(): string {
  const payload = `admin-${Date.now()}-${Math.random().toString(36).slice(2)}`
  // Base64-encode as a simple session token
  return Buffer.from(payload).toString('base64')
}

export async function POST(request: Request) {
  try {
    const { wachtwoord } = await request.json()

    if (wachtwoord !== ADMIN_WACHTWOORD) {
      return NextResponse.json({ error: 'Verkeerd wachtwoord' }, { status: 401 })
    }

    const token = generateToken()
    const cookieStore = await cookies()

    cookieStore.set('admin-session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 uur
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Ongeldige request' }, { status: 400 })
  }
}
