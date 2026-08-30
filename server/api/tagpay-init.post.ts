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
    res = await $fetch<any>('https://gwt.tagpay.ng/v1/charges', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: amount * 100,
        reference,
        customer_email: `${phone}@vote.stjohncatholicchurch.org`,
        customer_name: name,
        customer_phone: phone,
        callback_url: `${config.public.siteUrl}/vote-callback`,
        metadata: { name, phone },
      },
    })
  } catch (e: any) {
    const msg = e?.data?.message || e?.data?.error || e?.message || 'TagPay request failed'
    throw createError({ statusCode: 502, message: msg })
  }

  const data = res?.data ?? res
  const url = data?.payment_url || data?.paymentUrl || data?.url || data?.checkout_url

  if (!url) {
    throw createError({ statusCode: 502, message: `No payment URL returned. Response: ${JSON.stringify(res)}` })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const rows = voteRows.map((r: any) => ({ ...r, reference, bank: 'TagPay', status: 'pending' }))
  const { error } = await supabase.from('votes').insert(rows)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { url, reference }
})
