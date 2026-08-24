export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) {
    return { error: 'TAGPAY_SECRET_KEY is not set' }
  }

  try {
    const res = await $fetch<any>('https://merchant.tagpay.ng/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount,
        email: `${phone}@vote.stjohn.ng`,
        name,
        reference,
        callback_url: callbackUrl,
        currency: 'NGN',
      },
    })

    const paymentUrl = res?.paymentUrl ?? res?.data?.paymentUrl ?? res?.payment_url ?? res?.data?.payment_url
    if (!paymentUrl) return { error: 'No paymentUrl in response', res }

    return { success: true, checkoutUrl: paymentUrl, reference }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
