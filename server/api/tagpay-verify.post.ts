import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { sessionKey, reference } = await readBody(event)

  if (!sessionKey || !reference) return { error: 'sessionKey and reference required' }

  try {
    const res = await $fetch<any>(`https://gwt.tagpay.ng/v1/checkout/sessions/${sessionKey}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })

    const status = res?.status
    if (status === 'completed') {
      const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey || config.public.supabaseKey
      )
      await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')
      return { approved: true }
    }

    return { approved: false, status }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
