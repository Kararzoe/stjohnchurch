import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { account_id, reference } = getQuery(event) as { account_id: string; reference: string }

  if (!account_id || !reference) throw createError({ statusCode: 400, message: 'Missing account_id or reference' })

  let res: any
  try {
    res = await $fetch<any>(`https://gwt.tagpay.ng/v1/collection-accounts/${account_id}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })
  } catch (e: any) {
    return { success: false, message: 'Could not verify payment.' }
  }

  const account = res?.data ?? res
  const status = account?.status

  if (status === 'expired') return { success: false, message: 'Account expired. Please try again.' }

  // Check if any transactions came in
  const txCount = account?.transactionCount ?? 0
  if (txCount === 0) return { success: false, message: 'Payment not received yet.' }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')

  return { success: true }
})
