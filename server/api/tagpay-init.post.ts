import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)

  const { name, phone, amount, voteRows } = body
  if (!name || !phone || !amount || !voteRows?.length) {
    throw createError({ statusCode: 400, message: 'Missing required fields' })
  }

  const reference = `vote_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  let res: any
  try {
    res = await $fetch<any>('https://api.tagpay.ng/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: amount * 100, // kobo
        reference,
        customer_name: name,
        callback_url: `${config.public.siteUrl}/vote-callback`,
        metadata: { name, phone },
      },
    })
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'TagPay request failed'
    throw createError({ statusCode: 502, message: msg })
  }

  if (!res?.payment_url) {
    throw createError({ statusCode: 502, message: `TagPay did not return a checkout URL. Response: ${JSON.stringify(res)}` })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const rows = voteRows.map((r: any) => ({ ...r, reference, bank: 'TagPay', status: 'pending' }))
  const { error } = await supabase.from('votes').insert(rows)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { url: res.payment_url, reference, sessionKey: res.session_key }
})
