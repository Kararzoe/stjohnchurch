import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  if (import.meta.server) {
    const config = useRuntimeConfig()
    return createClient(config.public.supabaseUrl, config.public.supabaseKey, {
      auth: { persistSession: false }
    })
  }
  if (!client) {
    const config = useRuntimeConfig()
    client = createClient(config.public.supabaseUrl, config.public.supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage,
      }
    })
  }
  return client
}
