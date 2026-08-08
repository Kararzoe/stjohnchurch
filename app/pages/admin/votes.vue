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
      <div v-for="cat in CATEGORIES" :key="cat.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <h2 class="font-playfair font-bold text-white">{{ cat.icon }} {{ cat.label }}</h2>
          <span class="text-gold text-sm font-black">{{ catTotal(cat.id) }} votes</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="c in sortedContestants(cat.id)" :key="c.id" class="flex items-center gap-4">
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
          <p v-if="sortedContestants(cat.id).length === 0" class="text-gray-400 text-sm text-center py-4">No votes yet</p>
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
const allContestants = ref<any[]>([])
const harvestActive = ref(true)

const CATEGORIES = ref<any[]>([])

onMounted(async () => {
  const stored = localStorage.getItem('harvestActive')
  harvestActive.value = stored === null ? true : stored === 'true'
  const { data: cats } = await supabase.from('contest_categories').select('*').order('sort_order')
  CATEGORIES.value = cats ?? []
  load()
})

function toggleHarvest() {
  harvestActive.value = !harvestActive.value
  localStorage.setItem('harvestActive', String(harvestActive.value))
}

const grandTotal = computed(() => voteData.value.reduce((s, v) => s + (v.qty || 1), 0))

async function load() {
  loading.value = true
  const [{ data: cs }, { data: vs }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('votes').select('category, contestant_id, qty'),
  ])
  allContestants.value = cs ?? []
  voteData.value = vs ?? []
  loading.value = false
}

function catTotal(catId: string) {
  return voteData.value.filter(v => v.category === catId).reduce((s, v) => s + (v.qty || 1), 0)
}

function sortedContestants(catId: string) {
  return allContestants.value
    .filter(c => c.category === catId)
    .map(c => ({
      ...c,
      votes: voteData.value.filter(v => v.category === catId && v.contestant_id === c.id).reduce((s, v) => s + (v.qty || 1), 0),
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((c, i) => ({ ...c, rank: i + 1 }))
}
</script>
