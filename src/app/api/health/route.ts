import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  const checks: Record<string, { status: string; detail?: string }> = {}
  let healthy = true

  // Check 1: Supabase bereikbaar
  if (!supabaseUrl || !supabaseKey) {
    checks.supabase = { status: 'fail', detail: 'Env vars ontbreken' }
    healthy = false
  } else {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { count, error } = await supabase
        .from('artikelen')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'gepubliceerd')

      if (error) {
        checks.supabase = { status: 'fail', detail: error.message }
        healthy = false
      } else {
        checks.supabase = { status: 'ok', detail: `${count} gepubliceerde artikelen` }
      }
    } catch (e) {
      checks.supabase = { status: 'fail', detail: String(e) }
      healthy = false
    }
  }

  // Check 2: Laatste publicatie < 48u oud
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase
        .from('artikelen')
        .select('publicatie_datum, titel')
        .eq('status', 'gepubliceerd')
        .order('publicatie_datum', { ascending: false })
        .limit(1)
        .single()

      if (error || !data) {
        checks.laatstePublicatie = { status: 'warn', detail: 'Geen artikelen gevonden' }
      } else {
        const uurGeleden = Math.round(
          (Date.now() - new Date(data.publicatie_datum).getTime()) / (1000 * 60 * 60)
        )
        if (uurGeleden > 48) {
          checks.laatstePublicatie = {
            status: 'warn',
            detail: `${uurGeleden}u geleden: "${data.titel}"`,
          }
        } else {
          checks.laatstePublicatie = {
            status: 'ok',
            detail: `${uurGeleden}u geleden: "${data.titel}"`,
          }
        }
      }
    } catch {
      checks.laatstePublicatie = { status: 'warn', detail: 'Kon laatste publicatie niet ophalen' }
    }
  }

  // Check 3: Artikelen vandaag
  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = createClient(supabaseUrl, supabaseKey)
      const vandaag = new Date().toISOString().split('T')[0]
      const { count, error } = await supabase
        .from('artikelen')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'gepubliceerd')
        .gte('publicatie_datum', vandaag)

      if (error) {
        checks.artikelenVandaag = { status: 'warn', detail: error.message }
      } else {
        checks.artikelenVandaag = {
          status: (count ?? 0) > 0 ? 'ok' : 'warn',
          detail: `${count ?? 0} artikelen vandaag`,
        }
      }
    } catch {
      checks.artikelenVandaag = { status: 'warn', detail: 'Kon niet tellen' }
    }
  }

  return NextResponse.json(
    {
      status: healthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 }
  )
}
