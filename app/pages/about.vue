<template>
  <!-- Hero -->
  <section class="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-2.jpg')" />
    <div class="absolute inset-0 bg-navy/75" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Our Parish</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">About Us</h1>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <!-- History -->
  <section class="py-14 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
      <div class="reveal-left">
        <span class="section-label">Our History</span>
        <h2 class="font-playfair text-2xl sm:text-4xl font-bold text-navy mb-4">Over a Century of Faith</h2>
        <p class="text-gray-600 leading-relaxed mb-4">
          St. John Catholic Church was founded in 1902 by a small group of immigrant families
          who gathered in a modest hall to celebrate Mass. Over the decades, the parish grew
          into a vibrant community of thousands of families.
        </p>
        <p class="text-gray-600 leading-relaxed">
          Today we continue that legacy — welcoming all who seek the Lord, celebrating the
          sacraments with joy, and serving our neighbors with the love of Christ.
        </p>
      </div>
      <div class="reveal-right">
        <div class="relative">
          <img
            src="/church-2.jpg"
            alt="Church interior"
            class="rounded-2xl shadow-2xl w-full h-80 object-cover"
          />
          <div class="absolute -bottom-4 -left-4 md:-bottom-6 md:-left-6 bg-navy rounded-2xl p-4 md:p-6 text-white shadow-xl">
            <p class="font-playfair text-5xl font-black gold-text">1902</p>
            <p class="text-gray-400 text-sm">Year Founded</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="py-12 md:py-20 px-4 bg-white">
    <div class="max-w-4xl mx-auto grid grid-cols-3 gap-4 md:gap-8 text-center">
      <div v-for="s in stats" :key="s.label" class="reveal">
        <p class="font-playfair text-3xl sm:text-5xl font-black gold-text mb-1">{{ s.value }}</p>
        <p class="text-gray-500 text-xs sm:text-sm uppercase tracking-widest">{{ s.label }}</p>
      </div>
    </div>
  </section>

  <!-- Parish Priest -->
  <section class="py-14 md:py-24 px-4 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Leadership</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Meet Our Pastor</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row reveal">
        <div class="md:w-72 shrink-0">
          <img src="/priest-1.jpg" alt="Rev. Frederick Wukari" class="w-full h-72 md:h-full object-cover object-top" />
        </div>
        <div class="p-6 md:p-10 flex flex-col justify-center">
          <div class="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
            <span class="text-gold text-lg">✝</span>
          </div>
          <h3 class="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-1">Rev. Frederick Wukari, OSA Esq.</h3>
          <p class="text-gold font-semibold text-sm mb-1">Parish Priest</p>
          <p class="text-gray-400 text-xs mb-5">St. John of the Cross, Mararaba Gurku, Nasarawa State</p>
          <div class="w-10 h-0.5 bg-gold/40 mb-5" />
          <p class="text-gray-600 leading-relaxed text-sm">
            Rev. Frederick Wukari, OSA Esq. serves as the Parish Priest of St. John of the Cross
            Catholic Church, Mararaba Gurku, Nasarawa State. A member of the
            <strong class="text-navy">Order of Saint Augustine (OSA)</strong>, he shepherds the
            parish community with zeal, compassion, and a deep devotion to the Holy Eucharist.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Assistant Priests -->
  <section class="py-14 px-4 bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Associate Clergy</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Assistant Priests</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(p, i) in associates" :key="p.name" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="bg-cream rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 group flex gap-5 p-5">
            <div class="w-16 h-16 rounded-full bg-navy flex items-center justify-center shrink-0 border-2 border-gold/30">
              <span class="text-2xl">✝</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gold font-bold uppercase tracking-widest mb-0.5">{{ p.role }}</p>
              <h3 class="font-playfair font-bold text-navy text-lg group-hover:text-gold transition-colors">{{ p.name }}</h3>
              <p class="text-gray-500 text-xs mt-1 leading-relaxed">{{ p.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Mission -->
  <section class="relative py-24 px-6 overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-4.jpg')" />
    <div class="absolute inset-0 bg-navy/85" />
    <div class="relative z-10 max-w-3xl mx-auto text-center text-white reveal">
      <span class="section-label">Our Mission</span>
      <h2 class="font-playfair text-2xl sm:text-4xl font-bold mb-6">What We Believe</h2>
      <p class="text-gray-300 text-base sm:text-xl leading-relaxed italic">
        "To know Christ, to make Christ known, and to serve all people in His name —
        through worship, community, and compassionate outreach."
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const stats = [
  { value: '2,400+', label: 'Registered Families' },
  { value: '30+', label: 'Out Stations' },
  { value: '120+', label: 'Years of Service' },
]

const associates = [
  {
    name: 'Rev. Fr. [Associate Priest]',
    role: 'Assistant Priest',
    desc: 'Assists with the celebration of Mass, sacraments, and pastoral care of the faithful.',
  },
  {
    name: 'Rev. Fr. [Associate Priest 2]',
    role: 'Assistant Priest',
    desc: 'Supports the parish in liturgical celebrations, hospital chaplaincy, and outreach.',
  },
]
</script>
