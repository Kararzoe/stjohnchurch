export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, email, amount, reference } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }
  if (!reference || !amount) return { error: 'reference and amount are required' }

  const headers = {
    Authorization: `Bearer ${config.tagpaySecretKey}`,
    'Content-Type': 'application/json',
  }

  const payload = {
    amount: amount * 100,
    reference,
    currency: 'NGN',
    customer: {
      name,
      email: email || 'voter@stjohncatholicchurch.org',
    },
    callback_url: 'https://stjohncatholicchurch.org/harvest-vote?step=verify',
  }

  const urls = [
    'https://gwt.tagpay.ng/v1/charges',
    'https://gwt.tagpay.ng/charges',
    'https://api.tagpay.ng/v1/charges',
  ]

  for (const url of urls) {
    try {
      const res = await $fetch<any>(url, { method: 'POST', headers, body: payload })
      const paymentUrl =
        res?.data?.checkoutUrl ?? res?.data?.checkout_url ??
        res?.data?.authorizationUrl ?? res?.data?.authorization_url ??
        res?.checkoutUrl ?? res?.checkout_url ??
        res?.authorizationUrl ?? res?.authorization_url
      if (paymentUrl) return { success: true, paymentUrl, reference }
      return { error: 'No checkout URL in response', raw: res, url }
    } catch (e: any) {
      const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
      if (url === urls[urls.length - 1]) {
        return { error: typeof detail === 'string' ? detail : JSON.stringify(detail), url }
      }
    }
  }

  return { error: 'All TagPay endpoints failed' }
})
