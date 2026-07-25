<template>
  <section class="relative h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-6">
      <span class="section-label">Stay Informed</span>
      <h1 class="font-playfair text-6xl md:text-7xl font-black">News & Updates</h1>
      <p class="text-gray-300 mt-4 text-lg">Parish announcements and notices</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-24 px-6 bg-cream">
    <div class="max-w-4xl mx-auto space-y-6">
      <div v-for="(n, i) in news" :key="n.title" :class="`reveal delay-${(i % 3 + 1) * 100}`">
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 overflow-hidden group">
          <div class="flex flex-col sm:flex-row">
            <div class="sm:w-2 shrink-0 bg-gold group-hover:bg-gold-light transition-colors" />
            <div class="p-6 flex-1">
              <div class="flex items-center gap-3 mb-3">
                <span class="text-xs bg-gold/10 text-gold font-bold px-3 py-1 rounded-full uppercase tracking-widest">{{ n.category }}</span>
                <span class="text-xs text-gray-400">{{ n.date }}</span>
              </div>
              <h3 class="font-playfair font-bold text-navy text-xl mb-2 group-hover:text-gold transition-colors">{{ n.title }}</h3>
              <p class="text-gray-500 text-sm leading-relaxed">{{ n.body }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const news = [
  {
    category: 'Announcement',
    date: 'July 20, 2026',
    title: 'Parish Council Elections Coming Soon',
    body: 'The parish will be conducting elections for key leadership positions. Eligible members will receive their voting credentials from the parish office. Watch this space for the official opening date.',
  },
  {
    category: 'Notice',
    date: 'July 18, 2026',
    title: 'New Mass Time — Saturday Vigil',
    body: 'Effective August 1st, the Saturday Vigil Mass will now begin at 5:30 PM instead of 5:00 PM. All other Mass times remain unchanged.',
  },
  {
    category: 'Event',
    date: 'July 15, 2026',
    title: 'Harvest Thanksgiving — Divine Intervention',
    body: 'Our annual Harvest Thanksgiving celebration is coming up. Theme: "Divine Intervention — My Grace is Sufficient." All groups and ministries are encouraged to participate fully.',
  },
  {
    category: 'Notice',
    date: 'July 10, 2026',
    title: 'Faith Formation Registration Open',
    body: 'Registration for the new faith formation year is now open for children, youth, and adults. Visit the parish office or speak to the Head Catechist after any Sunday Mass.',
  },
  {
    category: 'Announcement',
    date: 'July 5, 2026',
    title: 'Welcome to Our New Parish Website',
    body: 'We are pleased to launch the new St. John of the Cross Catholic Church website. You can now find Mass times, events, news, and more online. God bless you all.',
  },
]
</script>
