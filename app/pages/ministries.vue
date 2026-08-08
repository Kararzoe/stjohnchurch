<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-8.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Get Involved</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Communities & Groups</h1>
      <p class="text-gray-300 mt-3 text-base md:text-lg max-w-xl mx-auto">There is a place for everyone in our parish family</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <div
        v-for="(m, i) in groups"
        :key="m.name"
        :class="`reveal delay-${(i % 3 + 1) * 100}`"
      >
        <div class="group bg-white rounded-2xl p-5 md:p-8 border border-gray-100 shadow-sm hover:shadow-2xl hover:border-gold/30 hover:-translate-y-2 transition-all duration-300 h-full flex flex-col">
          <div class="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center text-3xl mb-5 group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
            {{ m.icon }}
          </div>
          <h3 class="font-playfair font-bold text-navy text-xl mb-1 group-hover:text-gold transition-colors">{{ m.name }}</h3>
          <p class="text-xs text-gold font-semibold mb-3">{{ m.years }} of service</p>
          <p class="text-gray-500 text-sm leading-relaxed flex-1">{{ m.description }}</p>
          <div class="mt-5 pt-5 border-t border-gray-100">
            <NuxtLink to="/contact" class="text-xs text-gold font-semibold hover:text-navy transition-colors flex items-center gap-1 group/link">
              Get involved <span class="group-hover/link:translate-x-1 transition-transform">→</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const groups = ref([
  { id: 1, icon: '👩', name: 'Christian Women Organization', years: '20+ years', desc: 'A vibrant association of Catholic women dedicated to prayer, charity, and the spiritual growth of families in the parish.' },
  { id: 2, icon: '👨', name: 'Christian Men Organization', years: '20+ years', desc: 'Catholic men committed to faith, fellowship, and service — supporting the parish and leading families in the way of Christ.' },
  { id: 3, icon: '🙌', name: 'Youths', years: '20+ years', desc: 'A dynamic group of young Catholics growing in faith through prayer, retreats, outreach, and community activities.' },
  { id: 4, icon: '✝️', name: 'Altar Boys', years: '20+ years', desc: 'Young men who serve at the altar during Holy Mass, learning reverence, discipline, and a deep love for the Eucharist.' },
  { id: 5, icon: '✝️', name: 'Altar Girls', years: '20+ years', desc: 'Young women who serve at the altar during Holy Mass, growing in faith and devotion through liturgical service.' },
  { id: 6, icon: '🎵', name: 'Choir', years: '20+ years', desc: 'Our dedicated choir leads the congregation in worship through sacred music, hymns, and praise at all parish Masses.' },
  { id: 7, icon: '📖', name: 'Lay Readers', years: '20+ years', desc: 'Trained parishioners who proclaim the Word of God at Mass, bringing the Scriptures to life for the entire congregation.' },
  { id: 8, icon: '🕊️', name: 'Charismatic Renewal', years: '20+ years', desc: 'A Spirit-filled community that gathers for praise, worship, healing prayers, and deepening the gifts of the Holy Spirit.' },
])

onMounted(async () => {
  const { data } = await supabase.from('ministries').select('*').order('sort_order')
  if (data && data.length > 0) groups.value = data
})
</script>
