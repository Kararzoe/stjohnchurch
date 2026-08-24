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

    // Poll up to 5× for virtual account details
    let bankName: string | null = null
    let accountNumber: string | null = null
    for (let i = 0; i < 5; i++) {
      await new Promise(r => setTimeout(r, 1200))
      const tx = await $fetch<any>(`https://gwt.tagpay.ng/v1/transaction/${txId}`, { headers })
      bankName = tx?.data?.bankName ?? null
      accountNumber = tx?.data?.accountNumber ?? null
      if (bankName && accountNumber) break
    }

    return { success: true, bankName, accountNumber, reference }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
