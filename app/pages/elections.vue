<template>
  <section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')" />
    <div class="absolute inset-0 bg-navy/85" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Parish Democracy</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">Elections</h1>
      <p class="text-gray-300 mt-4 text-lg">Vote for your parish leaders</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-24 px-6 bg-cream">
    <div class="max-w-5xl mx-auto">

      <!-- Active elections -->
      <div class="text-center mb-12 reveal">
        <span class="section-label">Currently Open</span>
        <h2 class="font-playfair text-4xl font-bold text-navy">Active Elections</h2>
      </div>

      <div v-if="elections.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        <div v-for="(e, i) in elections" :key="e.id" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 p-6 group">
            <div class="flex items-start justify-between mb-4">
              <div>
                <span :class="['text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest', e.status === 'Open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
                  {{ e.status }}
                </span>
              </div>
              <span class="text-xs text-gray-400">Closes: {{ e.closes }}</span>
            </div>
            <h3 class="font-playfair font-bold text-navy text-xl mb-2 group-hover:text-gold transition-colors">{{ e.title }}</h3>
            <p class="text-gray-500 text-sm mb-4">{{ e.positions.length }} position(s) · {{ e.totalVoters }} eligible voters</p>
            <div class="flex flex-wrap gap-2 mb-5">
              <span v-for="p in e.positions" :key="p"
                class="text-xs bg-gold/10 text-gold px-3 py-1 rounded-full font-medium">{{ p }}</span>
            </div>
            <NuxtLink :to="`/vote/${e.id}`"
              class="block text-center py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5">
              Vote Now →
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="text-center py-16 text-gray-400 reveal">
        <p class="text-5xl mb-4">🗳️</p>
        <p class="text-xl font-playfair text-navy mb-2">No Active Elections</p>
        <p class="text-sm">Check back when an election is opened by the parish admin.</p>
      </div>

      <!-- How it works -->
      <div class="reveal">
        <div class="text-center mb-10">
          <span class="section-label">How It Works</span>
          <h2 class="font-playfair text-3xl font-bold text-navy">Simple & Secure Voting</h2>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div v-for="(s, i) in steps" :key="s.title" :class="`reveal delay-${(i + 1) * 100}`">
            <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center">
              <div class="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-4 text-2xl">{{ s.icon }}</div>
              <p class="text-gold font-black text-3xl font-playfair mb-1">{{ i + 1 }}</p>
              <h3 class="font-semibold text-navy mb-2">{{ s.title }}</h3>
              <p class="text-gray-500 text-sm">{{ s.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const elections = [
  {
    id: 'parish-council-2026',
    title: 'Parish Council Elections 2026',
    status: 'Open',
    closes: 'Aug 10, 2026',
    positions: ['Chairman', 'Secretary', 'Treasurer', 'PRO'],
    totalVoters: 240,
  },
]

const steps = [
  { icon: '🗳️', title: 'Open the Election', desc: 'Click on any active election below to go directly to the voting page.' },
  { icon: '✅', title: 'Cast Your Vote', desc: 'Select one candidate per position. Review your choices before submitting.' },
  { icon: '📋', title: 'Done', desc: 'Your vote is recorded securely. Results are announced by the parish admin.' },
]
</script>
