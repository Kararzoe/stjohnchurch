<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-navy min-h-screen flex flex-col shrink-0">
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gold/20 border border-gold-light/40 flex items-center justify-center">
            <span class="text-gold-light">✝</span>
          </div>
          <div>
            <p class="text-white font-bold text-sm leading-tight">St. John of the Cross</p>
            <p class="text-gold-light text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm">
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-white/10">
        <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <span>←</span> Back to Website
        </NuxtLink>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-8 overflow-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-playfair text-3xl font-bold text-navy">Elections</h1>
          <p class="text-gray-500 text-sm mt-1">Create and manage parish elections</p>
        </div>
        <button @click="showCreate = true"
          class="px-5 py-2.5 rounded-full bg-gold text-white font-semibold text-sm hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30">
          + New Election
        </button>
      </div>

      <!-- Elections list -->
      <div class="space-y-4 mb-8">
        <div v-for="e in elections" :key="e.id"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-shadow">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <span :class="['text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest', e.status === 'Open' ? 'bg-green-100 text-green-700' : e.status === 'Closed' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500']">
                  {{ e.status }}
                </span>
                <span class="text-xs text-gray-400">{{ e.opens }} → {{ e.closes }}</span>
              </div>
              <h3 class="font-playfair font-bold text-navy text-xl mb-1">{{ e.title }}</h3>
              <p class="text-gray-500 text-sm">{{ e.positions.length }} positions · {{ e.voted }}/{{ e.total }} votes cast</p>
              <!-- Progress bar -->
              <div class="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden w-64">
                <div class="h-full bg-gold rounded-full transition-all" :style="`width: ${(e.voted/e.total)*100}%`" />
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="viewResults(e)"
                class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gold hover:text-gold transition-colors">
                Results
              </button>
              <button :class="['px-4 py-2 rounded-xl text-sm font-medium transition-colors', e.status === 'Open' ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-green-50 text-green-700 hover:bg-green-100']"
                @click="toggleStatus(e)">
                {{ e.status === 'Open' ? 'Close' : 'Open' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Results panel -->
      <div v-if="selectedElection" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-6">
          <h2 class="font-playfair text-xl font-bold text-navy">Results: {{ selectedElection.title }}</h2>
          <button @click="selectedElection = null" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        <div class="space-y-6">
          <div v-for="pos in selectedElection.positions" :key="pos.title">
            <h3 class="font-semibold text-navy mb-3">{{ pos.title }}</h3>
            <div class="space-y-2">
              <div v-for="c in pos.candidates" :key="c.name" class="flex items-center gap-3">
                <span class="text-sm text-gray-700 w-32 shrink-0">{{ c.name }}</span>
                <div class="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden">
                  <div class="h-full bg-gold rounded-full transition-all flex items-center justify-end pr-2"
                    :style="`width: ${c.pct}%`">
                    <span class="text-white text-xs font-bold">{{ c.pct }}%</span>
                  </div>
                </div>
                <span class="text-sm text-gray-500 w-16 text-right">{{ c.votes }} votes</span>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          <button class="px-4 py-2 rounded-xl bg-navy text-white text-sm font-medium hover:bg-navy-light transition-colors">
            Publish Results
          </button>
          <button class="px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-gold hover:text-gold transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      <!-- Create election modal -->
      <div v-if="showCreate" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl">
          <h2 class="font-playfair text-2xl font-bold text-navy mb-6">Create New Election</h2>
          <form class="space-y-4" @submit.prevent="createElection">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Election Title</label>
              <input v-model="newElection.title" type="text" placeholder="e.g. Parish Council Elections 2026"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Opens</label>
                <input v-model="newElection.opens" type="date"
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Closes</label>
                <input v-model="newElection.closes" type="date"
                  class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Positions (comma separated)</label>
              <input v-model="newElection.positions" type="text" placeholder="Chairman, Secretary, Treasurer"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit"
                class="flex-1 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all">
                Create Election
              </button>
              <button type="button" @click="showCreate = false"
                class="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const showCreate = ref(false)
const selectedElection = ref<any>(null)
const newElection = reactive({ title: '', opens: '', closes: '', positions: '' })

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/content', label: 'Website Content', icon: '📝' },
  { to: '/admin/elections', label: 'Elections', icon: '🗳️' },
  { to: '/admin/members', label: 'Members', icon: '👥' },
  { to: '/admin/gallery', label: 'Photo Gallery', icon: '📷' },
  { to: '/admin/news', label: 'News & Updates', icon: '📰' },
  { to: '/admin/mass-times', label: 'Mass Times', icon: '🕐' },
]

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
