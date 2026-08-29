import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  if (config.tagpayWebhookSecret) {
    const signature = getHeader(event, 'x-tagpay-signature') || getHeader(event, 'x-webhook-signature') || ''
    const expected = crypto.createHmac('sha512', config.tagpayWebhookSecret).update(rawBody).digest('hex')
    if (signature !== expected) {
      throw createError({ statusCode: 401, message: 'Invalid signature' })
    }
  }

  let payload: any = {}
  try { payload = JSON.parse(rawBody) } catch { payload = await readBody(event) ?? {} }

  if (payload.event !== 'charge.success') return { received: true }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey || config.public.supabaseKey
  )

  const reference = payload.data?.reference
  const amountKobo = payload.data?.amount
  const amountNaira = amountKobo ? Math.round(amountKobo / 100) : null

  if (reference) {
    const { data: byRef } = await supabase.from('votes').select('id').eq('reference', reference).eq('status', 'pending').limit(1)
    if (byRef?.length) {
      await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')
      return { received: true }
    }
  }

  if (amountNaira) {
    const { data: byAmount } = await supabase
      .from('votes')
      .select('reference')
      .eq('status', 'pending')
      .eq('bank', 'TagPay')
      .eq('amount', amountNaira)
      .order('created_at', { ascending: true })
      .limit(1)
    if (byAmount?.length) {
      await supabase.from('votes').update({ status: 'approved' }).eq('reference', byAmount[0].reference).eq('status', 'pending')
    }
  }

  return { received: true }
})
