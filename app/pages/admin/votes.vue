<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Harvest Votes</h1>
        <p class="text-gray-400 text-sm mt-1">Live vote counts per category</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400 font-semibold">Total: {{ grandTotal }} votes</span>
        <button @click="load" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-navy hover:text-navy transition-all">↻ Refresh</button>
      </div>
    </div>

    <!-- Harvest Active Toggle -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center justify-between">
      <div>
        <p class="font-semibold text-navy text-sm">Harvest Season Active</p>
        <p class="text-xs text-gray-400 mt-0.5">When OFF, the Harvest Votes &amp; Contestants links are hidden from the sidebar and the public voting page is disabled.</p>
      </div>
      <button
        @click="toggleHarvest"
        :class="[
          'relative inline-flex h-7 w-14 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none',
          harvestActive ? 'bg-green-500' : 'bg-gray-300'
        ]"
      >
        <span
          :class="[
            'pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-200',
            harvestActive ? 'translate-x-7' : 'translate-x-0'
          ]"
        />
      </button>
    </div>

    <div v-if="!harvestActive" class="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-6 flex items-center gap-3">
      <span class="text-2xl">🌾</span>
      <div>
        <p class="font-semibold text-amber-800 text-sm">Harvest season is currently OFF</p>
        <p class="text-xs text-amber-600 mt-0.5">Harvest Votes and Contestants are hidden from the sidebar. Toggle ON above to re-enable.</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading votes...</div>

    <div v-else class="space-y-6">
      <div v-for="cat in categories" :key="cat.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <h2 class="font-playfair font-bold text-white">{{ cat.icon }} {{ cat.label }}</h2>
          <span class="text-gold text-sm font-black">{{ catTotal(cat.id) }} votes</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="c in sortedContestants(cat)" :key="c.id" class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0 text-xs font-black text-navy">{{ c.rank }}</div>
            <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
              <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
              <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <p class="text-sm font-semibold text-navy truncate">{{ c.name }}</p>
                <span class="text-sm font-black text-navy ml-2 shrink-0">{{ c.votes }}</span>
              </div>
              <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-700"
                  :style="`width: ${catTotal(cat.id) ? (c.votes / catTotal(cat.id)) * 100 : 0}%; background: linear-gradient(90deg, #b8860b, #d4af37)`" />
              </div>
            </div>
          </div>
          <p v-if="sortedContestants(cat).length === 0" class="text-gray-400 text-sm text-center py-4">No votes yet</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const voteData = ref<any[]>([])
const harvestActive = ref(true)

onMounted(() => {
  const stored = localStorage.getItem('harvestActive')
  harvestActive.value = stored === null ? true : stored === 'true'
  load()
})

function toggleHarvest() {
  harvestActive.value = !harvestActive.value
  localStorage.setItem('harvestActive', String(harvestActive.value))
}

const categories = [
  { id: 'face', label: 'Face of Harvest', icon: '👑', contestants: [
    { id: 'f1', name: 'Miss Chimamanda Lawrence', photo: '/foh-chimamanda.jpg' },
    { id: 'f2', name: 'Miss Emmanuelle Moses', photo: '/foh-emmanuelle.jpg' },
    { id: 'f3', name: 'Mr. Sebastian Felix', photo: '/foh-sebastian.jpg' },
    { id: 'f4', name: 'Master John Agim', photo: '/foh-john.jpg' },
    { id: 'f5', name: 'Master Iyeakachukwu Ugochukwu', photo: '/foh-iyeaka.jpg' },
    { id: 'f6', name: 'Ashinatiang C. Perpetual', photo: '/foh-perpetual.jpg' },
    { id: 'f7', name: 'Onwumelu Omerebere Clare', photo: '/foh-clare.jpg' },
    { id: 'f8', name: 'Mrs. Blessing Obiora', photo: '/foh-blessing.jpg' },
    { id: 'f9', name: 'Uzuegbuna Felicity Chidinma', photo: '/foh-felicity.jpg' },
  ]},
  { id: 'king', label: 'King of Harvest', icon: '🤴', contestants: [
    { id: 'k1', name: 'Mr. Jonathan Dodo', photo: '/koh-jonathan.jpg' },
    { id: 'k2', name: 'Paul Djukpan', photo: '/koh-paul.jpg' },
  ]},
  { id: 'queen', label: 'Queen of Harvest', icon: '👸', contestants: [
    { id: 'q1', name: 'Mrs. Queen Ogbodo', photo: '/qoh-queen.jpg' },
    { id: 'q2', name: 'Mrs. Veronica Aboi', photo: '/qoh-veronica.jpg' },
    { id: 'q3', name: 'Mrs. Elizabeth Akuezue', photo: '/qoh-elizabeth.jpg' },
    { id: 'q4', name: 'Mrs. Gladys Origbo Onome', photo: '/qoh-gladys.jpg' },
    { id: 'q5', name: 'Oghenekevwe Patience Godwin', photo: '/qoh-patience.jpg' },
  ]},
  { id: 'prince', label: 'Prince of Harvest', icon: '🫅', contestants: [
    { id: 'p1', name: 'Peter Yohanna Akpajeshi', photo: '/proh-peter.jpg' },
    { id: 'p2', name: 'Andrew Kelechi Kenechukwu', photo: '/proh-andrew.jpg' },
    { id: 'p3', name: 'Okpara Franklin', photo: '/proh-franklin.jpg' },
    { id: 'p4', name: 'Sunday Wisdom', photo: '/proh-sunday.jpg' },
    { id: 'p5', name: 'Ukam Emmanuel Chukwuemeka', photo: '/proh-ukam.jpg' },
  ]},
  { id: 'princess', label: 'Princess of Harvest', icon: '🌸', contestants: [
    { id: 'pr1', name: 'Miss Joyce Gomerep', photo: '/poh-joyce.jpg' },
    { id: 'pr2', name: 'Miss Joan Okwuchi', photo: '/poh-joan.jpg' },
    { id: 'pr3', name: 'Miss Chioma Aniagboso', photo: '/poh-chioma.jpg' },
    { id: 'pr4', name: 'Grace Enyo-Ojo Okpanachi', photo: '/poh-grace.jpg' },
    { id: 'pr5', name: 'Eleme Lilian Chidera', photo: '/poh-eleme.jpg' },
    { id: 'pr6', name: 'Jaelynn Ebeyin Ikwen', photo: '/poh-jaelynn.jpg' },
    { id: 'pr7', name: 'Chukwunonso Anthonia Chidimma', photo: '/poh-chukwunonso.jpg' },
    { id: 'pr8', name: 'Omeje Chinecherem', photo: '/poh-omeje.jpg' },
    { id: 'pr9', name: 'Obayi Emmanuella Somtochukwu', photo: '/poh-emmanuella.jpg' },
    { id: 'pr10', name: 'Princess Oluwasindara Lucy Adodo', photo: '/poh-oluwasindara.jpg' },
    { id: 'pr11', name: 'Josephine Bonet', photo: '/poh-josephine.jpg' },
    { id: 'pr12', name: 'Maia Kosisochukwu', photo: '/poh-maia.jpg' },
  ]},
]

const grandTotal = computed(() => voteData.value.reduce((s, v) => s + (v.qty || 1), 0))

async function load() {
  loading.value = true
  const { data } = await supabase.from('votes').select('category, contestant_id, qty')
  voteData.value = data ?? []
  loading.value = false
}

function catTotal(catId: string) {
  return voteData.value.filter(v => v.category === catId).reduce((s, v) => s + (v.qty || 1), 0)
}

function sortedContestants(cat: typeof categories[0]) {
  return cat.contestants
    .map(c => ({
      ...c,
      votes: voteData.value.filter(v => v.category === cat.id && v.contestant_id === c.id).reduce((s, v) => s + (v.qty || 1), 0),
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((c, i) => ({ ...c, rank: i + 1 }))
}
</script>
