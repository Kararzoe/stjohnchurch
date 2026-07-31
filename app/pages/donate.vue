<template>
  <!-- Hero -->
  <section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1800&q=80')" />
    <div class="absolute inset-0 bg-navy/85" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Give Back</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">Support Us</h1>
      <p class="text-gray-300 mt-4 text-lg">Your generosity makes a difference</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-24 px-6 bg-cream">
    <div class="max-w-lg mx-auto reveal">
      <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <h2 class="font-playfair text-3xl font-bold text-navy mb-2 text-center">Make a Gift</h2>
        <p class="text-gray-400 text-sm text-center mb-6">St. John of the Cross Catholic Church, Mararaba</p>

        <!-- Currency Toggle -->
        <div class="flex items-center justify-center mb-6">
          <div class="flex bg-gray-100 rounded-full p-1 gap-1">
            <button
              v-for="c in currencies"
              :key="c.code"
              :class="[
                'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                currency === c.code
                  ? 'bg-navy text-white shadow'
                  : 'text-gray-500 hover:text-navy'
              ]"
              @click="currency = c.code; selected = null"
            >
              {{ c.flag }} {{ c.code }}
            </button>
          </div>
        </div>

        <!-- Amount grid -->
        <div class="mb-6">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Amount</p>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="a in currentAmounts"
              :key="a.value"
              :class="[
                'py-3 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5',
                selected === a.value
                  ? 'bg-gold border-gold text-white shadow-lg shadow-gold/30'
                  : 'border-gray-200 text-gray-700 hover:border-gold hover:text-gold'
              ]"
              @click="selected = a.value; customAmount = ''"
            >
              {{ a.label }}
            </button>
          </div>

          <!-- Custom amount -->
          <div class="mt-3 relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">{{ currencySymbol }}</span>
            <input
              v-model="customAmount"
              type="number"
              min="1"
              placeholder="Enter custom amount"
              class="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all"
              @input="selected = null"
            />
          </div>
        </div>

        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input v-model="form.name" type="text" placeholder="John Doe"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="you@example.com"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Frequency</label>
            <select v-model="form.frequency" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
              <option>One-time gift</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Annually</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Designate Gift</label>
            <select v-model="form.designation" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
              <option>General Parish Fund</option>
              <option>Building & Maintenance</option>
              <option>Outreach & Charity</option>
              <option>Faith Formation</option>
              <option>Music Ministry</option>
            </select>
          </div>
          <button type="submit"
            class="w-full py-4 rounded-full bg-gold text-white font-semibold text-lg hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-0.5 mt-2">
            Proceed to Payment ❤️
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const currencies = [
  { code: 'NGN', flag: '🇳🇬', symbol: '₦' },
  { code: 'USD', flag: '🇺🇸', symbol: '$' },
]

const currency = ref('NGN')
const selected = ref<number | null>(null)
const customAmount = ref('')

const amountsByCurrency: Record<string, { label: string; value: number }[]> = {
  NGN: [
    { label: '₦2,000', value: 2000 },
    { label: '₦5,000', value: 5000 },
    { label: '₦10,000', value: 10000 },
    { label: '₦20,000', value: 20000 },
    { label: '₦50,000', value: 50000 },
    { label: 'Other', value: 0 },
  ],
  USD: [
    { label: '$10', value: 10 },
    { label: '$25', value: 25 },
    { label: '$50', value: 50 },
    { label: '$100', value: 100 },
    { label: '$250', value: 250 },
    { label: 'Other', value: 0 },
  ],
}

const currentAmounts = computed(() => amountsByCurrency[currency.value])
const currencySymbol = computed(() => currencies.find(c => c.code === currency.value)?.symbol ?? '₦')

const form = reactive({
  name: '',
  email: '',
  frequency: 'One-time gift',
  designation: 'General Parish Fund',
})

function handleSubmit() {
  const amount = customAmount.value ? Number(customAmount.value) : selected.value
  if (!amount) return alert('Please select or enter an amount.')
  // TODO: integrate payment gateway (Paystack for NGN, Stripe for USD)
  console.log({ currency: currency.value, amount, ...form })
}
</script>
