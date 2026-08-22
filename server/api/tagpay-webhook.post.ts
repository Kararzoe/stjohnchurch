import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  // Verify webhook signature
  const signature = getHeader(event, 'x-tagpay-signature') || getHeader(event, 'x-webhook-signature') || ''
  const expected = crypto.createHmac('sha512', config.tagpayWebhookSecret).update(rawBody).digest('hex')
  if (signature !== expected) {
    throw createError({ statusCode: 401, message: 'Invalid signature' })
  }

  const payload = JSON.parse(rawBody)
  const eventType = payload.event

  if (eventType !== 'charge.success') return { received: true }

  const reference = payload.data?.reference
  if (!reference) return { received: true }

  // Auto-approve all votes with this reference
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  await supabase
    .from('votes')
    .update({ status: 'approved' })
    .eq('reference', reference)
    .eq('status', 'pending')

  return { received: true }
})
