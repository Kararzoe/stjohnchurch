<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-5.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Parish Life</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Events</h1>
      <p class="text-gray-300 mt-3 text-base md:text-lg">Stay connected with our community</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div v-if="events.length === 0" class="text-center py-20 text-gray-400 text-sm col-span-3">No events yet.</div>
      <div
        v-for="(e, i) in events"
        :key="e.id"
        :class="`reveal delay-${(i % 3 + 1) * 100}`"
      >
        <div class="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:border-gold/30 hover:-translate-y-2 transition-all duration-400 h-full flex flex-col">
          <div class="relative h-52 overflow-hidden">
            <img :src="e.image_url || '/church-3.jpg'" :alt="e.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
            <div class="absolute top-4 left-4 bg-navy/90 backdrop-blur-sm text-white rounded-2xl px-3 py-2 text-center min-w-[56px]">
              <p class="text-gold-light text-xs font-black tracking-widest">{{ eventDate(e.event_date).month }}</p>
              <p class="font-playfair text-3xl font-black leading-none">{{ eventDate(e.event_date).day }}</p>
            </div>
          </div>
          <div class="p-6 flex-1 flex flex-col">
            <h3 class="font-playfair font-bold text-navy text-xl mb-1 group-hover:text-gold transition-colors">{{ e.title }}</h3>
            <p class="text-xs text-gold font-semibold mb-1">{{ e.event_time }}</p>
            <p class="text-xs text-gray-400 mb-3 flex items-center gap-1">📍 {{ e.location ?? 'Parish Grounds' }}</p>
            <p class="text-gray-500 text-sm leading-relaxed flex-1">{{ e.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const events = ref<any[]>([])

onMounted(async () => {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('event_date', { ascending: true })
  events.value = data ?? []
})

function eventDate(d: string) {
  if (!d) return { month: '—', day: '—' }
  const dt = new Date(d)
  return {
    month: dt.toLocaleString('en', { month: 'short' }).toUpperCase(),
    day: String(dt.getDate()).padStart(2, '0'),
  }
}
</script>
