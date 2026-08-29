import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const reference = getQuery(event).reference as string
  if (!reference) throw createError({ statusCode: 400, message: 'Missing reference' })

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const { data } = await supabase
    .from('votes')
    .select('status')
    .eq('reference', reference)
    .limit(1)
    .single()

  return { approved: data?.status === 'approved' }
})
