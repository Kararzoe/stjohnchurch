<template>
  <div>
    <div class="mb-6">
      <h1 class="font-playfair text-2xl font-bold text-navy">Contestants</h1>
      <p class="text-gray-400 text-sm mt-1">Harvest/Bazaar Thanksgiving 2026 — all categories</p>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
      <button
        v-for="cat in categories" :key="cat.id"
        @click="activeTab = cat.id"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0',
          activeTab === cat.id
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
        ]"
      >
        {{ cat.icon }} {{ cat.label }}
        <span class="ml-1 text-xs font-black">({{ cat.contestants.length }})</span>
      </button>
    </div>

    <!-- Contestants table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Photo</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Tagline</th>
              <th class="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Votes</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="c in activeContestants" :key="c.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-3">
                <span class="w-7 h-7 rounded-full bg-navy/10 text-navy text-xs font-black flex items-center justify-center">{{ c.number }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                  <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
                  <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-lg">👤</div>
                </div>
              </td>
              <td class="px-5 py-3">
                <p class="font-semibold text-navy text-sm">{{ c.name }}</p>
              </td>
              <td class="px-5 py-3">
                <p class="text-gray-400 text-xs">{{ c.tagline }}</p>
              </td>
              <td class="px-5 py-3 text-right">
                <span v-if="loading" class="text-gray-300 text-sm">—</span>
                <span v-else class="font-black text-navy text-sm">{{ voteCounts[c.id] ?? 0 }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total row -->
      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400 font-semibold">{{ activeContestants.length }} contestants in this category</p>
        <p class="text-xs font-black text-navy">
          Total votes: {{ activeContestants.reduce((s, c) => s + (voteCounts[c.id] ?? 0), 0).toLocaleString() }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const voteCounts = ref<Record<string, number>>({})
const activeTab = ref('face')

const categories = [
  {
    id: 'face', label: 'Face of Harvest', icon: '👑',
    contestants: [
      { id: 'f1', number: 1, name: 'Miss Chimamanda Lawrence', tagline: '📞 08087350321', photo: '/foh-chimamanda.jpg' },
      { id: 'f2', number: 2, name: 'Miss Emmanuelle Moses', tagline: '📞 07039730834', photo: '/foh-emmanuelle.jpg' },
      { id: 'f3', number: 3, name: 'Mr. Sebastian Felix', tagline: 'Face of Harvest', photo: '/foh-sebastian.jpg' },
      { id: 'f4', number: 4, name: 'Master John Agim', tagline: 'Face of Harvest', photo: '/foh-john.jpg' },
      { id: 'f5', number: 5, name: 'Master Iyeakachukwu Ugochukwu', tagline: 'Face of Harvest', photo: '/foh-iyeaka.jpg' },
      { id: 'f6', number: 6, name: 'Ashinatiang C. Perpetual', tagline: '📞 08114277256', photo: '/foh-perpetual.jpg' },
      { id: 'f7', number: 7, name: 'Onwumelu Omerebere Clare', tagline: 'CYON', photo: '/foh-clare.jpg' },
      { id: 'f8', number: 8, name: 'Mrs. Blessing Obiora', tagline: 'Face of Harvest', photo: '/foh-blessing.jpg' },
      { id: 'f9', number: 9, name: 'Uzuegbuna Felicity Chidinma', tagline: '📞 09045411265 · Voice of Saints Choir', photo: '/foh-felicity.jpg' },
    ],
  },
  {
    id: 'king', label: 'King of Harvest', icon: '🤴',
    contestants: [
      { id: 'k1', number: 1, name: 'Mr. Jonathan Dodo', tagline: 'King of Harvest', photo: '/koh-jonathan.jpg' },
      { id: 'k2', number: 2, name: 'Paul Djukpan', tagline: 'St. Patrick Edo/Delta', photo: '/koh-paul.jpg' },
    ],
  },
  {
    id: 'queen', label: 'Queen of Harvest', icon: '👸',
    contestants: [
      { id: 'q1', number: 1, name: 'Mrs. Queen Ogbodo', tagline: 'Queen of Harvest', photo: '/qoh-queen.jpg' },
      { id: 'q2', number: 2, name: 'Mrs. Veronica Aboi', tagline: 'Queen of Harvest', photo: '/qoh-veronica.jpg' },
      { id: 'q3', number: 3, name: 'Mrs. Elizabeth Akuezue', tagline: '📞 08053258408', photo: '/qoh-elizabeth.jpg' },
      { id: 'q4', number: 4, name: 'Mrs. Gladys Origbo Onome', tagline: 'Queen of Harvest', photo: '/qoh-gladys.jpg' },
      { id: 'q5', number: 5, name: 'Oghenekevwe Patience Godwin', tagline: 'St. Patrick Edo/Delta', photo: '/qoh-patience.jpg' },
    ],
  },
  {
    id: 'prince', label: 'Prince of Harvest', icon: '🫅',
    contestants: [
      { id: 'p1', number: 1, name: 'Peter Yohanna Akpajeshi', tagline: 'Prince of Harvest', photo: '/proh-peter.jpg' },
      { id: 'p2', number: 2, name: 'Andrew Kelechi Kenechukwu', tagline: 'Prince of Harvest', photo: '/proh-andrew.jpg' },
      { id: 'p3', number: 3, name: 'Okpara Franklin', tagline: '📞 07061668284 · Holy Trinity Igbo Youth', photo: '/proh-franklin.jpg' },
      { id: 'p4', number: 4, name: 'Sunday Wisdom', tagline: 'Blessed Iwene Tansi', photo: '/proh-sunday.jpg' },
      { id: 'p5', number: 5, name: 'Ukam Emmanuel Chukwuemeka', tagline: 'Prince of Harvest', photo: '/proh-ukam.jpg' },
    ],
  },
  {
    id: 'princess', label: 'Princess of Harvest', icon: '🌸',
    contestants: [
      { id: 'pr1', number: 1, name: 'Miss Joyce Gomerep', tagline: 'Princess of Harvest', photo: '/poh-joyce.jpg' },
      { id: 'pr2', number: 2, name: 'Miss Joan Okwuchi', tagline: 'Princess of Harvest', photo: '/poh-joan.jpg' },
      { id: 'pr3', number: 3, name: 'Miss Chioma Aniagboso', tagline: 'Princess of Harvest', photo: '/poh-chioma.jpg' },
      { id: 'pr4', number: 4, name: 'Grace Enyo-Ojo Okpanachi', tagline: 'Princess of Harvest', photo: '/poh-grace.jpg' },
      { id: 'pr5', number: 5, name: 'Eleme Lilian Chidera', tagline: 'Princess of Harvest', photo: '/poh-eleme.jpg' },
      { id: 'pr6', number: 6, name: 'Jaelynn Ebeyin Ikwen', tagline: 'Princess of Harvest', photo: '/poh-jaelynn.jpg' },
      { id: 'pr7', number: 7, name: 'Chukwunonso Anthonia Chidimma', tagline: 'Princess of Harvest', photo: '/poh-chukwunonso.jpg' },
      { id: 'pr8', number: 8, name: 'Omeje Chinecherem', tagline: '📞 08147566658 · Holy Trinity Igbo Youth', photo: '/poh-omeje.jpg' },
      { id: 'pr9', number: 9, name: 'Obayi Emmanuella Somtochukwu', tagline: 'Blessed Iwene Tansi', photo: '/poh-emmanuella.jpg' },
      { id: 'pr10', number: 10, name: 'Princess Oluwasindara Lucy Adodo', tagline: 'St. Michael Yoruba Catholic Community', photo: '/poh-oluwasindara.jpg' },
      { id: 'pr11', number: 11, name: 'Josephine Bonet', tagline: 'Princess of Harvest', photo: '/poh-josephine.jpg' },
      { id: 'pr12', number: 12, name: 'Maia Kosisochukwu', tagline: 'Princess of Harvest', photo: '/poh-maia.jpg' },
    ],
  },
]

const activeContestants = computed(() => categories.find(c => c.id === activeTab.value)?.contestants ?? [])

onMounted(async () => {
  const { data } = await supabase.from('votes').select('contestant_id')
  if (data) {
    data.forEach((v: any) => {
      voteCounts.value[v.contestant_id] = (voteCounts.value[v.contestant_id] ?? 0) + 1
    })
  }
  loading.value = false
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
