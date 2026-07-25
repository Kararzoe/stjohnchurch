<template>
  <!-- ── HERO ── -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Real church photo -->
    <div
      class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')"
    />
    <!-- Beautiful multi-layer blend -->
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(26,39,68,0.75) 0%, rgba(26,39,68,0.45) 40%, rgba(26,39,68,0.85) 100%)" />
    <!-- Gold warm glow from the stained glass window area -->
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.18) 0%, transparent 65%)" />

    <!-- Animated dot grid -->
    <div class="absolute inset-0 opacity-10"
      style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 50px 50px;" />

    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
      <!-- Floating cross -->
      <div class="animate-float inline-block mb-6">
        <div class="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold-light/50 flex items-center justify-center mx-auto">
          <span class="text-gold-light text-3xl">✝</span>
        </div>
      </div>

      <p class="section-label text-center animate-fade-in">Welcome to</p>
      <h1 class="font-playfair text-5xl md:text-7xl font-black text-white leading-none mb-4 animate-fade-in">
        St. John of the Cross
        <span class="block gold-text">Catholic Church</span>
      </h1>
      <p class="text-gold-light/80 text-sm uppercase tracking-widest mb-3 animate-fade-in">Mararaba, Nasarawa State</p>
      <p class="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
        A community of faith, hope, and love — gathering at the table of the Lord
        and serving our neighbors with joy.
      </p>
      <div class="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
        <NuxtLink to="/mass-times"
          class="px-8 py-4 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-1">
          View Mass Times
        </NuxtLink>
        <NuxtLink to="/about"
          class="px-8 py-4 rounded-full glass text-white font-semibold hover:bg-white/20 transition-all hover:-translate-y-1">
          Our Parish Story
        </NuxtLink>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 animate-bounce">
      <span class="text-xs tracking-widest uppercase">Scroll</span>
      <span class="text-lg">↓</span>
    </div>

    <!-- Wave -->
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80L1440 80L1440 30C1200 80 960 10 720 30C480 50 240 0 0 30L0 80Z" fill="#faf8f3"/>
      </svg>
    </div>
  </section>

  <!-- ── MASS TIMES ── -->
  <section class="py-24 px-6 bg-cream">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14 reveal">
        <span class="section-label">Join Us</span>
        <h2 class="font-playfair text-5xl font-bold text-navy">Mass Schedule</h2>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(m, i) in massTimes"
          :key="m.day"
          :class="`reveal delay-${(i + 1) * 100}`"
        >
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-xl hover:border-gold/30 hover:-translate-y-2 transition-all duration-300 group h-full">
            <div class="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4 group-hover:bg-gold transition-colors">
              <span class="text-gold group-hover:text-white text-xl transition-colors">🕐</span>
            </div>
            <h3 class="font-playfair font-bold text-navy text-xl mb-3">{{ m.day }}</h3>
            <ul class="space-y-1">
              <li v-for="t in m.times" :key="t" class="text-gray-500 text-sm flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-gold-light shrink-0" />
                {{ t }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="text-center mt-10 reveal">
        <NuxtLink to="/mass-times" class="inline-flex items-center gap-2 text-gold hover:text-navy font-medium transition-colors group">
          Full schedule & confession times
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── ABOUT BANNER ── -->
  <section class="relative py-32 px-6 overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-4.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 max-w-4xl mx-auto text-center text-white">
      <span class="section-label reveal">Our Parish</span>
      <h2 class="font-playfair text-5xl md:text-6xl font-black mb-6 reveal">
        Rooted in Faith,<br>
        <span class="gold-text">Called to Serve</span>
      </h2>
      <p class="text-gray-300 text-lg leading-relaxed max-w-2xl mx-auto mb-10 reveal">
        For over a century, St. John Catholic Church has been a spiritual home for families
        in our community. We celebrate the sacraments, grow in discipleship, and reach out
        to those in need.
      </p>
      <!-- Stats -->
      <div class="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-10 reveal">
        <div v-for="s in stats" :key="s.label" class="glass rounded-2xl p-4">
          <p class="font-playfair text-4xl font-black gold-text">{{ s.value }}</p>
          <p class="text-gray-400 text-xs mt-1">{{ s.label }}</p>
        </div>
      </div>
      <NuxtLink to="/about"
        class="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-1 reveal">
        Our Story →
      </NuxtLink>
    </div>
  </section>

  <!-- ── EVENTS ── -->
  <section class="py-24 px-6 bg-white">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14 reveal">
        <span class="section-label">Stay Connected</span>
        <h2 class="font-playfair text-5xl font-bold text-navy">Upcoming Events</h2>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(e, i) in events"
          :key="e.title"
          :class="`reveal delay-${(i + 1) * 100}`"
        >
          <div class="group rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col">
            <div class="relative h-44 overflow-hidden">
              <img :src="e.image" :alt="e.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
              <div class="absolute top-3 left-3 bg-navy text-white rounded-xl px-3 py-1.5 text-center min-w-[52px]">
                <p class="text-gold-light text-xs font-bold tracking-widest">{{ e.date.month }}</p>
                <p class="font-playfair text-2xl font-black leading-none">{{ e.date.day }}</p>
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="font-playfair font-bold text-navy text-xl mb-2 group-hover:text-gold transition-colors">{{ e.title }}</h3>
              <p class="text-xs text-gold font-semibold mb-2">{{ e.time }}</p>
              <p class="text-gray-500 text-sm leading-relaxed flex-1">{{ e.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-10 reveal">
        <NuxtLink to="/events" class="inline-flex items-center gap-2 text-gold hover:text-navy font-medium transition-colors group">
          All events <span class="group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── MINISTRIES ── -->
  <section class="py-24 px-6 bg-cream">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-14 reveal">
        <span class="section-label">Get Involved</span>
        <h2 class="font-playfair text-5xl font-bold text-navy">Ministries</h2>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
        <NuxtLink
          v-for="(m, i) in ministries"
          :key="m.label"
          to="/ministries"
          :class="`reveal delay-${(i + 1) * 100}`"
        >
          <div class="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl border border-gray-100 hover:border-gold/40 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group text-center h-full">
            <div class="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
              {{ m.icon }}
            </div>
            <span class="text-sm font-semibold text-navy group-hover:text-gold transition-colors">{{ m.label }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── GALLERY STRIP ── -->
  <section class="py-4 overflow-hidden bg-navy">
    <div class="flex gap-4 animate-[scroll_30s_linear_infinite] w-max">
      <img
        v-for="(img, i) in [...galleryImages, ...galleryImages]"
        :key="i"
        :src="img"
        class="h-48 w-72 object-cover rounded-xl shrink-0 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  </section>

  <!-- ── DONATE CTA ── -->
  <section class="py-24 px-6 bg-white">
    <div class="max-w-3xl mx-auto text-center reveal">
      <span class="section-label">Support Us</span>
      <h2 class="font-playfair text-5xl font-bold text-navy mb-4">Support Our Parish</h2>
      <p class="text-gray-500 text-lg mb-10 leading-relaxed">
        Your generosity helps us maintain our church, support our ministries,
        and serve those in need in our community.
      </p>
      <NuxtLink to="/donate"
        class="inline-block px-12 py-4 rounded-full bg-gold text-white font-semibold text-lg hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 hover:-translate-y-1">
        Make a Gift ✝
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const massTimes = [
  { day: 'Saturday', times: ['5:00 PM (Vigil)'] },
  { day: 'Sunday', times: ['7:30 AM', '9:00 AM', '11:00 AM', '5:00 PM'] },
  { day: 'Weekdays', times: ['7:00 AM', '12:10 PM'] },
  { day: 'Holy Days', times: ['7:00 AM', '12:10 PM', '7:00 PM'] },
]

const stats = [
  { value: '1902', label: 'Year Founded' },
  { value: '2,400+', label: 'Families' },
  { value: '30+', label: 'Ministries' },
]

const events = [
  {
    date: { month: 'JUL', day: '20' },
    title: 'Parish Picnic',
    time: 'After 11:00 AM Mass',
    desc: 'Bring the whole family for food, games, and fellowship after the 11 AM Mass.',
    image: '/church-3.jpg',
  },
  {
    date: { month: 'JUL', day: '27' },
    title: 'Youth Group Retreat',
    time: 'Friday 6 PM – Sunday 2 PM',
    desc: 'A weekend of prayer, community, and fun for high school students.',
    image: '/church-5.jpg',
  },
  {
    date: { month: 'AUG', day: '3' },
    title: 'Back-to-School Blessing',
    time: 'All Sunday Masses',
    desc: 'Students and teachers will receive a special blessing at all Masses.',
    image: '/church-6.jpg',
  },
]

const ministries = [
  { icon: '❤️', label: 'Outreach & Charity' },
  { icon: '📖', label: 'Faith Formation' },
  { icon: '🎵', label: 'Music Ministry' },
  { icon: '🙏', label: 'Prayer Groups' },
  { icon: '👨‍👩‍👧', label: 'Family & Youth' },
  { icon: '✝️', label: 'Liturgical Ministry' },
  { icon: '🤝', label: 'Men\'s & Women\'s' },
  { icon: '🕊️', label: 'Bereavement' },
]

const galleryImages = [
  '/church-interior.jpg',
  '/church-1.jpg',
  '/church-2.jpg',
  '/church-3.jpg',
  '/church-4.jpg',
  '/church-5.jpg',
  '/church-6.jpg',
  '/church-7.jpg',
]
</script>

<style>
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
