<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Harvest Votes</h1>
        <p class="text-gray-400 text-sm mt-1">Manage and verify vote submissions</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="text-xs text-gray-400 font-semibold">{{ grandTotal }} approved votes</span>
        <button @click="load" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-navy hover:text-navy transition-all">↻ Refresh</button>
      </div>
    </div>

    <!-- Harvest Toggle -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 flex items-center justify-between">
      <div>
        <p class="font-semibold text-navy text-sm">Harvest Season Active</p>
        <p class="text-xs text-gray-400 mt-0.5">When OFF, the voting page is disabled and sidebar links are hidden.</p>
      </div>
      <button @click="toggleHarvest"
        :class="['relative inline-flex h-7 w-14 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none', harvestActive ? 'bg-green-500' : 'bg-gray-300']">
        <span :class="['pointer-events-none inline-block h-6 w-6 rounded-full bg-white shadow-lg transform transition-transform duration-200', harvestActive ? 'translate-x-7' : 'translate-x-0']" />
      </button>
    </div>

    <!-- Tabs -->
    <div class="flex gap-2 mb-6">
      <button @click="tab = 'pending'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2', tab === 'pending' ? 'text-white border-transparent shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-navy']"
        :style="tab === 'pending' ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''">
        Pending Approvals
        <span v-if="pending.length" class="ml-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{{ pending.length }}</span>
      </button>
      <button @click="tab = 'leaderboard'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2', tab === 'leaderboard' ? 'text-white border-transparent shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-navy']"
        :style="tab === 'leaderboard' ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''">
        Leaderboard
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading...</div>

    <!-- ── PENDING TAB ── -->
    <div v-else-if="tab === 'pending'">
      <div v-if="pending.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
        No pending submissions 🎉
      </div>

      <!-- Group by reference -->
      <div v-for="group in pendingGroups" :key="group.reference" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-4">
        <div class="px-5 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3" style="background: linear-gradient(135deg, #faf8f3, #fff)">
          <div>
            <p class="font-bold text-navy text-sm">{{ group.voter_name }} <span class="text-gray-400 font-normal">· {{ group.voter_phone }}</span></p>
            <p class="text-xs text-gray-500 mt-0.5">
              <span class="font-semibold text-navy">{{ group.bank }}</span>
              · Ref: <span class="font-mono font-bold text-navy">{{ group.reference }}</span>
              · <span class="text-gold font-bold">₦{{ group.amount.toLocaleString() }}</span>
              · {{ group.qty }} vote{{ group.qty > 1 ? 's' : '' }}
              · <span class="text-gray-400">{{ formatDate(group.created_at) }}</span>
            </p>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="approveGroup(group)" class="px-4 py-2 rounded-xl bg-green-500 text-white text-xs font-black hover:bg-green-600 transition-all shadow-sm">✓ Approve</button>
            <button @click="rejectGroup(group)" class="px-4 py-2 rounded-xl bg-red-50 text-red-500 text-xs font-black hover:bg-red-100 transition-all border border-red-200">✗ Reject</button>
          </div>
        </div>
        <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div v-for="row in group.rows" :key="row.id" class="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
            <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-200">
              <img v-if="getContestant(row.contestant_id)?.photo" :src="getContestant(row.contestant_id).photo" class="w-full h-full object-cover object-top" />
              <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
            </div>
            <div class="min-w-0">
              <p class="text-[10px] text-gold uppercase tracking-widest font-bold truncate">{{ getCategoryLabel(row.category) }}</p>
              <p class="text-sm font-semibold text-navy truncate">{{ row.contestant_name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── LEADERBOARD TAB ── -->
    <div v-else-if="tab === 'leaderboard'" class="space-y-6">
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
const tab = ref<'pending' | 'leaderboard'>('pending')
const voteData = ref<any[]>([])
const allContestants = ref<any[]>([])
const harvestActive = useState('harvestActive', () => true)
const CATEGORIES = ref<any[]>([])

onMounted(async () => {
  const [{ data: cats }, { data: hd }] = await Promise.all([
    supabase.from('contest_categories').select('*').order('sort_order'),
    supabase.from('site_content').select('value').eq('key', 'harvest_active').single(),
  ])
  CATEGORIES.value = cats ?? []
  harvestActive.value = hd ? hd.value === 'true' : true
  load()
})

async function toggleHarvest() {
  harvestActive.value = !harvestActive.value
  await supabase.from('site_content').upsert({ key: 'harvest_active', value: String(harvestActive.value) }, { onConflict: 'key' })
}

async function load() {
  loading.value = true
  const [{ data: cs }, { data: vs }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('votes').select('*').order('created_at', { ascending: false }),
  ])
  allContestants.value = cs ?? []
  voteData.value = vs ?? []
  loading.value = false
}

// Pending: group rows by reference so one approval covers all categories
const pending = computed(() => voteData.value.filter(v => v.status === 'pending'))

const pendingGroups = computed(() => {
  const map: Record<string, any> = {}
  for (const row of pending.value) {
    if (!map[row.reference]) {
      map[row.reference] = { reference: row.reference, voter_name: row.voter_name, voter_phone: row.voter_phone, bank: row.bank, qty: row.qty, amount: row.amount, created_at: row.created_at, rows: [] }
    }
    map[row.reference].rows.push(row)
  }
  return Object.values(map)
})

async function approveGroup(group: any) {
  const ids = group.rows.map((r: any) => r.id)
  await supabase.from('votes').update({ status: 'approved' }).in('id', ids)
  load()
}

async function rejectGroup(group: any) {
  if (!confirm(`Reject all votes from ${group.voter_name} (ref: ${group.reference})?`)) return
  const ids = group.rows.map((r: any) => r.id)
  await supabase.from('votes').update({ status: 'rejected' }).in('id', ids)
  load()
}

// Leaderboard: only approved votes
const approved = computed(() => voteData.value.filter(v => v.status === 'approved'))
const grandTotal = computed(() => approved.value.reduce((s, v) => s + (v.qty || 1), 0))

function catTotal(catId: string) {
  return approved.value.filter(v => v.category === catId).reduce((s, v) => s + (v.qty || 1), 0)
}

function sortedContestants(catId: string) {
  return allContestants.value
    .filter(c => c.category === catId)
    .map(c => ({
      ...c,
      votes: approved.value.filter(v => v.category === catId && v.contestant_id === c.id).reduce((s, v) => s + (v.qty || 1), 0),
    }))
    .sort((a, b) => b.votes - a.votes)
    .map((c, i) => ({ ...c, rank: i + 1 }))
}

function getContestant(id: string) {
  return allContestants.value.find(c => c.id === id)
}

function getCategoryLabel(id: string) {
  return CATEGORIES.value.find(c => c.id === id)?.label ?? id
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
