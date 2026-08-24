export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) {
    return { error: 'TAGPAY_SECRET_KEY is not set' }
  }

  const headers = {
    Authorization: `Bearer ${config.tagpaySecretKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const init = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers,
      body: { amount, email: `${phone}@vote.stjohn.ng`, name, phone, reference, paymentMethod: 'bank_transfer', callback_url: callbackUrl, currency: 'NGN' },
    })

    const txId = init?.data?.id
    if (!txId) return { error: 'No transaction ID returned', init }

    return { success: true, init }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
