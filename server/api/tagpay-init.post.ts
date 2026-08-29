export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, amount, reference } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY not set' }

  try {
    const res = await $fetch<any>('https://gwt.tagpay.ng/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        amount: amount * 100,
        reference,
        customer_name: name,
        customer_email: 'voter@stjohncatholicchurch.org',
        callback_url: 'https://stjohncatholicchurch.org/harvest-vote?verify=1',
      },
    })

    if (!res?.payment_url) return { error: 'No payment_url returned', raw: res }

    return { success: true, paymentUrl: res.payment_url, sessionKey: res.session_key }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
