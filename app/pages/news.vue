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
    <div class="max-w-6xl mx-auto">
      <div v-if="news.length === 0" class="text-center py-20 text-gray-400 text-sm">No news posts yet.</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="(n, i) in news" :key="n.id" :class="`reveal delay-${(i % 3 + 1) * 100}`">
          <div class="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-gold/30 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col h-full">

            <!-- Image -->
            <div class="relative h-48 overflow-hidden bg-navy/5">
              <img v-if="n.image_url" :src="n.image_url" :alt="n.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-5xl opacity-20">📰</span>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              <span class="absolute top-3 left-3 text-xs bg-gold text-white font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                {{ n.category ?? 'News' }}
              </span>
            </div>

            <!-- Content -->
            <div class="p-5 flex flex-col flex-1">
              <p class="text-xs text-gray-400 mb-2">{{ formatDate(n.created_at) }}</p>
              <h3 class="font-playfair font-bold text-navy text-lg leading-snug mb-2 group-hover:text-gold transition-colors">
                {{ n.title }}
              </h3>
              <p class="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-3">{{ n.excerpt || n.content }}</p>
              <div class="mt-4 pt-4 border-t border-gray-100 flex items-center gap-1 text-gold text-xs font-bold group-hover:gap-2 transition-all">
                <span>Read more</span>
                <span>→</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()

const { data: newsData } = await useAsyncData('news', async () => {
  const { data } = await supabase
    .from('news')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false })
  return data ?? []
})

const news = computed(() => newsData.value ?? [])

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
