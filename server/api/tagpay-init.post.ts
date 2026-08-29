export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, amount, reference } = await readBody(event)

  if (!config.tagpaySecretKey) return { error: 'TAGPAY_SECRET_KEY is not set' }

  try {
    const res = await $fetch<any>('https://gwt.tagpay.ng/v1/collection-accounts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.tagpaySecretKey}`,
        'Content-Type': 'application/json',
      },
      body: {
        type: 'expiring',
        expectedAmount: amount * 100,
        name,
        label: name,
        reference,
      },
    })

    const d = res?.data
    if (!d?.accountNumber) return { error: 'No account number returned', raw: res }

    return {
      success: true,
      accountNumber: d.accountNumber,
      accountName: d.accountName,
      expiresAt: d.expiresAt,
      reference,
    }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
