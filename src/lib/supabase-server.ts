import { createClient, SupabaseClient } from '@supabase/supabase-js'

let _client: SupabaseClient | null = null

export function getSupabaseServer(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY is niet geconfigureerd')
    }
    _client = createClient(url, key)
  }
  return _client
}

// Backward-compatible proxy: supabaseServer.from(...) werkt zoals voorheen
// maar initialiseert pas bij eerste gebruik (niet bij module-evaluatie)
export const supabaseServer = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabaseServer() as unknown as Record<string | symbol, unknown>)[prop]
  },
})
