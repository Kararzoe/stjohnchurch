<template>
  <section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Our Leaders</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">Clergy</h1>
      <p class="text-gray-300 mt-4 text-lg">Meet the shepherds of our parish</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-24 px-6 bg-cream">
    <div class="max-w-5xl mx-auto">
      <!-- Parish Priest -->
      <div class="reveal mb-16">
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col md:flex-row">
          <div class="md:w-72 shrink-0 bg-navy flex items-center justify-center p-10">
            <div class="w-40 h-40 rounded-full bg-gold/20 border-4 border-gold-light/50 flex items-center justify-center">
              <span class="text-6xl">✝</span>
            </div>
          </div>
          <div class="p-8 flex flex-col justify-center">
            <span class="section-label">Parish Priest</span>
            <h2 class="font-playfair text-3xl font-bold text-navy mb-1">Rev. Fr. [Parish Priest Name]</h2>
            <p class="text-gold font-semibold text-sm mb-4">Parish Priest · St. John of the Cross Catholic Church</p>
            <p class="text-gray-600 leading-relaxed">
              Our Parish Priest leads the community of St. John of the Cross Catholic Church, Mararaba
              with dedication, faith, and a deep love for the Eucharist and the people of God.
              He oversees all pastoral activities and sacramental life of the parish.
            </p>
          </div>
        </div>
      </div>

      <!-- Other Clergy -->
      <div class="text-center mb-10 reveal">
        <span class="section-label">Parish Team</span>
        <h2 class="font-playfair text-3xl font-bold text-navy">Other Church Leaders</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(c, i) in clergy" :key="c.title" :class="`reveal delay-${(i % 3 + 1) * 100}`">
          <div class="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-2 transition-all duration-300 text-center group">
            <div class="w-20 h-20 rounded-full bg-navy/10 border-2 border-navy/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
              <span class="text-3xl">{{ c.icon }}</span>
            </div>
            <h3 class="font-playfair font-bold text-navy text-lg mb-1">{{ c.name }}</h3>
            <p class="text-gold text-xs font-semibold uppercase tracking-widest mb-3">{{ c.title }}</p>
            <p class="text-gray-500 text-sm leading-relaxed">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const clergy = [
  { icon: '🙏', name: '[Deacon Name]', title: 'Permanent Deacon', desc: 'Assists with liturgical celebrations, baptisms, and parish outreach.' },
  { icon: '📖', name: '[Catechist Name]', title: 'Head Catechist', desc: 'Leads faith formation programs for children, youth, and adult converts.' },
  { icon: '👥', name: '[Pastoral Council Chair]', title: 'Pastoral Council Chair', desc: 'Coordinates the parish pastoral council and community initiatives.' },
]
</script>
