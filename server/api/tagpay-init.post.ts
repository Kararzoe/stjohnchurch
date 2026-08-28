export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }

  const headers = {
    Authorization: `Bearer ${config.tagpaySecretKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const init = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
      method: 'POST',
      headers,
      body: { amount: amount * 100, email: `${phone}@vote.stjohn.ng`, name, phone, reference, paymentMethod: 'bank_transfer', callback_url: callbackUrl, currency: 'NGN' },
    })

    const txId = init?.data?.id
    if (!txId) return { error: 'No transaction ID returned', raw: init }

    const d = init.data
    const bankName = d?.bankName ?? d?.bank_name ?? d?.virtualAccount?.bankName ?? d?.virtual_account?.bank_name ?? null
    const accountNumber = d?.accountNumber ?? d?.account_number ?? d?.virtualAccount?.accountNumber ?? d?.virtual_account?.account_number ?? null
    const checkoutUrl = d?.checkoutUrl ?? d?.checkout_url ?? d?.payment_url ?? d?.paymentUrl ?? null

    return { success: true, txId, reference, bankName, accountNumber, checkoutUrl, raw: d }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
