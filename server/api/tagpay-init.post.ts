export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }

  try {
    const init = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: { amount: amount * 100, email: `${phone}@vote.stjohn.ng`, name, phone, reference, paymentMethod: 'bank_transfer', callback_url: callbackUrl, currency: 'NGN' },
    })

    const gatewayRef = init?.data?.gatewayReference
    if (!gatewayRef) return { error: 'No gateway reference returned', raw: init }

    return {
      success: true,
      reference,
      checkoutUrl: `https://merchant.tagpay.ng/pay?sessionKey=${gatewayRef}`,
    }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
