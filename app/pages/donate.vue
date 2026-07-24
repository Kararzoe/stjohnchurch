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
        <p class="text-gray-400 text-sm text-center mb-8">St. John Catholic Church is a registered 501(c)(3) nonprofit</p>

        <!-- Amount grid -->
        <div class="mb-6">
          <p class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Select Amount</p>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="a in amounts"
              :key="a"
              :class="[
                'py-3 rounded-xl border text-sm font-semibold transition-all hover:-translate-y-0.5',
                selected === a
                  ? 'bg-gold border-gold text-white shadow-lg shadow-gold/30'
                  : 'border-gray-200 text-gray-700 hover:border-gold hover:text-gold'
              ]"
              @click="selected = a"
            >
              {{ a }}
            </button>
          </div>
        </div>

        <form class="space-y-4" @submit.prevent>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input type="text" placeholder="John Doe"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input type="email" placeholder="you@example.com"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Frequency</label>
            <select class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
              <option>One-time gift</option>
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Annually</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Designate Gift</label>
            <select class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
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
const amounts = ['$25', '$50', '$100', '$250', '$500', 'Other']
const selected = ref('$50')
</script>
