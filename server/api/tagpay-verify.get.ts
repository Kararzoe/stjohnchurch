import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { session_key, reference } = getQuery(event) as { session_key: string; reference: string }

  if (!session_key || !reference) throw createError({ statusCode: 400, message: 'Missing session_key or reference' })

  const res = await $fetch<any>(`https://api.tagpay.ng/v1/checkout/sessions/${session_key}`, {
    headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
  })

  if (res?.status !== 'completed') {
    return { success: false, message: res?.status === 'expired' ? 'Session expired.' : 'Payment not completed yet.' }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')

  return { success: true }
})
