import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { reference } = await readBody(event)

  if (!reference) return { error: 'Reference required' }

  try {
    const res = await $fetch<any>(`https://api.tagpay.ng/v1/payments/verify/${reference}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })

    const isSuccess = res?.status === 'success' || res?.data?.status === 'success' || res?.data?.status === 'successful'
    if (isSuccess) {
      const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey || config.public.supabaseKey
      )
      await supabase
        .from('votes')
        .update({ status: 'approved' })
        .eq('reference', reference)
        .eq('status', 'pending')

      return { success: true, approved: true, data: res.data }
    }

    return res
  } catch (e: any) {
    return { error: e.message }
  }
})
