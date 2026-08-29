export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, email, amount, reference } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }

  try {
    const res = await $fetch<any>('https://gwt.tagpay.ng/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: amount * 100,
        reference,
        customerName: name,
        customerEmail: email || 'voter@stjohncatholicchurch.org',
        callbackUrl: 'https://stjohncatholicchurch.org/harvest-vote?step=verify',
      },
    })

    const paymentUrl = res?.paymentUrl ?? res?.data?.paymentUrl
    if (!paymentUrl) return { error: 'No payment URL returned', raw: res }

    return { success: true, paymentUrl, reference }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
