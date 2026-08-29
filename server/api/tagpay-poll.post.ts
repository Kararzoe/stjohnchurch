import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { collectionAccountId, reference } = await readBody(event)

  if (!collectionAccountId || !reference) return { error: 'collectionAccountId and reference required' }

  try {
    const res = await $fetch<any>(`https://gwt.tagpay.ng/v1/collection-accounts/${collectionAccountId}`, {
      headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
    })

    const d = res?.data ?? res
    const paid = (d.transactionCount ?? 0) > 0 || d.lastCollectionAt != null

    if (paid) {
      const supabase = createClient(
        config.public.supabaseUrl,
        config.supabaseServiceRoleKey || config.public.supabaseKey
      )
      await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')
      return { paid: true }
    }

    return { paid: false, status: d.status }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
