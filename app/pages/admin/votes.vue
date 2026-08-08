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
        Pending
        <span v-if="pending.length" class="ml-2 bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{{ pending.length }}</span>
      </button>
      <button @click="tab = 'approved'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2', tab === 'approved' ? 'text-white border-transparent shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-navy']"
        :style="tab === 'approved' ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''">
        Approved
        <span v-if="approved.length" class="ml-2 bg-green-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{{ approved.length }}</span>
      </button>
      <button @click="tab = 'rejected'"
        :class="['px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2', tab === 'rejected' ? 'text-white border-transparent shadow-lg' : 'bg-white text-gray-500 border-gray-200 hover:border-navy']"
        :style="tab === 'rejected' ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''">
        Rejected
        <span v-if="rejected.length" class="ml-2 bg-gray-400 text-white text-xs font-black px-2 py-0.5 rounded-full">{{ rejected.length }}</span>
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
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Date</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Name</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Phone</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Category</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Contestant</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Qty</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Amount</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in pending" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
                <td class="px-4 py-3 font-semibold text-navy whitespace-nowrap">{{ row.voter_name }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatPhone(row.voter_phone) }}</td>
                <td class="px-4 py-3 text-xs text-gold font-bold uppercase tracking-widest whitespace-nowrap">{{ getCategoryLabel(row.category) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <img v-if="getContestant(row.contestant_id)?.photo" :src="getContestant(row.contestant_id).photo" class="w-full h-full object-cover object-top" />
                      <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
                    </div>
                    <span class="font-semibold text-navy whitespace-nowrap">{{ row.contestant_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center font-black text-navy">{{ row.qty }}</td>
                <td class="px-4 py-3 font-bold text-gold whitespace-nowrap">₦{{ (row.amount).toLocaleString() }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <button @click="approveRow(row)" class="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-black hover:bg-green-600 transition-all">✓ Approve</button>
                    <button @click="rejectRow(row)" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-black hover:bg-red-100 transition-all border border-red-200">✗ Reject</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── APPROVED TAB ── -->
    <div v-else-if="tab === 'approved'">
      <div v-if="approved.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
        No approved votes yet
      </div>
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Date</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Name</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Phone</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Category</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Contestant</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Qty</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Amount</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in approved" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
                <td class="px-4 py-3 font-semibold text-navy whitespace-nowrap">{{ row.voter_name }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatPhone(row.voter_phone) }}</td>
                <td class="px-4 py-3 text-xs text-gold font-bold uppercase tracking-widest whitespace-nowrap">{{ getCategoryLabel(row.category) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <img v-if="getContestant(row.contestant_id)?.photo" :src="getContestant(row.contestant_id).photo" class="w-full h-full object-cover object-top" />
                      <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
                    </div>
                    <span class="font-semibold text-navy whitespace-nowrap">{{ row.contestant_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center font-black text-navy">{{ row.qty }}</td>
                <td class="px-4 py-3 font-bold text-gold whitespace-nowrap">₦{{ (row.amount).toLocaleString() }}</td>
                <td class="px-4 py-3">
                  <button @click="rejectRow(row)" class="px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-black hover:bg-red-100 transition-all border border-red-200">✗ Undo</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- ── REJECTED TAB ── -->
    <div v-else-if="tab === 'rejected'">
      <div v-if="rejected.length === 0" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400 text-sm">
        No rejected votes
      </div>
      <div v-else class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-100 text-left" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Date</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Name</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Phone</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Category</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Contestant</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Qty</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Amount</th>
                <th class="px-4 py-3 text-gold text-xs font-bold uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rejected" :key="row.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td class="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
                <td class="px-4 py-3 font-semibold text-navy whitespace-nowrap">{{ row.voter_name }}</td>
                <td class="px-4 py-3 text-gray-500 whitespace-nowrap">{{ formatPhone(row.voter_phone) }}</td>
                <td class="px-4 py-3 text-xs text-gold font-bold uppercase tracking-widest whitespace-nowrap">{{ getCategoryLabel(row.category) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <div class="w-7 h-7 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                      <img v-if="getContestant(row.contestant_id)?.photo" :src="getContestant(row.contestant_id).photo" class="w-full h-full object-cover object-top" />
                      <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
                    </div>
                    <span class="font-semibold text-navy whitespace-nowrap">{{ row.contestant_name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-center font-black text-navy">{{ row.qty }}</td>
                <td class="px-4 py-3 font-bold text-gold whitespace-nowrap">₦{{ (row.amount).toLocaleString() }}</td>
                <td class="px-4 py-3">
                  <button @click="restoreRow(row)" class="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-black hover:bg-green-600 transition-all">✓ Restore</button>
                </td>
              </tr>
            </tbody>
          </table>
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
          <div v-for="c in sortedContestants(cat.id)" :key="c.id">
            <div class="flex items-center gap-4 mb-1">
              <div class="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0 text-xs font-black text-navy">{{ c.rank }}</div>
              <div class="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-gray-100">
                <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
                <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <p class="text-sm font-semibold text-navy truncate">{{ c.name }}</p>
                  <span class="text-sm font-black text-navy ml-2 shrink-0">{{ c.votes }} vote{{ c.votes !== 1 ? 's' : '' }}</span>
                </div>
                <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full rounded-full transition-all duration-700"
                    :style="`width: ${catTotal(cat.id) ? (c.votes / catTotal(cat.id)) * 100 : 0}%; background: linear-gradient(90deg, #b8860b, #d4af37)`" />
                </div>
              </div>
            </div>
            <!-- Voter names -->
            <div v-if="getVoters(cat.id, c.id).length" class="ml-16 flex flex-wrap gap-1 mb-3">
              <span v-for="v in getVoters(cat.id, c.id)" :key="v.id"
                class="text-[10px] bg-gray-50 border border-gray-200 rounded-full px-2 py-0.5 text-gray-500 font-semibold">
                {{ v.voter_name }} <span class="text-gray-300">·</span> {{ v.voter_phone }} <span class="text-gold font-bold">×{{ v.qty }}</span>
              </span>
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
const tab = ref<'pending' | 'approved' | 'rejected' | 'leaderboard'>('pending')
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

async function approveRow(row: any) {
  await supabase.from('votes').update({ status: 'approved' }).eq('id', row.id)
  load()
}

async function rejectRow(row: any) {
  if (!confirm(`Reject vote from ${row.voter_name} for ${row.contestant_name}?`)) return
  await supabase.from('votes').update({ status: 'rejected' }).eq('id', row.id)
  load()
}

async function restoreRow(row: any) {
  await supabase.from('votes').update({ status: 'pending' }).eq('id', row.id)
  load()
}

// Leaderboard: only approved votes
const approved = computed(() => voteData.value.filter(v => v.status === 'approved'))
const rejected = computed(() => voteData.value.filter(v => v.status === 'rejected'))
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

function getVoters(catId: string, contestantId: string) {
  return approved.value.filter(v => v.category === catId && v.contestant_id === contestantId)
}

function getContestant(id: string) {
  return allContestants.value.find(c => c.id === id)
}

function getCategoryLabel(id: string) {
  return CATEGORIES.value.find(c => c.id === id)?.label ?? id
}

function formatPhone(val: string) {
  return /\d/.test(val) ? val : ''
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
</script>
