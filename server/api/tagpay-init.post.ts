export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  const { name, email, phone, amount, reference, callbackUrl } = body

  const res = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.tagpaySecretKey}`,
      'Content-Type': 'application/json',
    },
    body: { amount, email: email || `${phone}@vote.stjohn.ng`, reference, callback_url: callbackUrl },
  })

  return res
})
