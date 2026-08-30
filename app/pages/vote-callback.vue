<template>
  <div class="min-h-screen bg-cream flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div v-if="status === 'loading'" class="space-y-4">
        <div class="text-5xl">⏳</div>
        <p class="text-navy font-bold">Verifying your payment...</p>
      </div>

      <div v-else-if="status === 'success'" class="space-y-5">
        <div class="w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-xl" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <svg class="w-10 h-10 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 class="font-playfair text-4xl font-black text-navy">Vote Submitted!</h1>
        <p class="text-gray-500 text-sm">Your payment was successful and your vote has been recorded.</p>
        <NuxtLink to="/" class="inline-block px-8 py-4 rounded-xl text-white font-black shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">Back to Home</NuxtLink>
      </div>

      <div v-else class="space-y-5">
        <div class="text-5xl">❌</div>
        <h1 class="font-playfair text-3xl font-black text-navy">Payment Failed</h1>
        <p class="text-gray-500 text-sm">{{ errorMsg || 'Something went wrong. Please try again.' }}</p>
        <NuxtLink to="/harvest-vote" class="inline-block px-8 py-4 rounded-xl text-white font-black shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">Try Again</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const status = ref<'loading' | 'success' | 'failed'>('loading')
const errorMsg = ref('')

onMounted(async () => {
  const account_id = sessionStorage.getItem('tagpay_account_id')
  const reference = sessionStorage.getItem('tagpay_reference')

  if (!account_id || !reference) {
    status.value = 'failed'
    errorMsg.value = 'Missing payment details. Please try again.'
    return
  }

  try {
    const res = await $fetch<any>(`/api/tagpay-verify?account_id=${account_id}&reference=${reference}`)
    if (res.success) {
      sessionStorage.removeItem('tagpay_account_id')
      sessionStorage.removeItem('tagpay_reference')
      status.value = 'success'
    } else {
      status.value = 'failed'
      errorMsg.value = res.message || 'Payment could not be verified.'
    }
  } catch (e: any) {
    status.value = 'failed'
    errorMsg.value = e?.data?.message || 'Verification failed.'
  }
})
</script>
