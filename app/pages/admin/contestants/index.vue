<template>
  <div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Contests</h1>
        <p class="text-gray-400 text-sm mt-1">Create and manage parish voting contests</p>
      </div>
      <button @click="openNewContest" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        <span>+</span> New Contest
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading...</div>

    <div v-else>

      <!-- Active Contest -->
      <div v-if="activeContest" class="mb-10">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse inline-block" />
          <p class="text-xs font-black text-green-600 uppercase tracking-widest">Active Contest</p>
        </div>
        <div class="relative overflow-hidden rounded-2xl shadow-md border-2 border-green-200">
          <div class="absolute inset-0 opacity-5" style="background-image: radial-gradient(circle, #1a2744 1px, transparent 1px); background-size: 20px 20px;" />
          <div class="relative p-6 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                <span class="text-2xl">🏆</span>
              </div>
              <div>
                <p class="font-playfair font-bold text-navy text-lg leading-tight">{{ activeContest.title }}</p>
                <p class="text-gray-400 text-sm mt-0.5">{{ activeContest.subtitle }}</p>
                <p class="text-xs text-gray-300 mt-1">Started {{ formatDate(activeContest.created_at) }}</p>
              </div>
            </div>
            <div class="flex gap-2 shrink-0">
              <button @click="goManage" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-md" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                Manage →
              </button>
              <button @click="confirmArchive(activeContest)" class="px-5 py-2.5 rounded-xl border-2 border-gray-200 text-gray-500 text-sm font-bold hover:border-red-300 hover:text-red-500 transition-all">
                End Contest
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- No active contest -->
      <div v-else class="mb-10 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-center bg-white">
        <div class="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto mb-4">
          <span class="text-3xl">🏆</span>
        </div>
        <p class="font-playfair font-bold text-navy text-lg mb-1">No Active Contest</p>
        <p class="text-gray-400 text-sm mb-5">Create a new contest to start accepting votes on the public site.</p>
        <button @click="openNewContest" class="px-6 py-3 rounded-xl text-white text-sm font-bold shadow-md hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          + Create New Contest
        </button>
      </div>

      <!-- Previous Contests -->
      <div>
        <div class="flex items-center gap-3 mb-4">
          <p class="text-xs font-black text-gray-400 uppercase tracking-widest">Previous Contests</p>
          <div class="flex-1 h-px bg-gray-100" />
          <span class="text-xs text-gray-300 font-semibold">{{ archivedContests.length }} contest{{ archivedContests.length !== 1 ? 's' : '' }}</span>
        </div>

        <div v-if="archivedContests.length === 0" class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
          No previous contests yet
        </div>

        <div v-else class="space-y-3">
          <div v-for="contest in archivedContests" :key="contest.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all p-5 flex items-center justify-between gap-4">
            <div class="flex items-center gap-4 min-w-0">
              <div class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <span class="text-lg">🏅</span>
              </div>
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="text-[10px] bg-gray-100 text-gray-500 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Ended</span>
                  <p class="font-playfair font-bold text-navy truncate">{{ contest.title }}</p>
                </div>
                <p class="text-gray-400 text-xs mt-0.5 truncate">{{ contest.subtitle }}</p>
                <p class="text-gray-300 text-xs mt-0.5">{{ formatDate(contest.created_at) }}</p>
              </div>
            </div>
            <button @click="viewResults(contest)"
              class="shrink-0 px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-xs font-bold hover:border-navy hover:text-navy transition-all flex items-center gap-1.5">
              <span>View Results</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Contest Modal -->
    <div v-if="showNewContest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="font-playfair text-xl font-bold text-navy">New Contest</h2>
            <p class="text-gray-400 text-xs mt-0.5">This will go live on the public voting page</p>
          </div>
          <button @click="showNewContest = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="activeContest" class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-semibold">
            ⚠️ "{{ activeContest.title }}" will be archived automatically.
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Contest Title *</label>
            <input v-model="newForm.title" type="text" placeholder="e.g. Harvest/Bazaar Thanksgiving 2027"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subtitle</label>
            <input v-model="newForm.subtitle" type="text" placeholder="e.g. Cast your vote for your favourite contestants"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <p v-if="newError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ newError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showNewContest = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
            <button @click="createContest" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ saving ? 'Creating...' : 'Create & Go Live' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Results Modal (read-only) -->
    <div v-if="viewingContest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        <!-- Modal Header -->
        <div class="p-6 border-b border-gray-100 flex items-start justify-between shrink-0" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="text-[10px] bg-white/20 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Final Results</span>
            </div>
            <h2 class="font-playfair text-xl font-bold text-white">{{ viewingContest.title }}</h2>
            <p class="text-gray-300 text-xs mt-0.5">{{ viewingContest.subtitle }}</p>
          </div>
          <button @click="viewingContest = null" class="text-white/60 hover:text-white text-2xl leading-none mt-1">&times;</button>
        </div>

        <!-- Modal Body -->
        <div class="overflow-y-auto flex-1 p-6">
          <div v-if="viewLoading" class="text-center py-10 text-gray-400">Loading results...</div>
          <div v-else class="space-y-6">
            <div v-for="cat in viewCategories" :key="cat.id">
              <div class="flex items-center gap-2 mb-3">
                <span class="text-lg">{{ cat.icon }}</span>
                <p class="font-playfair font-bold text-navy">{{ cat.label }}</p>
                <span class="text-xs text-gray-400 font-semibold ml-auto">{{ cat.contestants.reduce((s,c) => s + (viewVotes[c.id]??0), 0).toLocaleString() }} total votes</span>
              </div>
              <div class="space-y-2">
                <div v-for="(c, i) in cat.contestants" :key="c.id"
                  :class="['flex items-center gap-3 rounded-xl px-4 py-3 border', i === 0 ? 'border-gold/40 bg-gold/5' : 'border-gray-100 bg-gray-50']">
                  <span :class="['w-7 h-7 rounded-full text-xs font-black flex items-center justify-center shrink-0', i === 0 ? 'bg-gold text-white' : 'bg-navy/10 text-navy']">{{ i + 1 }}</span>
                  <div class="w-9 h-9 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                    <img v-if="c.photo" :src="c.photo" class="w-full h-full object-cover object-top" />
                    <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs text-navy">✝</div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-navy text-sm truncate">{{ c.name }}</p>
                    <p v-if="c.tagline" class="text-gray-400 text-xs truncate">{{ c.tagline }}</p>
                  </div>
                  <div class="text-right shrink-0">
                    <p class="font-black text-navy text-sm">{{ (viewVotes[c.id] ?? 0).toLocaleString() }}</p>
                    <p class="text-gold text-[10px] font-bold uppercase">votes</p>
                  </div>
                </div>
                <p v-if="cat.contestants.length === 0" class="text-gray-400 text-xs text-center py-3">No contestants</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-100 shrink-0">
          <button @click="viewingContest = null" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all">Close</button>
        </div>
      </div>
    </div>

    <!-- Archive Confirm Modal -->
    <div v-if="archivingContest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6">
        <p class="font-playfair font-black text-navy text-lg mb-1">End this contest?</p>
        <p class="text-gray-500 text-sm mb-6">"{{ archivingContest.title }}" will be moved to Previous Contests and the public voting page will be disabled.</p>
        <div class="flex gap-3">
          <button @click="archivingContest = null" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
          <button @click="doArchive" class="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-black text-sm transition-all">End Contest</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const router = useRouter()
const loading = ref(true)
const contests = ref<any[]>([])
const showNewContest = ref(false)
const saving = ref(false)
const newError = ref('')
const newForm = reactive({ title: '', subtitle: 'Cast your vote for your favourite contestants' })
const viewingContest = ref<any>(null)
const viewLoading = ref(false)
const viewCategories = ref<any[]>([])
const viewVotes = ref<Record<string, number>>({})
const archivingContest = ref<any>(null)

onMounted(load)

async function load() {
  loading.value = true
  const { data } = await supabase.from('contests').select('*').order('created_at', { ascending: false })
  contests.value = data ?? []
  loading.value = false
}

const activeContest = computed(() => contests.value.find(c => c.status === 'active'))
const archivedContests = computed(() => contests.value.filter(c => c.status === 'archived'))

function openNewContest() {
  newError.value = ''
  Object.assign(newForm, { title: '', subtitle: 'Cast your vote for your favourite contestants' })
  showNewContest.value = true
}

async function createContest() {
  if (!newForm.title) { newError.value = 'Title is required.'; return }
  saving.value = true
  if (activeContest.value) {
    await supabase.from('contests').update({ status: 'archived' }).eq('id', activeContest.value.id)
  }
  const { error } = await supabase.from('contests').insert({ title: newForm.title, subtitle: newForm.subtitle, status: 'active' })
  if (error) { newError.value = error.message; saving.value = false; return }
  await supabase.from('site_content').upsert([
    { key: 'contest_title', value: newForm.title },
    { key: 'contest_subtitle', value: newForm.subtitle },
    { key: 'harvest_active', value: 'true' },
  ], { onConflict: 'key' })
  saving.value = false
  showNewContest.value = false
  await load()
  router.push('/admin/contestants/manage')
}

function confirmArchive(contest: any) {
  archivingContest.value = contest
}

async function doArchive() {
  await supabase.from('contests').update({ status: 'archived' }).eq('id', archivingContest.value.id)
  await supabase.from('site_content').upsert({ key: 'harvest_active', value: 'false' }, { onConflict: 'key' })
  archivingContest.value = null
  load()
}

function goManage() {
  router.push('/admin/contestants/manage')
}

async function viewResults(contest: any) {
  viewingContest.value = contest
  viewLoading.value = true
  viewCategories.value = []
  viewVotes.value = {}
  const [{ data: cats }, { data: cs }, { data: vs }] = await Promise.all([
    supabase.from('contest_categories').select('*').order('sort_order'),
    supabase.from('contestants').select('*').order('number'),
    supabase.from('votes').select('contestant_id, qty, status').eq('status', 'approved'),
  ])
  const counts: Record<string, number> = {}
  vs?.forEach((v: any) => { counts[v.contestant_id] = (counts[v.contestant_id] ?? 0) + (v.qty || 1) })
  viewVotes.value = counts
  viewCategories.value = (cats ?? []).map((cat: any) => ({
    ...cat,
    contestants: (cs ?? [])
      .filter((c: any) => c.category === cat.id)
      .sort((a: any, b: any) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)),
  }))
  viewLoading.value = false
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>
