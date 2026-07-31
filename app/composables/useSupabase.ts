import { createClient } from '@supabase/supabase-js'

let client: ReturnType<typeof createClient> | null = null

export function useSupabase() {
  if (!client) {
    const config = useRuntimeConfig()
    client = createClient(config.public.supabaseUrl, config.public.supabaseKey)
  }
  return client
}
