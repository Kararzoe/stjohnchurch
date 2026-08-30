import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  if (config.tagpayWebhookSecret) {
    const signature = getHeader(event, 'x-tagpay-signature') || ''
    const expected = crypto.createHmac('sha512', config.tagpayWebhookSecret).update(rawBody).digest('hex')
    if (signature !== expected) {
      throw createError({ statusCode: 401, message: 'Invalid signature' })
    }
  }

  let payload: any = {}
  try { payload = JSON.parse(rawBody) } catch { return { received: true } }

  const eventName = getHeader(event, 'x-tagpay-event') || payload.event
  if (eventName !== 'charge.success') return { received: true }
  if (payload.data?.status !== 'success') return { received: true }

  const reference = payload.data?.reference
  if (!reference || reference.startsWith('COLL_') || reference.startsWith('SUBWALLET_')) {
    return { received: true }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)

  // Deduplicate: only approve if still pending (idempotent — safe to replay)
  const { data: pending } = await supabase
    .from('votes')
    .select('id')
    .eq('reference', reference)
    .eq('status', 'pending')
    .limit(1)

  if (pending?.length) {
    await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')
  }

  return { received: true }
})
