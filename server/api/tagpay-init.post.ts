export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) {
    return { error: 'TAGPAY_SECRET_KEY is not set' }
  }

  try {
    const init = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: { amount, email: `${phone}@vote.stjohn.ng`, name, phone, reference, paymentMethod: 'bank_transfer', callback_url: callbackUrl, currency: 'NGN' },
    })

    const gatewayRef = init?.data?.gatewayReference
    const txId = init?.data?.id
    if (!gatewayRef && !txId) return { error: 'No transaction reference returned', init }

    // Try UUID id first, fall back to gatewayReference
    const checkoutUrl = `https://checkout.tagpay.ng/pay/${txId ?? gatewayRef}`
    return { success: true, checkoutUrl, reference }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
