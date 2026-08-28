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

    // Poll up to 8x with 3s gap for virtual account
    for (let i = 0; i < 8; i++) {
      await new Promise(r => setTimeout(r, 3000))
      const tx = await $fetch<any>(`https://gwt.tagpay.ng/v1/transaction/${txId}`, { headers })
      const d = tx?.data ?? {}
      // Return ALL fields so we can see exactly what TagPay sends back
      if (d.bankName || d.accountNumber || d.bank_name || d.account_number) {
        return {
          success: true,
          bankName: d.bankName ?? d.bank_name ?? '',
          accountNumber: d.accountNumber ?? d.account_number ?? '',
          reference,
          raw: d,
        }
      }
    }

    return { error: 'TagPay did not assign a virtual account after waiting. Please use manual bank transfer.', raw: init?.data }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
