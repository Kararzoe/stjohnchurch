<template>
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero" style="background-image: url('/church-interior.jpg')" />
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
      <div v-if="loading" class="text-center py-20 text-gray-400 text-sm">Loading gallery...</div>

      <div v-else-if="photos.length === 0" class="text-center py-20 text-gray-400 reveal">
        <p class="text-5xl mb-4">📷</p>
        <p class="text-lg">No photos uploaded yet.</p>
      </div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div v-for="(img, i) in photos" :key="img.id"
          :class="`reveal delay-${(i % 4 + 1) * 100}`">
          <div class="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
            @click="lightbox = img">
            <img :src="img.image_url" :alt="img.title"
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-navy/0 group-hover:bg-navy/50 transition-all duration-300 flex items-end p-4">
              <p class="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                {{ img.title }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Lightbox -->
  <Transition name="fade">
    <div v-if="lightbox" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      @click="lightbox = null">
      <div class="max-w-4xl w-full relative" @click.stop>
        <img :src="lightbox.image_url" :alt="lightbox.title" class="w-full rounded-2xl max-h-[80vh] object-contain" />
        <p class="text-white text-center mt-4 text-sm">{{ lightbox.title }}</p>
        <button class="absolute top-0 right-0 -mt-10 text-white text-3xl hover:text-gold transition-colors" @click="lightbox = null">&times;</button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const loading = ref(true)
const photos = ref<any[]>([])
const lightbox = ref<any>(null)

onMounted(async () => {
  const { data } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
  photos.value = data ?? []
  loading.value = false
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
