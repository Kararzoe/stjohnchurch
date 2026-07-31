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
  <section class="py-14 md:py-24 px-4 bg-cream">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-12 reveal">
        <span class="section-label">Meet Our Pastor</span>
        <h2 class="font-playfair text-3xl sm:text-5xl font-bold text-navy">Parish Priest</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>

      <div class="reveal">
        <!-- Main layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">

          <!-- Left: Photo gallery -->
          <div class="relative bg-navy">
            <!-- Main photo -->
            <div class="relative h-[500px] lg:h-full min-h-[500px] overflow-hidden">
              <img
                :src="priestPhotos[activePhoto]"
                alt="Rev. Frederick Wukari"
                class="w-full h-full object-cover object-top transition-all duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />

              <!-- Name overlay -->
              <div class="absolute bottom-0 left-0 right-0 p-6">
                <p class="text-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-1">Order of Saint Augustine</p>
                <h3 class="font-playfair text-3xl md:text-4xl font-black text-white leading-tight">Rev. Frederick Wukari, OSA Esq.</h3>
                <p class="text-gold/80 text-sm font-semibold mt-1">Parish Priest</p>
                <p class="text-white/50 text-xs mt-2">St. John of the Cross, Mararaba Gurku, Nasarawa State</p>
              </div>

              <!-- Thumbnail strip -->
              <div class="absolute top-4 left-4 flex flex-col gap-2">
                <button
                  v-for="(photo, i) in priestPhotos"
                  :key="i"
                  @click="activePhoto = i"
                  :class="[
                    'w-14 h-14 rounded-xl overflow-hidden border-2 transition-all duration-300',
                    activePhoto === i ? 'border-gold shadow-lg shadow-gold/40 scale-110' : 'border-white/20 opacity-50 hover:opacity-100 hover:border-white/60'
                  ]"
                >
                  <img :src="photo" alt="" class="w-full h-full object-cover object-top" />
                </button>
              </div>
            </div>
          </div>

          <!-- Right: Info -->
          <div class="bg-white p-8 md:p-12 flex flex-col justify-center">
            <!-- Cross badge -->
            <div class="w-14 h-14 rounded-full bg-navy flex items-center justify-center mb-6">
              <span class="text-gold text-2xl">✝</span>
            </div>

            <p class="text-gold text-xs uppercase tracking-[0.3em] font-bold mb-2">Meet Our Pastor</p>
            <h3 class="font-playfair text-2xl md:text-3xl font-black text-navy leading-tight mb-1">
              Rev. Frederick Wukari, OSA Esq.
            </h3>
            <p class="text-gold font-semibold text-sm mb-1">Parish Priest</p>
            <p class="text-gray-400 text-xs mb-6">St. John of the Cross, Mararaba Gurku, Nasarawa State</p>

            <div class="w-12 h-0.5 bg-gold/40 mb-6" />

            <p class="text-gray-600 leading-relaxed text-sm mb-8">
              Rev. Frederick Wukari, OSA Esq. serves as the Parish Priest of St. John of the Cross
              Catholic Church, Mararaba Gurku, Nasarawa State. A proud member of the
              <strong class="text-navy">Order of Saint Augustine (OSA)</strong>, he shepherds the
              parish community with zeal, compassion, and a deep devotion to the Holy Eucharist
              and the Blessed Virgin Mary. He oversees all sacramental, pastoral, and
              administrative life of the parish.
            </p>

            <!-- Responsibilities -->
            <div>
              <p class="text-xs font-black text-navy uppercase tracking-widest mb-4">Pastoral Responsibilities</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div v-for="d in priest.duties" :key="d" class="flex items-center gap-2 text-xs text-gray-600">
                  <span class="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  {{ d }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom: 3 photos strip -->
        <div class="grid grid-cols-3 gap-3 mt-4">
          <div
            v-for="(photo, i) in priestPhotos"
            :key="i"
            @click="activePhoto = i"
            :class="[
              'relative h-40 md:h-56 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300',
              activePhoto === i ? 'ring-2 ring-gold shadow-xl' : 'opacity-70 hover:opacity-100'
            ]"
          >
            <img :src="photo" alt="Rev. Frederick Wukari" class="w-full h-full object-cover object-top" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
            <div v-if="activePhoto === i" class="absolute inset-0 flex items-center justify-center">
              <div class="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <span class="text-white text-xs font-black">✓</span>
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

const priestPhotos = ['/priest-1.jpg', '/priest-2.jpg', '/priest-3.jpg']
const activePhoto = ref(0)

const priest = {
  name: 'Rev. Frederick Wukari, OSA Esq.',
  title: 'Parish Priest · St. John of the Cross Catholic Church, Mararaba Gurku, Nasarawa State',
  photo: '/priest-1.jpg',
  bio: 'Rev. Frederick Wukari, OSA Esq. serves as the Parish Priest of St. John of the Cross Catholic Church, Mararaba Gurku, Nasarawa State. A member of the Order of Saint Augustine (OSA), he shepherds the parish community with zeal, compassion, and a deep devotion to the Holy Eucharist and the Blessed Virgin Mary.',
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
