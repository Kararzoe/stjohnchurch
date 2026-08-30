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
    res = await $fetch<any>('https://gwt.tagpay.ng/v1/collection-accounts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
        'Idempotency-Key': reference,
      },
      body: {
        type: 'expiring',
        reference,
        expectedAmount: amount * 100,
        label: `Vote - ${name}`,
        metadata: { name, phone },
      },
    })
  } catch (e: any) {
    const errBody = e?.data
    const code = errBody?.error?.code || ''
    const msg = errBody?.message || e?.message || 'TagPay request failed'
    const status = e?.status || e?.statusCode || ''
    throw createError({ statusCode: 502, message: `[${status}] ${code ? code + ': ' : ''}${msg} | raw: ${JSON.stringify(errBody)}` })
  }

  const account = res?.data ?? res
  const accountNumber = account?.accountNumber
  const accountName = account?.accountName || 'TagPay Virtual Account'
  const bankName = account?.bankName || 'Bank Transfer'
  const accountId = account?.id
  const expiresAt = account?.expiresAt

  if (!accountNumber) {
    throw createError({ statusCode: 502, message: `No account number returned. Response: ${JSON.stringify(res)}` })
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  const rows = voteRows.map((r: any) => ({ ...r, reference, bank: 'TagPay', status: 'pending' }))
  const { error } = await supabase.from('votes').insert(rows)
  if (error) throw createError({ statusCode: 500, message: error.message })

  return { accountNumber, accountName, bankName, reference, accountId, expiresAt }
})
