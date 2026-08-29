import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  if (config.tagpayWebhookSecret) {
    const sig = getHeader(event, 'x-tagpay-signature') || getHeader(event, 'x-webhook-signature') || ''
    const expected = crypto.createHmac('sha512', config.tagpayWebhookSecret).update(rawBody).digest('hex')
    if (sig !== expected) throw createError({ statusCode: 401, message: 'Invalid signature' })
  }

  let payload: any = {}
  try { payload = JSON.parse(rawBody) } catch { payload = await readBody(event) ?? {} }

  if (payload.event !== 'charge.success') return { received: true }

  const reference = payload.data?.reference
  if (!reference) return { received: true }

  const supabase = createClient(
    config.public.supabaseUrl,
    config.supabaseServiceRoleKey || config.public.supabaseKey
  )

  await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')

  return { received: true }
})
