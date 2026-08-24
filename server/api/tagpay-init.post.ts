export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  const res = await $fetch<any>('https://gwt.tagpay.ng/v1/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.tagpaySecretKey}`,
      'Content-Type': 'application/json',
    },
    body: {
      amount,
      email: `${phone}@vote.stjohn.ng`,
      name,
      phone,
      reference,
      callback_url: callbackUrl,
      currency: 'NGN',
    },
  }).catch((e: any) => {
    throw createError({ statusCode: 500, message: JSON.stringify(e?.data ?? e?.message ?? 'TagPay error') })
  })

  return res
})
