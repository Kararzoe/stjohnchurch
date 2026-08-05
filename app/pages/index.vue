<template>
  <!-- ── HERO ── -->
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img
        src="/church-interior.jpg"
        alt="St. John of the Cross Catholic Church"
        class="w-full h-full object-cover object-center"
      />
    </div>
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(26,39,68,0.80) 0%, rgba(26,39,68,0.50) 40%, rgba(26,39,68,0.90) 100%)" />
    <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.22) 0%, transparent 60%)" />
    <div class="absolute inset-0 opacity-10"
      style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 40px 40px;" />

    <div class="relative z-10 text-center px-4 max-w-4xl mx-auto pt-20">
      <div class="animate-float inline-block mb-5">
        <div class="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gold/20 border-2 border-gold-light/60 flex items-center justify-center mx-auto shadow-lg shadow-gold/20">
          <span class="text-gold-light text-2xl md:text-4xl">✝</span>
        </div>
      </div>

      <p class="section-label text-center animate-fade-in">Welcome to</p>
      <h1 class="font-playfair text-4xl sm:text-5xl md:text-7xl font-black text-white leading-tight mb-3 animate-fade-in">
        St. John of the Cross
        <span class="block gold-text">Catholic Church</span>
      </h1>
      <p class="text-gold-light/90 text-xs sm:text-sm uppercase tracking-[0.25em] mb-5 animate-fade-in">
        Mararaba · Nasarawa State · Nigeria
      </p>

      <div class="catholic-divider animate-fade-in">
        <span class="text-gold-light text-lg">✦</span>
      </div>

      <p class="text-gray-200 text-base md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in italic">
        "Come to me, all you who are weary and burdened, and I will give you rest."
        <span class="block text-gold-light/70 text-xs mt-1 not-italic">— Matthew 11:28</span>
      </p>

      <div class="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in">
        <NuxtLink to="/mass-times"
          class="px-7 py-3.5 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 text-sm md:text-base">
          ✝ View Mass Times
        </NuxtLink>
        <NuxtLink to="/about"
          class="px-7 py-3.5 rounded-full glass text-white font-semibold hover:bg-white/20 transition-all text-sm md:text-base">
          Our Parish Story
        </NuxtLink>
      </div>
    </div>

    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 80L1440 80L1440 30C1200 80 960 10 720 30C480 50 240 0 0 30L0 80Z" fill="#faf8f3"/>
      </svg>
    </div>
  </section>

  <!-- ── DAILY VERSE ── -->
  <section class="py-10 px-4 bg-cream rosary-border">
    <div class="max-w-3xl mx-auto text-center reveal">
      <p class="text-gold text-xs uppercase tracking-widest font-semibold mb-2">Daily Scripture</p>
      <p class="font-playfair text-lg md:text-2xl text-navy italic leading-relaxed">
        "I can do all things through Christ who strengthens me."
      </p>
      <p class="text-gray-400 text-xs mt-2">— Philippians 4:13</p>
    </div>
  </section>

  <!-- ── MASS TIMES ── -->
  <section class="py-16 md:py-24 px-4 bg-cream">
    <div class="max-w-2xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Join Us</span>
        <h2 class="font-playfair text-3xl sm:text-5xl font-bold text-navy">Mass Schedule</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>

      <div class="space-y-3 reveal">
        <div
          v-for="(m, i) in massTimes"
          :key="m.day"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:border-gold/30"
        >
          <button
            @click="openMass = openMass === i ? null : i"
            class="w-full flex items-center justify-between px-5 py-4 group"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-300', openMass === i ? 'bg-gold' : 'bg-gold/10 group-hover:bg-gold/20']">
                <span class="text-base">🕐</span>
              </div>
              <span class="font-playfair font-bold text-navy text-base">{{ m.day }}</span>
            </div>
            <svg
              :class="['w-4 h-4 text-gold transition-transform duration-300', openMass === i ? 'rotate-180' : '']"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div :class="['mass-accordion', openMass === i ? 'mass-accordion--open' : '']">
            <ul class="px-5 pb-4 space-y-2">
              <li v-for="t in m.times" :key="t" class="flex items-center gap-2 text-gray-600 text-sm">
                <span class="text-gold text-xs">✝</span>
                {{ t }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="text-center mt-8 reveal">
        <NuxtLink to="/mass-times" class="inline-flex items-center gap-2 text-gold hover:text-navy font-medium transition-colors group text-sm">
          Full schedule & confession times
          <span class="group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── ABOUT BANNER ── -->
  <section class="relative py-20 md:py-32 px-4 overflow-hidden">
    <div class="absolute inset-0">
      <img src="/church-4.jpg" alt="Parish" class="w-full h-full object-cover object-center" />
    </div>
    <div class="absolute inset-0 bg-navy/85" />
    <div class="absolute inset-0 opacity-5"
      style="background-image: repeating-linear-gradient(0deg, #d4af37 0px, #d4af37 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #d4af37 0px, #d4af37 1px, transparent 1px, transparent 60px);" />

    <div class="relative z-10 max-w-4xl mx-auto text-center text-white">
      <span class="section-label reveal">Our Parish</span>
      <h2 class="font-playfair text-3xl sm:text-5xl md:text-6xl font-black mb-4 reveal">
        Rooted in Faith,<br>
        <span class="gold-text">Called to Serve</span>
      </h2>
      <div class="catholic-divider reveal"><span class="text-gold-light text-base">✦</span></div>
      <p class="text-gray-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto mb-8 reveal">
        St. John of the Cross Catholic Church, Mararaba has been a spiritual home for families
        in Nasarawa State. We celebrate the sacraments, grow in discipleship, and reach out
        to those in need.
      </p>
      <div class="grid grid-cols-2 gap-3 max-w-xs mx-auto mb-8 reveal">
        <div v-for="s in stats" :key="s.label" class="glass rounded-2xl p-3 md:p-4">
          <p class="font-playfair text-2xl md:text-4xl font-black gold-text">{{ s.value }}</p>
          <p class="text-gray-400 text-xs mt-1">{{ s.label }}</p>
        </div>
      </div>
      <NuxtLink to="/about"
        class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 reveal text-sm md:text-base">
        Our Story →
      </NuxtLink>
    </div>
  </section>

  <!-- ── SACRAMENTS ── -->
  <section class="py-16 md:py-24 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">The Seven Sacraments</span>
        <h2 class="font-playfair text-3xl sm:text-4xl font-bold text-navy">Life in the Church</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        <div v-for="(s, i) in sacraments" :key="s.name" :class="`reveal delay-${(i % 4 + 1) * 100}`">
          <div class="flex flex-col items-center gap-2 p-4 bg-cream rounded-2xl border border-gray-100 hover:border-gold/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group text-center stained-glow">
            <div class="w-12 h-12 rounded-full bg-navy/5 flex items-center justify-center text-2xl group-hover:bg-gold/10 transition-colors">
              {{ s.icon }}
            </div>
            <span class="text-xs font-semibold text-navy group-hover:text-gold transition-colors leading-tight">{{ s.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ── EVENTS ── -->
  <section class="py-16 md:py-24 px-4 bg-cream">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Stay Connected</span>
        <h2 class="font-playfair text-3xl sm:text-5xl font-bold text-navy">Upcoming Events</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div v-for="(e, i) in events" :key="e.id" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="group rounded-2xl overflow-hidden border border-gray-100 stained-glow hover:border-gold/30 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col bg-white">
            <div class="relative h-44 overflow-hidden">
              <img :src="e.image_url || '/church-3.jpg'" :alt="e.title" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div class="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent" />
              <div class="absolute top-3 left-3 bg-navy/90 text-white rounded-xl px-3 py-1.5 text-center min-w-[52px]">
                <p class="text-gold-light text-xs font-bold tracking-widest">{{ eventDate(e.event_date).month }}</p>
                <p class="font-playfair text-2xl font-black leading-none">{{ eventDate(e.event_date).day }}</p>
              </div>
            </div>
            <div class="p-5 flex-1 flex flex-col">
              <h3 class="font-playfair font-bold text-navy text-lg mb-1 group-hover:text-gold transition-colors">{{ e.title }}</h3>
              <p class="text-xs text-gold font-semibold mb-2">{{ e.event_time }}</p>
              <p class="text-gray-500 text-sm leading-relaxed flex-1">{{ e.description }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center mt-8 reveal">
        <NuxtLink to="/events" class="inline-flex items-center gap-2 text-gold hover:text-navy font-medium transition-colors group text-sm">
          All events <span class="group-hover:translate-x-1 transition-transform">→</span>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── COMMUNITIES & GROUPS ── -->
  <section class="py-16 md:py-24 px-4 bg-white">
    <div class="max-w-6xl mx-auto">
      <div class="text-center mb-10 reveal">
        <span class="section-label">Get Involved</span>
        <h2 class="font-playfair text-3xl sm:text-5xl font-bold text-navy">Communities & Groups</h2>
        <div class="catholic-divider mt-3"><span class="text-gold text-base">✦</span></div>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink v-for="(m, i) in ministries" :key="m.label" to="/ministries" :class="`reveal delay-${(i + 1) * 100}`">
          <div class="flex flex-col items-center gap-3 p-5 bg-cream rounded-2xl border border-gray-100 stained-glow hover:border-gold/40 hover:-translate-y-2 transition-all duration-300 group text-center h-full">
            <div class="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl group-hover:bg-gold group-hover:scale-110 transition-all duration-300">
              {{ m.icon }}
            </div>
            <span class="text-xs sm:text-sm font-semibold text-navy group-hover:text-gold transition-colors">{{ m.label }}</span>
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>

  <!-- ── GALLERY STRIP ── -->
  <section class="py-3 overflow-hidden bg-navy">
    <div class="flex gap-3 animate-[scroll_30s_linear_infinite] w-max">
      <img v-for="(img, i) in [...galleryImages, ...galleryImages]" :key="i" :src="img"
        class="h-32 md:h-48 w-48 md:w-72 object-cover rounded-xl shrink-0 opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  </section>

  <!-- ── PRAYER INTENTION ── -->
  <section class="py-16 px-4 bg-cream">
    <div class="max-w-3xl mx-auto text-center reveal">
      <div class="w-16 h-16 rounded-full bg-navy flex items-center justify-center mx-auto mb-5">
        <span class="text-gold-light text-2xl">🙏</span>
      </div>
      <span class="section-label">Prayer of the Month</span>
      <h2 class="font-playfair text-2xl md:text-3xl font-bold text-navy mb-4">Act of Contrition</h2>
      <div class="catholic-divider"><span class="text-gold text-base">✦</span></div>
      <p class="text-gray-600 leading-relaxed italic text-sm md:text-base mt-4 max-w-xl mx-auto">
        "O my God, I am heartily sorry for having offended Thee, and I detest all my sins
        because of Thy just punishments, but most of all because they offend Thee, my God,
        who art all good and deserving of all my love..."
      </p>
    </div>
  </section>

  <!-- ── DONATE CTA ── -->
  <section class="relative py-16 md:py-24 px-4 overflow-hidden">
    <div class="absolute inset-0">
      <img src="/church-14.jpg" alt="Support" class="w-full h-full object-cover object-center" />
    </div>
    <div class="absolute inset-0 bg-navy/88" />
    <div class="relative z-10 max-w-2xl mx-auto text-center text-white reveal">
      <span class="section-label">Support Us</span>
      <h2 class="font-playfair text-3xl sm:text-4xl font-bold mb-3">Support Our Parish</h2>
      <div class="catholic-divider"><span class="text-gold-light text-base">✦</span></div>
      <p class="text-gray-300 text-sm md:text-base mb-8 leading-relaxed mt-4">
        Your generosity helps us maintain our church, support our ministries,
        and serve those in need in our community.
      </p>
      <NuxtLink to="/donate"
        class="inline-block px-10 py-4 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40">
        Make a Gift ✝
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const openMass = ref<number | null>(0)

const massTimes = ref([
  { day: 'Sunday', times: ['5:30 AM', '7:30 AM', '9:30 AM (Hausa Mass)', "9:30 AM (Children's Mass)", '11:00 AM', '5:15 PM (Benediction)', '6:00 PM'] },
  { day: 'Weekdays', times: ['6:00 AM', '6:00 PM (Mon – Fri)'] },
  { day: 'Saturday', times: ['6:00 AM'] },
  { day: 'Holy Days', times: ['To be announced — check bulletin'] },
])

const stats = [
  { value: '1988', label: 'Founded' },
  { value: '2,400+', label: 'Families' },
]

const sacraments = [
  { icon: '💧', name: 'Baptism' },
  { icon: '🕊️', name: 'Confirmation' },
  { icon: '🍞', name: 'Eucharist' },
  { icon: '🙏', name: 'Reconciliation' },
  { icon: '🛢️', name: 'Anointing' },
  { icon: '✝️', name: 'Holy Orders' },
  { icon: '💍', name: 'Matrimony' },
]

const events = ref<any[]>([
  { id: 1, event_date: '2026-07-20', title: 'Parish Picnic', event_time: 'After 11:00 AM Mass', description: 'Bring the whole family for food, games, and fellowship after the 11 AM Mass.', image_url: '/church-3.jpg' },
  { id: 2, event_date: '2026-07-27', title: 'Youth Group Retreat', event_time: 'Friday 6 PM – Sunday 2 PM', description: 'A weekend of prayer, community, and fun for high school students.', image_url: '/church-5.jpg' },
  { id: 3, event_date: '2026-08-03', title: 'Back-to-School Blessing', event_time: 'All Sunday Masses', description: 'Students and teachers will receive a special blessing at all Masses.', image_url: '/church-6.jpg' },
])

const galleryImages = ref([
  '/church-interior.jpg', '/church-1.jpg', '/church-2.jpg', '/church-3.jpg',
  '/church-4.jpg', '/church-5.jpg', '/church-6.jpg', '/church-7.jpg',
])

function eventDate(d: string) {
  if (!d) return { month: '—', day: '—' }
  const dt = new Date(d)
  return { month: dt.toLocaleString('en', { month: 'short' }).toUpperCase(), day: String(dt.getDate()).padStart(2, '0') }
}

onMounted(async () => {
  const { data: evData } = await supabase.from('events').select('*').eq('published', true).order('event_date').limit(3)
  if (evData && evData.length > 0) events.value = evData

  const { data: galData } = await supabase.from('gallery').select('image_url').order('created_at', { ascending: false }).limit(12)
  if (galData && galData.length > 0) galleryImages.value = galData.map((g: any) => g.image_url)

  const { data: mtData } = await supabase.from('mass_times').select('*').order('id')
  if (mtData && mtData.length > 0) {
    const grouped: Record<string, string[]> = {}
    mtData.forEach((r: any) => {
      if (!grouped[r.day]) grouped[r.day] = []
      grouped[r.day].push(r.note ? `${r.time} (${r.note})` : r.time)
    })
    massTimes.value = massTimes.value.map(m => ({
      ...m,
      times: grouped[m.day] ?? m.times,
    }))
  }
})
</script>

<style>
@keyframes scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
.mass-accordion {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}
.mass-accordion--open {
  max-height: 400px;
}
</style>
