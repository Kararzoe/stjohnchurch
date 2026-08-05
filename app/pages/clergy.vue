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
      <p class="text-gray-300 mt-2 text-sm md:text-base italic">"He who hears you, hears me." — Luke 10:16</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <!-- Parish Priest -->
  <section v-if="pastor" class="py-14 md:py-24 px-4 bg-cream">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Leadership</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Meet Our Pastor</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="bg-white rounded-3xl overflow-hidden shadow-xl flex flex-col md:flex-row reveal">
        <div class="md:w-72 shrink-0">
          <img :src="pastor.photo || '/priest-1.jpg'" :alt="pastor.name" class="w-full h-72 md:h-full object-cover object-top" />
        </div>
        <div class="p-6 md:p-10 flex flex-col justify-center">
          <div class="w-10 h-10 rounded-full bg-navy flex items-center justify-center mb-4">
            <span class="text-gold text-lg">✝</span>
          </div>
          <h3 class="font-playfair text-2xl sm:text-3xl font-bold text-navy mb-1">{{ pastor.name }}</h3>
          <p class="text-gold font-semibold text-sm mb-1">{{ pastor.role }}</p>
          <p class="text-gray-400 text-xs mb-5">St. John of the Cross, Mararaba Gurku, Nasarawa State</p>
          <div class="w-10 h-0.5 bg-gold/40 mb-5" />
          <p class="text-gray-600 leading-relaxed text-sm">{{ pastor.bio }}</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Associate Priests -->
  <section v-if="associates.length > 0" class="py-14 px-4 bg-white">
    <div class="max-w-5xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Associate Clergy</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Associate Priests</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div v-for="(p, i) in associates" :key="p.id" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="bg-cream rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 group flex gap-5 p-5">
            <div class="w-20 h-20 rounded-full bg-navy flex items-center justify-center shrink-0 border-2 border-gold/30 overflow-hidden">
              <img v-if="p.photo" :src="p.photo" :alt="p.name" class="w-full h-full object-cover object-top" />
              <span v-else class="text-2xl">✝</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs text-gold font-bold uppercase tracking-widest mb-0.5">{{ p.role }}</p>
              <h3 class="font-playfair font-bold text-navy text-lg group-hover:text-gold transition-colors">{{ p.name }}</h3>
              <p v-if="p.bio" class="text-gray-500 text-xs mt-1 leading-relaxed">{{ p.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Loading state -->
  <section v-if="loading" class="py-24 text-center text-gray-400">Loading clergy...</section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const loading = ref(true)
const pastor = ref<any>(null)
const associates = ref<any[]>([])

onMounted(async () => {
  const { data } = await supabase.from('clergy').select('*').order('sort_order')
  if (data && data.length > 0) {
    pastor.value = data[0]
    associates.value = data.slice(1)
  } else {
    pastor.value = {
      name: 'Rev. Frederick Wukari, OSA Esq.',
      role: 'Parish Priest',
      photo: '/priest-1.jpg',
      bio: 'Rev. Frederick Wukari, OSA Esq. serves as the Parish Priest of St. John of the Cross Catholic Church, Mararaba Gurku, Nasarawa State. A member of the Order of Saint Augustine (OSA), he shepherds the parish community with zeal, compassion, and a deep devotion to the Holy Eucharist.',
    }
    associates.value = [
      { id: 1, name: 'Rev. Fr. Jiwok Joseph Nentawe, OSA', role: 'Bursar / School Administrator', photo: '/priest-jiwok.jpg' },
      { id: 2, name: 'Catechist Michael Iorhemba', role: 'Parish Catechist', photo: '/catechist-michael.jpg' },
      { id: 3, name: 'Rev. Fr. Jude Aniobodom Ossai, OSA', role: 'Papal Nunciature', photo: '/priest-jude.jpg' },
      { id: 4, name: 'Very Rev. Fr. Oliver Onuoha, OSA', role: 'Ave Maria', photo: '/priest-oliver.jpg' },
    ]
  }
  loading.value = false
})
</script>
