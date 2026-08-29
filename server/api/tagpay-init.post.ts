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
    res = await $fetch<any>('https://api.tagpay.ng/v1/collection-accounts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        type: 'static',
        amount: amount * 100,
        reference,
        customer_name: name,
        customer_phone: phone,
        metadata: { name, phone },
      },
    })
  } catch (e: any) {
    const msg = e?.data?.message || e?.data?.error || e?.message || 'TagPay request failed'
    throw createError({ statusCode: 502, message: msg })
  }

  const accountNumber = res?.account_number || res?.accountNumber || res?.data?.account_number || res?.data?.accountNumber
  const accountName = res?.account_name || res?.accountName || res?.data?.account_name || res?.data?.accountName || 'TagPay Virtual Account'
  const bankName = res?.bank_name || res?.bankName || res?.data?.bank_name || res?.data?.bankName || 'Bank Transfer'

  if (!accountNumber) {
    throw createError({ statusCode: 502, message: `TagPay did not return an account number. Response: ${JSON.stringify(res)}` })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const rows = voteRows.map((r: any) => ({ ...r, reference, bank: 'TagPay', status: 'pending' }))
  const { error } = await supabase.from('votes').insert(rows)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { accountNumber, accountName, bankName, reference }
})
