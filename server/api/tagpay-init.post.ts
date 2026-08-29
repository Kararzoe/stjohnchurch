export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, email, amount, reference } = body

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }
  if (!reference || !amount) return { error: 'reference and amount are required' }

  const headers = {
    Authorization: `Bearer ${config.tagpaySecretKey}`,
    'Content-Type': 'application/json',
  }

  const payload = {
    amount: amount * 100,
    reference,
    customerName: name,
    customerEmail: email || 'voter@stjohncatholicchurch.org',
    callbackUrl: 'https://stjohncatholicchurch.org/harvest-vote?step=verify',
  }

  // Try gwt.tagpay.ng first, then payment.tagpay.ng as fallback
  const urls = [
    'https://gwt.tagpay.ng/checkout/sessions',
    'https://payment.tagpay.ng/checkout/sessions',
    'https://api.tagpay.ng/checkout/sessions',
  ]

  for (const url of urls) {
    try {
      const res = await $fetch<any>(url, { method: 'POST', headers, body: payload })
      const paymentUrl = res?.paymentUrl ?? res?.data?.paymentUrl ?? res?.checkout_url ?? res?.data?.checkout_url
      if (paymentUrl) return { success: true, paymentUrl, reference }
      // Got a response but no URL — return it so we can debug
      return { error: 'No payment URL in response', raw: res, url }
    } catch (e: any) {
      const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
      // Only return error on last URL
      if (url === urls[urls.length - 1]) {
        return { error: typeof detail === 'string' ? detail : JSON.stringify(detail), url }
      }
    }
  }

  return { error: 'All TagPay endpoints failed' }
})
