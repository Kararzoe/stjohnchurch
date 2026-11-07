<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Contests</h1>
        <p class="text-gray-400 text-sm mt-1">Manage voting contests for the parish</p>
      </div>
      <button @click="openNewContest" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + New Contest
      </button>
    </div>

    <div v-if="loading" class="text-center py-20 text-gray-400">Loading...</div>

    <div v-else>
      <!-- Active Contest -->
      <div v-if="activeContest" class="mb-8">
        <div class="flex items-center gap-2 mb-3">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p class="text-xs font-black text-green-600 uppercase tracking-widest">Active Contest</p>
        </div>
        <div class="bg-white rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
          <div class="p-5 flex items-center justify-between">
            <div>
              <p class="font-playfair font-bold text-navy text-lg">{{ activeContest.title }}</p>
              <p class="text-gray-400 text-sm mt-0.5">{{ activeContest.subtitle }}</p>
              <p class="text-xs text-gray-300 mt-1">Created {{ formatDate(activeContest.created_at) }}</p>
            </div>
            <div class="flex gap-2">
              <button @click="goToContest(activeContest)" class="px-4 py-2 rounded-xl text-white text-xs font-bold" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">Manage →</button>
              <button @click="archiveContest(activeContest)" class="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-xs font-bold hover:border-navy hover:text-navy transition-all">Archive</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="mb-8 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-center gap-4">
        <span class="text-2xl">🏆</span>
        <div>
          <p class="font-bold text-amber-800 text-sm">No active contest</p>
          <p class="text-amber-600 text-xs mt-0.5">Create a new contest to start accepting votes on the public site.</p>
        </div>
      </div>

      <!-- Previous Contests -->
      <div>
        <p class="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Previous Contests</p>
        <div v-if="archivedContests.length === 0" class="bg-white rounded-2xl border border-gray-100 p-8 text-center text-gray-400 text-sm">
          No previous contests yet
        </div>
        <div v-else class="space-y-3">
          <div v-for="contest in archivedContests" :key="contest.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between">
            <div>
              <div class="flex items-center gap-2">
                <span class="text-xs bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full">Archived</span>
                <p class="font-playfair font-bold text-navy">{{ contest.title }}</p>
              </div>
              <p class="text-gray-400 text-xs mt-1">{{ contest.subtitle }}</p>
              <p class="text-xs text-gray-300 mt-0.5">{{ formatDate(contest.created_at) }}</p>
            </div>
            <button @click="goToContest(contest)" class="px-4 py-2 rounded-xl border-2 border-gray-200 text-gray-500 text-xs font-bold hover:border-navy hover:text-navy transition-all shrink-0">
              View Results →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- New Contest Modal -->
    <div v-if="showNewContest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">New Contest</h2>
          <button @click="showNewContest = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div v-if="activeContest" class="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700 font-semibold">
            ⚠️ Creating a new contest will archive "{{ activeContest.title }}" automatically.
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

    <!-- View Contest Modal (archived - read only) -->
    <div v-if="viewingContest" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="font-playfair text-xl font-bold text-navy">{{ viewingContest.title }}</h2>
            <p class="text-gray-400 text-xs mt-0.5">{{ viewingContest.subtitle }}</p>
          </div>
          <button @click="viewingContest = null" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6">
          <div v-if="viewLoading" class="text-center py-10 text-gray-400">Loading results...</div>
          <div v-else>
            <div v-for="cat in viewCategories" :key="cat.id" class="mb-6">
              <p class="font-playfair font-bold text-navy mb-3">{{ cat.icon }} {{ cat.label }}</p>
              <div class="space-y-2">
                <div v-for="(c, i) in cat.contestants" :key="c.id" class="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span class="w-6 h-6 rounded-full bg-navy text-white text-xs font-black flex items-center justify-center shrink-0">{{ i + 1 }}</span>
                  <div class="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                    <img v-if="c.photo" :src="c.photo" class="w-full h-full object-cover object-top" />
                    <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-xs">✝</div>
                  </div>
                  <p class="flex-1 font-semibold text-navy text-sm">{{ c.name }}</p>
                  <span class="font-black text-navy text-sm">{{ (viewVotes[c.id] ?? 0).toLocaleString() }} <span class="text-gold text-xs">votes</span></span>
                </div>
              </div>
            </div>
          </div>
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

  // Archive current active contest if any
  if (activeContest.value) {
    await supabase.from('contests').update({ status: 'archived' }).eq('id', activeContest.value.id)
  }

  // Create new active contest
  const { error } = await supabase.from('contests').insert({
    title: newForm.title,
    subtitle: newForm.subtitle,
    status: 'active',
  })

  saving.value = false
  if (error) { newError.value = error.message; return }

  // Save title/subtitle to site_content so the public page picks it up
  await supabase.from('site_content').upsert([
    { key: 'contest_title', value: newForm.title },
    { key: 'contest_subtitle', value: newForm.subtitle },
    { key: 'harvest_active', value: 'true' },
  ], { onConflict: 'key' })

  showNewContest.value = false
  await load()
  // Navigate to contestants management
  router.push('/admin/contestants/manage')
}

async function archiveContest(contest: any) {
  if (!confirm(`Archive "${contest.title}"? It will no longer be editable.`)) return
  await supabase.from('contests').update({ status: 'archived' }).eq('id', contest.id)
  await supabase.from('site_content').upsert({ key: 'harvest_active', value: 'false' }, { onConflict: 'key' })
  load()
}

async function goToContest(contest: any) {
  if (contest.status === 'active') {
    router.push('/admin/contestants/manage')
    return
  }
  // View archived contest results
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
