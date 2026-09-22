import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  if (config.tagpayWebhookSecret) {
    const signature = getHeader(event, 'x-tagpay-signature') || ''
    // Try with full secret first, TagPay uses full whsec_ string as HMAC key
    const secret = config.tagpayWebhookSecret
    const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex')
    const sigBuffer = Buffer.from(signature)
    const expBuffer = Buffer.from(expected)
    const valid = sigBuffer.length === expBuffer.length && crypto.timingSafeEqual(sigBuffer, expBuffer)
    if (!valid) {
      throw createError({ statusCode: 401, message: 'Invalid signature' })
    }
  }

  let payload: any = {}
  try { payload = JSON.parse(rawBody) } catch { return { received: true } }

  const eventName = getHeader(event, 'x-tagpay-event') || payload.event
  if (eventName !== 'charge.success') return { received: true }
  if (payload.data?.status !== 'success') return { received: true }

  const reference = payload.data?.reference
  if (!reference) return { received: true }

  // Extract our vote_ reference from COLL_<accountId>_<ourReference> format
  let voteReference = reference
  if (reference.startsWith('COLL_')) {
    const voteIdx = reference.indexOf('vote_')
    if (voteIdx !== -1) {
      voteReference = reference.slice(voteIdx)
    } else {
      return { received: true }
    }
  }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)
  await supabase.from('votes').update({ status: 'approved' }).eq('reference', voteReference).eq('status', 'pending')

  return { received: true }
})
