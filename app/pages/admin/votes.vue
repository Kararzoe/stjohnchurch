<template>
  <div>
    <div class="mb-6">
      <h1 class="font-playfair text-2xl font-bold text-navy">Harvest Votes</h1>
      <p class="text-gray-400 text-sm mt-1">Live vote counts per category</p>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading votes...</div>

    <div v-else class="space-y-6">
      <div v-for="cat in categories" :key="cat.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <h2 class="font-playfair font-bold text-white">{{ cat.label }}</h2>
          <span class="text-gold text-sm font-black">{{ catTotal(cat.id) }} votes</span>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="c in sortedContestants(cat.id)" :key="c.id" class="flex items-center gap-4">
            <div class="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0 text-xs font-black text-navy">{{ c.rank }}</div>
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
const voteCounts = ref<Record<string, Record<string, number>>>({})

const categories = [
  { id: 'face', label: 'Face of Harvest' },
  { id: 'king', label: 'King of Harvest' },
  { id: 'queen', label: 'Queen of Harvest' },
  { id: 'prince', label: 'Prince of Harvest' },
  { id: 'princess', label: 'Princess of Harvest' },
]

onMounted(async () => {
  const { data } = await supabase.from('votes').select('category, contestant_id, contestant_name, qty')
  if (data) {
    data.forEach((v: any) => {
      if (!voteCounts.value[v.category]) voteCounts.value[v.category] = {}
      if (!voteCounts.value[v.category][v.contestant_id]) voteCounts.value[v.category][v.contestant_id] = 0
      voteCounts.value[v.category][v.contestant_id] += (v.qty || 1)
    })
  }
  loading.value = false
})

function catTotal(catId: string) {
  return Object.values(voteCounts.value[catId] ?? {}).reduce((s, n) => s + n, 0)
}

function sortedContestants(catId: string) {
  const counts = voteCounts.value[catId] ?? {}
  return Object.entries(counts)
    .map(([id, votes]) => ({ id, name: id, votes }))
    .sort((a, b) => b.votes - a.votes)
    .map((c, i) => ({ ...c, rank: i + 1 }))
}
</script>
