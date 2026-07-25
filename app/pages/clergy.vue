<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img src="/church-interior.jpg" alt="Clergy" class="w-full h-full object-cover object-center" />
    </div>
    <div class="absolute inset-0 bg-navy/82" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Shepherds of the Flock</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Our Clergy</h1>
      <div class="catholic-divider mt-3"><span class="text-gold-light text-base">✦</span></div>
      <p class="text-gray-300 mt-2 text-sm md:text-base italic">
        "He who hears you, hears me." — Luke 10:16
      </p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <!-- Parish Priest -->
  <section class="py-14 md:py-20 px-4 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Parish Priest</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Pastor of the Parish</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>

      <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 reveal">
        <div class="flex flex-col md:flex-row">
          <!-- Photo -->
          <div class="md:w-72 shrink-0 bg-navy flex flex-col items-center justify-center p-8 gap-4">
            <div class="w-36 h-36 rounded-full bg-gold/20 border-4 border-gold-light/50 flex items-center justify-center overflow-hidden">
              <img v-if="priest.photo" :src="priest.photo" :alt="priest.name" class="w-full h-full object-cover" />
              <span v-else class="text-5xl">✝</span>
            </div>
            <!-- Coat of arms / cross emblem -->
            <div class="text-center">
              <p class="text-gold-light text-xs uppercase tracking-widest font-semibold">Parish Priest</p>
              <p class="text-white/60 text-xs mt-1">St. John of the Cross</p>
              <p class="text-white/60 text-xs">Catholic Church, Mararaba</p>
            </div>
          </div>

          <!-- Details -->
          <div class="p-6 md:p-8 flex flex-col justify-center flex-1">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-gold-light text-sm">✝</span>
              <span class="text-xs text-gold font-bold uppercase tracking-widest">Very Reverend</span>
            </div>
            <h2 class="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-1">{{ priest.name }}</h2>
            <p class="text-gold font-semibold text-sm mb-4">{{ priest.title }}</p>

            <div class="catholic-divider mb-4"><span class="text-gold text-xs">✦</span></div>

            <p class="text-gray-600 leading-relaxed text-sm mb-5">{{ priest.bio }}</p>

            <!-- Sacramental duties -->
            <div>
              <p class="text-xs font-bold text-navy uppercase tracking-widest mb-3">Pastoral Responsibilities</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="d in priest.duties" :key="d" class="flex items-center gap-2 text-xs text-gray-600">
                  <span class="text-gold-light shrink-0">✝</span>
                  {{ d }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Associate Priests / Curates -->
  <section class="py-14 px-4 bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Associate Clergy</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Assistant Priests</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(p, i) in associates" :key="p.name" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="bg-cream rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 group flex gap-5 p-5">
            <div class="w-20 h-20 rounded-full bg-navy flex items-center justify-center shrink-0 border-2 border-gold/30 overflow-hidden">
              <img v-if="p.photo" :src="p.photo" :alt="p.name" class="w-full h-full object-cover" />
              <span v-else class="text-2xl">✝</span>
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

  <!-- Parish Leadership -->
  <section class="py-14 px-4 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Parish Administration</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Parish Leadership</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 text-sm mt-3 max-w-xl mx-auto">
          The parish is guided by ordained clergy and supported by dedicated lay leaders
          who serve the community in various capacities.
        </p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="(l, i) in leadership" :key="l.title" :class="`reveal delay-${(i % 3 + 1) * 100}`">
          <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 group text-center stained-glow">
            <div class="w-14 h-14 rounded-full bg-navy/5 border-2 border-navy/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/10 group-hover:border-gold/30 transition-all text-2xl">
              {{ l.icon }}
            </div>
            <p class="text-gold text-xs font-bold uppercase tracking-widest mb-1">{{ l.title }}</p>
            <h3 class="font-playfair font-bold text-navy text-base mb-2">{{ l.name }}</h3>
            <p class="text-gray-500 text-xs leading-relaxed">{{ l.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact the Priest -->
  <section class="relative py-14 px-4 overflow-hidden">
    <div class="absolute inset-0">
      <img src="/church-4.jpg" alt="Contact" class="w-full h-full object-cover object-center" />
    </div>
    <div class="absolute inset-0 bg-navy/88" />
    <div class="relative z-10 max-w-2xl mx-auto text-center text-white reveal">
      <span class="section-label">Get in Touch</span>
      <h2 class="font-playfair text-3xl font-bold mb-3">Speak with a Priest</h2>
      <div class="catholic-divider mb-4"><span class="text-gold-light text-base">✦</span></div>
      <p class="text-gray-300 text-sm leading-relaxed mb-6">
        For sacramental requests, pastoral counselling, hospital visits, home blessings,
        or any spiritual matter — our priests are always available to serve you.
      </p>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <NuxtLink to="/contact"
          class="px-7 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all text-sm">
          Contact the Parish Office
        </NuxtLink>
        <NuxtLink to="/mass-times"
          class="px-7 py-3 rounded-full glass text-white font-semibold hover:bg-white/20 transition-all text-sm">
          View Mass Times
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const priest = {
  name: 'Rev. Fr. [Parish Priest Name]',
  title: 'Parish Priest · St. John of the Cross Catholic Church, Mararaba',
  photo: '',
  bio: 'Rev. Fr. [Name] serves as the Parish Priest of St. John of the Cross Catholic Church, Mararaba, Nasarawa State. Ordained to the priesthood of Jesus Christ, he shepherds the parish community with zeal, compassion, and a deep devotion to the Holy Eucharist and the Blessed Virgin Mary. He oversees all sacramental, pastoral, and administrative life of the parish.',
  duties: [
    'Celebration of Holy Mass',
    'Administration of the Sacraments',
    'Pastoral Counselling & Visitation',
    'Faith Formation & RCIA',
    'Parish Administration',
    'Hospital & Home Visits',
    'Presiding at Funerals & Weddings',
    'Overseeing Parish Ministries',
  ],
}

const associates = [
  {
    name: 'Rev. Fr. [Associate Priest]',
    role: 'Assistant Priest',
    photo: '',
    desc: 'Assists with the celebration of Mass, sacraments, and pastoral care of the faithful. Coordinates youth ministry and faith formation programmes.',
  },
  {
    name: 'Rev. Fr. [Associate Priest 2]',
    role: 'Assistant Priest',
    photo: '',
    desc: 'Supports the parish in liturgical celebrations, hospital chaplaincy, and outreach to the poor and vulnerable in the community.',
  },
]

const leadership = [
  {
    icon: '📖',
    title: 'Head Catechist',
    name: '[Catechist Name]',
    desc: 'Leads the Catechetical School, RCIA programme, and First Holy Communion preparation for children and adults.',
  },
  {
    icon: '🙏',
    title: 'Permanent Deacon',
    name: 'Dcn. [Deacon Name]',
    desc: 'Ordained minister who assists at Mass, proclaims the Gospel, preaches, and administers Baptism and assists at marriages.',
  },
  {
    icon: '👥',
    title: 'Pastoral Council Chair',
    name: '[Council Chair Name]',
    desc: 'Leads the Parish Pastoral Council, coordinating lay participation in the mission and governance of the parish.',
  },
  {
    icon: '💰',
    title: 'Finance Council Chair',
    name: '[Finance Chair Name]',
    desc: 'Oversees the financial affairs of the parish in accordance with Canon Law and diocesan guidelines.',
  },
  {
    icon: '🎵',
    title: 'Director of Music',
    name: '[Music Director Name]',
    desc: 'Leads the parish choir and music ministry, enriching the liturgy through sacred music and song.',
  },
  {
    icon: '📋',
    title: 'Parish Secretary',
    name: '[Secretary Name]',
    desc: 'Manages parish records, sacramental registers, correspondence, and day-to-day administration of the parish office.',
  },
]
</script>
