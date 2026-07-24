<template>
  <!-- Hero -->
  <section class="relative h-[60vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('https://images.unsplash.com/photo-1519817650390-64a93db51149?w=1800&q=80')" />
    <div class="absolute inset-0 bg-navy/75" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Our Parish</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">About Us</h1>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <!-- History -->
  <section class="py-24 px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
      <div class="reveal-left">
        <span class="section-label">Our History</span>
        <h2 class="font-playfair text-4xl font-bold text-navy mb-6">Over a Century of Faith</h2>
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
            src="https://images.unsplash.com/photo-1548625149-720754874e4e?w=800&q=80"
            alt="Church interior"
            class="rounded-2xl shadow-2xl w-full h-80 object-cover"
          />
          <div class="absolute -bottom-6 -left-6 bg-navy rounded-2xl p-6 text-white shadow-xl">
            <p class="font-playfair text-5xl font-black gold-text">1902</p>
            <p class="text-gray-400 text-sm">Year Founded</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Stats -->
  <section class="py-20 px-6 bg-white">
    <div class="max-w-4xl mx-auto grid grid-cols-3 gap-8 text-center">
      <div v-for="s in stats" :key="s.label" class="reveal">
        <p class="font-playfair text-5xl font-black gold-text mb-2">{{ s.value }}</p>
        <p class="text-gray-500 text-sm uppercase tracking-widest">{{ s.label }}</p>
      </div>
    </div>
  </section>

  <!-- Pastor -->
  <section class="py-24 px-6 bg-cream">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-14 reveal">
        <span class="section-label">Leadership</span>
        <h2 class="font-playfair text-4xl font-bold text-navy">Meet Our Pastor</h2>
      </div>
      <div class="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row reveal">
        <div class="md:w-64 shrink-0">
          <img
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
            alt="Pastor"
            class="w-full h-64 md:h-full object-cover"
          />
        </div>
        <div class="p-8 flex flex-col justify-center">
          <span class="section-label">Pastor</span>
          <h3 class="font-playfair text-3xl font-bold text-navy mb-2">Fr. Michael O'Brien</h3>
          <p class="text-gold font-semibold text-sm mb-4">Ordained 2003 · Parish since 2015</p>
          <p class="text-gray-600 leading-relaxed">
            Father Michael is passionate about faith formation, the New Evangelization,
            and building a welcoming parish family for all. He leads our community with
            warmth, wisdom, and a deep love for the Eucharist.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Mission -->
  <section class="relative py-24 px-6 overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('https://images.unsplash.com/photo-1438032005730-c779502df39b?w=1800&q=80')" />
    <div class="absolute inset-0 bg-navy/85" />
    <div class="relative z-10 max-w-3xl mx-auto text-center text-white reveal">
      <span class="section-label">Our Mission</span>
      <h2 class="font-playfair text-4xl font-bold mb-6">What We Believe</h2>
      <p class="text-gray-300 text-xl leading-relaxed italic">
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
  { value: '30+', label: 'Active Ministries' },
  { value: '120+', label: 'Years of Service' },
]
</script>
