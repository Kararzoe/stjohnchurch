export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }

  try {
    const res = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: amount * 100,
        email: `${phone}@vote.stjohn.ng`,
        name,
        phone,
        reference,
        currency: 'NGN',
        callback_url: callbackUrl,
      },
    })

    const gatewayRef = res?.data?.gatewayReference
    if (!gatewayRef) return { error: 'No gateway reference returned', raw: res }

    return {
      success: true,
      checkoutUrl: `https://merchant.tagpay.ng/pay?sessionKey=${gatewayRef}`,
      reference,
    }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
