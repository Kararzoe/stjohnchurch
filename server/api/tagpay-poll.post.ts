export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { txId } = await readBody(event)

  const headers = {
    Authorization: `Bearer ${config.tagpaySecretKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const tx = await $fetch<any>(`https://gwt.tagpay.ng/v1/transaction/${txId}`, { headers })
    const d = tx?.data ?? {}
    return {
      bankName: d.bankName ?? d.bank_name ?? null,
      accountNumber: d.accountNumber ?? d.account_number ?? null,
      status: d.status ?? null,
    }
  } catch (e: any) {
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    return { error: typeof detail === 'string' ? detail : JSON.stringify(detail) }
  }
})
