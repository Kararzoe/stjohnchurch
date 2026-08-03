<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Elections</h1>
        <p class="text-gray-400 text-sm mt-1">Create and manage parish elections</p>
      </div>
      <button @click="showCreate = true"
        class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + New Election
      </button>
    </div>

    <!-- Elections list -->
    <div class="space-y-4 mb-8">
      <div v-for="e in elections" :key="e.id"
        class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-widest', e.status === 'Open' ? 'bg-green-50 text-green-600' : e.status === 'Closed' ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-400']">
                {{ e.status }}
              </span>
              <span class="text-xs text-gray-400">{{ e.opens }} → {{ e.closes }}</span>
            </div>
            <h3 class="font-playfair font-bold text-navy text-lg mb-1">{{ e.title }}</h3>
            <p class="text-gray-400 text-sm">{{ e.positions.length }} positions · {{ e.voted }}/{{ e.total }} votes cast</p>
            <div class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden w-64">
              <div class="h-full rounded-full transition-all" style="background: linear-gradient(90deg, #b8860b, #d4af37)" :style="`width: ${(e.voted/e.total)*100}%`" />
            </div>
          </div>
          <div class="flex gap-2 shrink-0">
            <button @click="viewResults(e)" class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:border-gold hover:text-gold transition-colors">Results</button>
            <button :class="['px-4 py-2 rounded-xl text-sm font-bold transition-colors', e.status === 'Open' ? 'bg-red-50 text-red-500 hover:bg-red-100' : 'bg-green-50 text-green-600 hover:bg-green-100']" @click="toggleStatus(e)">
              {{ e.status === 'Open' ? 'Close' : 'Open' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results panel -->
    <div v-if="selectedElection" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div class="flex items-center justify-between mb-5">
        <h2 class="font-playfair text-xl font-bold text-navy">Results: {{ selectedElection.title }}</h2>
        <button @click="selectedElection = null" class="text-gray-400 hover:text-navy text-xl transition-colors">✕</button>
      </div>
      <div class="space-y-5">
        <div v-for="pos in selectedElection.positions" :key="pos.title">
          <h3 class="font-semibold text-navy mb-3 text-sm">{{ pos.title }}</h3>
          <div class="space-y-2">
            <div v-for="c in pos.candidates" :key="c.name" class="flex items-center gap-3">
              <span class="text-sm text-gray-600 w-32 shrink-0">{{ c.name }}</span>
              <div class="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all flex items-center justify-end pr-2" style="background: linear-gradient(90deg, #b8860b, #d4af37)" :style="`width: ${c.pct}%`">
                  <span class="text-white text-xs font-bold">{{ c.pct }}%</span>
                </div>
              </div>
              <span class="text-sm text-gray-400 w-16 text-right">{{ c.votes }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create election modal -->
    <div v-if="showCreate" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-6 w-full max-w-lg shadow-2xl">
        <h2 class="font-playfair text-xl font-bold text-navy mb-5">Create New Election</h2>
        <form class="space-y-4" @submit.prevent="createElection">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Election Title</label>
            <input v-model="newElection.title" type="text" placeholder="e.g. Parish Council Elections 2026"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Opens</label>
              <input v-model="newElection.opens" type="date" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Closes</label>
              <input v-model="newElection.closes" type="date" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Positions (comma separated)</label>
            <input v-model="newElection.positions" type="text" placeholder="Chairman, Secretary, Treasurer"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" @click="showCreate = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button type="submit" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">Create</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const showCreate = ref(false)
const selectedElection = ref<any>(null)
const newElection = reactive({ title: '', opens: '', closes: '', positions: '' })

const elections = ref([
  {
    id: 'parish-council-2026',
    title: 'Parish Council Elections 2026',
    status: 'Open',
    opens: 'Aug 1, 2026',
    closes: 'Aug 10, 2026',
    voted: 187,
    total: 240,
    positions: [
      { title: 'Chairman', candidates: [{ name: 'Candidate A', votes: 102, pct: 55 }, { name: 'Candidate B', votes: 85, pct: 45 }] },
      { title: 'Secretary', candidates: [{ name: 'Candidate C', votes: 120, pct: 64 }, { name: 'Candidate D', votes: 67, pct: 36 }] },
      { title: 'Treasurer', candidates: [{ name: 'Candidate E', votes: 95, pct: 51 }, { name: 'Candidate F', votes: 92, pct: 49 }] },
      { title: 'PRO', candidates: [{ name: 'Candidate G', votes: 140, pct: 75 }, { name: 'Candidate H', votes: 47, pct: 25 }] },
    ],
  },
])

function viewResults(e: any) { selectedElection.value = e }
function toggleStatus(e: any) { e.status = e.status === 'Open' ? 'Closed' : 'Open' }
function createElection() {
  elections.value.push({
    id: Date.now().toString(),
    title: newElection.title,
    status: 'Pending',
    opens: newElection.opens,
    closes: newElection.closes,
    voted: 0,
    total: 240,
    positions: newElection.positions.split(',').map(p => ({ title: p.trim(), candidates: [] })),
  })
  showCreate.value = false
  Object.assign(newElection, { title: '', opens: '', closes: '', positions: '' })
}
</script>
