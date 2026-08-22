export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { name, phone, amount, reference, callbackUrl } = await readBody(event)

  try {
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
    })
    return res
  } catch (e: any) {
    const msg = e?.data?.message || e?.message || 'TagPay initialization failed'
    throw createError({ statusCode: 500, message: msg })
  }
})
