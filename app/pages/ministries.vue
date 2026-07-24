<template>
  <!-- Hero -->
  <section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1800&q=80')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Get Involved</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">Ministries</h1>
      <p class="text-gray-300 mt-4 text-lg max-w-xl mx-auto">There is a place for everyone in our parish family</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-24 px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="(m, i) in ministries"
        :key="m.name"
        :class="`reveal delay-${(i % 3 + 1) * 100}`"
      >
        <div class="group bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gold/30 hover:-translate-y-2 transition-all duration-300 h-full">
          <div class="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl mb-5 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
            {{ m.icon }}
          </div>
          <h3 class="font-playfair font-bold text-navy text-xl mb-3 group-hover:text-gold transition-colors">{{ m.name }}</h3>
          <p class="text-gray-500 text-sm leading-relaxed">{{ m.desc }}</p>
          <div class="mt-5 pt-5 border-t border-gray-100">
            <NuxtLink to="/contact" class="text-xs text-gold font-semibold hover:text-navy transition-colors flex items-center gap-1 group/link">
              Get involved <span class="group-hover/link:translate-x-1 transition-transform">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const ministries = [
  { icon: '❤️', name: 'Outreach & Charity', desc: 'Serving the poor and vulnerable through food pantries, clothing drives, and community partnerships.' },
  { icon: '📖', name: 'Faith Formation', desc: 'Religious education for children, teens, and adults — including RCIA for those entering the Church.' },
  { icon: '✝️', name: 'Liturgical Ministry', desc: 'Lectors, Extraordinary Ministers of Holy Communion, altar servers, and ushers.' },
  { icon: '🙏', name: 'Adoration & Prayer', desc: 'Weekly Eucharistic Adoration and various prayer groups for all ages.' },
  { icon: '🎵', name: 'Music Ministry', desc: 'Adult choir, contemporary ensemble, and children\'s choir enriching our liturgies.' },
  { icon: '👥', name: 'Men\'s & Women\'s Groups', desc: 'Fellowship, faith sharing, and service opportunities for men and women of the parish.' },
  { icon: '👨‍👩‍👧', name: 'Family & Youth', desc: 'Youth group, teen confirmation prep, and family enrichment programs.' },
  { icon: '🕊️', name: 'Bereavement Ministry', desc: 'Supporting parishioners through grief with pastoral care and support groups.' },
  { icon: '🏫', name: 'Catholic School', desc: 'Our parish school offers faith-centered education from Pre-K through 8th grade.' },
]
</script>
