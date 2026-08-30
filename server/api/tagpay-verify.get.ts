import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { reference } = getQuery(event) as { reference: string }

  if (!reference) throw createError({ statusCode: 400, message: 'Missing reference' })

  let res: any
  try {
    res = await $fetch<any>(`https://gwt.tagpay.ng/v1/charges/${reference}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })
  } catch (e: any) {
    return { success: false, message: 'Could not verify payment.' }
  }

  const data = res?.data ?? res
  const status = data?.status

  if (status !== 'success' && status !== 'paid' && status !== 'completed') {
    return { success: false, message: 'Payment not completed yet.' }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')

  return { success: true }
})
