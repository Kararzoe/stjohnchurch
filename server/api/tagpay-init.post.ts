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
        ref: reference,
        callback_url: callbackUrl,
        currency: 'NGN',
      },
    })
    return res
  } catch (e: any) {
    // Return full error details so we can debug
    const detail = e?.data ?? e?.response?._data ?? e?.message ?? 'unknown'
    throw createError({ statusCode: 500, message: JSON.stringify(detail) })
  }
})
