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
  const enumsToTry = ['one_time', 'oneTime', 'one-time', 'temporary', 'dynamic']
  let lastError = ''
  for (const typeVal of enumsToTry) {
    try {
      res = await $fetch<any>('https://api.tagpay.ng/v1/collection-accounts', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.tagpaySecretKey}`,
          'Content-Type': 'application/json',
        },
        body: {
          type: typeVal,
          expires_at: Math.floor(Date.now() / 1000) + 1800,
          amount: amount * 100,
          reference,
          customer_name: name,
          customer_phone: phone,
          metadata: { name, phone },
        },
      })
      break
    } catch (e: any) {
      lastError = e?.data?.message || e?.data?.error || e?.message || ''
      if (!lastError.includes('enum')) throw createError({ statusCode: 502, message: lastError })
    }
  }
  if (!res) throw createError({ statusCode: 502, message: `All type values failed. Last error: ${lastError}` })

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
