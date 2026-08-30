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

  if (payload.event !== 'charge.success') return { received: true }
  if (payload.data?.status !== 'success') return { received: true }

  const supabase = createClient(config.public.supabaseUrl, config.supabaseServiceRoleKey)

  const reference = payload.data?.reference

  // Checkout-linked charges have our vote reference directly
  // COLL_ prefixed references are standalone collection account inflows — skip them
  if (reference && !reference.startsWith('COLL_') && !reference.startsWith('SUBWALLET_')) {
    await supabase.from('votes').update({ status: 'approved' }).eq('reference', reference).eq('status', 'pending')
  }

  return { received: true }
})
