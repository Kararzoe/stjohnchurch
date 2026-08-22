export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { reference } = await readBody(event)

  const res = await $fetch<any>(`https://api.tagpay.ng/v1/payments/verify/${reference}`, {
    headers: { Authorization: `Bearer ${config.tagpaySecretKey}` },
  })

  return res
})
