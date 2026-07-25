<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Join Us</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Mass Times</h1>
      <p class="text-gray-300 mt-3 text-base md:text-lg">All are welcome at the table of the Lord</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-4xl mx-auto space-y-8 md:space-y-12">
      <div v-for="s in schedule" :key="s.category" class="reveal">
        <h2 class="font-playfair text-xl sm:text-2xl font-bold text-navy mb-3 flex items-center gap-3">
          <span class="text-gold-light">✝</span> {{ s.category }}
        </h2>
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table class="w-full text-sm">
            <thead>
              <tr class="bg-navy text-white">
                <th class="text-left px-4 py-3 font-medium">Day</th>
                <th class="text-left px-4 py-3 font-medium">Time</th>
                <th class="text-left px-4 py-3 font-medium hidden sm:table-cell">Note</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(r, i) in s.rows" :key="i"
                :class="['border-t border-gray-50 hover:bg-gold/5 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50']">
                <td class="px-4 py-3 text-gray-700 text-xs sm:text-sm">{{ r.day }}</td>
                <td class="px-4 py-3 font-bold text-navy text-xs sm:text-sm">{{ r.time }}</td>
                <td class="px-4 py-3 text-gray-400 hidden sm:table-cell text-xs sm:text-sm">{{ r.note }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notice -->
      <div class="reveal flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800">
        <span class="text-2xl shrink-0">⚠️</span>
        <p class="text-sm leading-relaxed">
          Mass times may change on holidays and special occasions. Please check the bulletin
          or call the parish office at <strong>(555) 123-4567</strong> to confirm.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const schedule = [
  {
    category: 'Weekend Masses',
    rows: [
      { day: 'Saturday', time: '5:00 PM', note: 'Vigil Mass' },
      { day: 'Sunday', time: '7:30 AM', note: '' },
      { day: 'Sunday', time: '9:00 AM', note: '' },
      { day: 'Sunday', time: '11:00 AM', note: 'Family Mass' },
      { day: 'Sunday', time: '5:00 PM', note: 'Evening Mass' },
    ],
  },
  {
    category: 'Weekday Masses',
    rows: [
      { day: 'Monday – Friday', time: '7:00 AM', note: '' },
      { day: 'Monday – Friday', time: '12:10 PM', note: '' },
      { day: 'Saturday', time: '8:00 AM', note: '' },
    ],
  },
  {
    category: 'Confession (Reconciliation)',
    rows: [
      { day: 'Saturday', time: '3:30 – 4:30 PM', note: '' },
      { day: 'Wednesday', time: '6:00 – 7:00 PM', note: '' },
      { day: 'By appointment', time: 'Call the office', note: '(555) 123-4567' },
    ],
  },
]
</script>
