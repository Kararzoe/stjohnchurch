import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { reference } = getQuery(event) as { reference: string }

  if (!reference) throw createError({ statusCode: 400, message: 'Missing reference' })

  let res: any
  try {
    res = await $fetch<any>(`https://api.tagpay.ng/v1/virtual-accounts/${reference}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })
  } catch (e: any) {
    return { success: false, message: 'Could not verify payment.' }
  }

  const status = res?.status || res?.data?.status
  if (status !== 'paid' && status !== 'completed' && status !== 'success' && status !== 'settled') {
    return { success: false, message: status === 'expired' ? 'Account expired.' : 'Payment not received yet.' }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')

  return { success: true }
})
