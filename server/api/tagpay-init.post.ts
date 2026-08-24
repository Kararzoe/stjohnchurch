export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) {
    return { error: 'TAGPAY_SECRET_KEY is not set' }
  }

  const body = {
    amount,
    email: `${phone}@vote.stjohn.ng`,
    name,
    phone,
    reference,
    paymentMethod: 'card',
    callback_url: callbackUrl,
    currency: 'NGN',
  }

  try {
    const res = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body,
    })
    return { success: true, res }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail), sentBody: body }
  }
})
