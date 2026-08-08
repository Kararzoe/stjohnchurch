import { createClient } from '@supabase/supabase-js'

export function useSupabase() {
  const config = useRuntimeConfig()
  return createClient(config.public.supabaseUrl, config.public.supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: import.meta.client ? window.localStorage : undefined,
    }
  })
}
