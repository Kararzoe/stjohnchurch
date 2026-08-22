import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)

  const from = new Date('2025-08-09T00:00:00.000Z')
  const to = new Date('2025-08-20T23:59:59.999Z')

  const { data: rows, error: fetchError } = await supabase
    .from('votes')
    .select('id, created_at')
    .eq('status', 'pending')
    .gte('created_at', from.toISOString())
    .lte('created_at', to.toISOString())

  if (fetchError) throw createError({ statusCode: 500, message: fetchError.message })
  if (!rows?.length) return { approved: 0, message: 'No pending votes found in that range.' }

  const ids = rows.map(r => r.id)
  const { error: updateError } = await supabase.from('votes').update({ status: 'approved' }).in('id', ids)
  if (updateError) throw createError({ statusCode: 500, message: updateError.message })

  return { approved: ids.length, message: `Successfully approved ${ids.length} votes from Aug 9–20.` }
})
