import crypto from 'crypto'
import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const rawBody = await readRawBody(event) ?? ''

  if (config.tagpayWebhookSecret) {
    const signature = getHeader(event, 'x-tagpay-signature') || ''
    const expected = crypto.createHmac('sha512', config.tagpayWebhookSecret).update(rawBody).digest('hex')
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

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)

  const reference = payload.data?.reference

  // For collection account inflows, reference is prefixed COLL_<accountId>_<ourReference>
  // Extract our vote reference from it
  let voteReference = reference
  if (reference?.startsWith('COLL_')) {
    // Format: COLL_<uuid>_<our_reference>
    const parts = reference.split('_')
    // Our reference starts with 'vote_', find it
    const voteIdx = parts.findIndex((p: string) => p === 'vote')
    if (voteIdx !== -1) {
      voteReference = parts.slice(voteIdx).join('_')
    }
  }

  if (!voteReference) return { received: true }

  const { data: pending } = await supabase
    .from('votes')
    .select('id')
    .eq('reference', voteReference)
    .eq('status', 'pending')
    .limit(1)

  if (pending?.length) {
    await supabase.from('votes').update({ status: 'approved' }).eq('reference', voteReference).eq('status', 'pending')
  }

  return { received: true }
})
