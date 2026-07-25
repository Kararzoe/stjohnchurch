<template>
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-interior.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Our Moments</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Photo Gallery</h1>
      <p class="text-gray-300 mt-3 text-base md:text-lg">Memories from our parish life</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-6xl mx-auto">
      <!-- Category filter -->
      <div class="flex flex-wrap gap-2 justify-center mb-8 md:mb-12 reveal">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="[
            'px-5 py-2 rounded-full text-sm font-semibold transition-all',
            active === cat ? 'bg-gold text-white shadow-lg shadow-gold/30' : 'bg-white border border-gray-200 text-gray-600 hover:border-gold hover:text-gold'
          ]"
          @click="active = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Gallery grid -->
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="(img, i) in filtered"
          :key="i"
          :class="`reveal delay-${(i % 4 + 1) * 100} ${img.wide ? 'col-span-2' : ''}`"
        >
          <div class="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
            @click="lightbox = img">
            <img :src="img.src" :alt="img.caption"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-300 flex items-end p-4">
              <p class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                {{ img.caption }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="filtered.length === 0" class="text-center py-20 text-gray-400 reveal">
        <p class="text-5xl mb-4">📷</p>
        <p class="text-lg">No photos in this category yet.</p>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <Transition name="fade">
    <div v-if="lightbox" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click="lightbox = null">
      <div class="max-w-4xl w-full" @click.stop>
        <img :src="lightbox.src" :alt="lightbox.caption" class="w-full rounded-2xl max-h-[80vh] object-contain" />
        <p class="text-white text-center mt-4 text-sm">{{ lightbox.caption }}</p>
        <button class="absolute top-6 right-6 text-white text-3xl hover:text-gold transition-colors" @click="lightbox = null">✕</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
useScrollReveal()

const active = ref('All')
const lightbox = ref<any>(null)

const categories = ['All', 'Masses', 'Events', 'Youth', 'Community']

const photos = [
  { src: '/church-interior.jpg', caption: 'Church Interior', category: 'Masses', wide: true },
  { src: '/church-1.jpg', caption: 'Parish Gathering', category: 'Community', wide: false },
  { src: '/church-2.jpg', caption: 'Sunday Mass', category: 'Masses', wide: false },
  { src: '/church-3.jpg', caption: 'Parish Event', category: 'Events', wide: false },
  { src: '/church-4.jpg', caption: 'Church Community', category: 'Community', wide: false },
  { src: '/church-5.jpg', caption: 'Youth Ministry', category: 'Youth', wide: false },
  { src: '/church-6.jpg', caption: 'Celebration Mass', category: 'Masses', wide: false },
  { src: '/church-7.jpg', caption: 'Parish Life', category: 'Community', wide: false },
  { src: '/church-8.jpg', caption: 'Youth Retreat', category: 'Youth', wide: false },
  { src: '/church-9.jpg', caption: 'Parish Event', category: 'Events', wide: false },
  { src: '/church-10.jpg', caption: 'Community Gathering', category: 'Community', wide: false },
  { src: '/church-11.jpg', caption: 'Holy Mass', category: 'Masses', wide: false },
  { src: '/church-12.jpg', caption: 'Parish Activities', category: 'Events', wide: false },
  { src: '/church-13.jpg', caption: 'Youth Group', category: 'Youth', wide: false },
  { src: '/church-14.jpg', caption: 'Church Celebration', category: 'Events', wide: false },
  { src: '/church-15.jpg', caption: 'Parish Community', category: 'Community', wide: false },
  { src: '/church-16.jpg', caption: 'Sunday Worship', category: 'Masses', wide: false },
  { src: '/church-17.jpg', caption: 'Parish Family', category: 'Community', wide: false },
]

const filtered = computed(() =>
  active.value === 'All' ? photos : photos.filter(p => p.category === active.value)
)
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
