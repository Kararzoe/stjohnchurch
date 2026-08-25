<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">{{ contestTitle || 'Contestants' }}</h1>
        <p class="text-gray-400 text-sm mt-1">{{ contestSubtitle || 'Manage contest title, categories and contestants' }}</p>
      </div>
      <button @click="openContestantForm()" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + Add Contestant
      </button>
    </div>

    <!-- Contest Title -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-playfair font-bold text-navy">Contest Title & Subtitle</h2>
        <button @click="saveTitle" :disabled="savingTitle" class="px-4 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          {{ savingTitle ? 'Saving...' : 'Save' }}
        </button>
      </div>
      <div class="space-y-3">
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
          <input v-model="contestTitle" type="text" placeholder="e.g. Harvest/Bazaar Thanksgiving 2026" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subtitle</label>
          <input v-model="contestSubtitle" type="text" placeholder="e.g. Cast your vote for your favourite contestants" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
      </div>
      <p v-if="titleSaved" class="text-green-600 text-xs mt-2">✓ Saved</p>
    </div>

    <!-- Categories -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-playfair font-bold text-navy">Categories</h2>
        <button @click="openCatForm()" class="px-4 py-2 rounded-xl text-white text-xs font-bold" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">+ Add Category</button>
      </div>
      <div class="flex flex-wrap gap-2">
        <div v-for="cat in categories" :key="cat.id" class="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
          <span>{{ cat.icon }}</span>
          <span class="text-sm font-semibold text-navy">{{ cat.label }}</span>
          <button @click="openCatForm(cat)" class="text-xs text-gold hover:text-navy font-bold ml-1">Edit</button>
          <button @click="deleteCat(cat.id)" class="text-xs text-red-400 hover:text-red-600 font-bold">Delete</button>
        </div>
        <p v-if="categories.length === 0" class="text-gray-400 text-sm">No categories yet. Add one above.</p>
      </div>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
      <button
        v-for="cat in categories" :key="cat.id"
        @click="activeTab = cat.id"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0 flex items-center gap-2',
          activeTab === cat.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
        ]"
      >
        <span>{{ cat.icon }} {{ cat.label }}</span>
        <span class="text-xs font-black opacity-80">({{ contestantsByCategory(cat.id).length }} · {{ (categoryTotals[cat.id] ?? 0).toLocaleString() }} votes)</span>
      </button>
    </div>

    <!-- Contestants table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
      <div v-else-if="categories.length === 0" class="text-center py-12 text-gray-400 text-sm">Add a category first.</div>
      <div v-else-if="contestantsByCategory(activeTab).length === 0" class="text-center py-12 text-gray-400 text-sm">No contestants in this category yet.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-gray-100 bg-gray-50">
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">#</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Photo</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Name</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Tagline</th>
              <th class="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Votes</th>
              <th class="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in contestantsByCategory(activeTab)" :key="c.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <td class="px-5 py-3">
                <span class="w-7 h-7 rounded-full bg-navy/10 text-navy text-xs font-black flex items-center justify-center">{{ c.number }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                  <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
                  <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-lg">👤</div>
                </div>
              </td>
              <td class="px-5 py-3"><p class="font-semibold text-navy text-sm">{{ c.name }}</p></td>
              <td class="px-5 py-3 hidden md:table-cell"><p class="text-gray-400 text-xs">{{ c.tagline }}</p></td>
              <td class="px-5 py-3 text-right">
                <span class="font-black text-navy text-sm">{{ voteCounts[c.id] ?? 0 }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-3 justify-end">
                  <button @click="openContestantForm(c)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
                  <button @click="deleteContestant(c.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400 font-semibold">{{ contestantsByCategory(activeTab).length }} contestants</p>
        <p class="text-xs font-black text-navy">Total votes: {{ contestantsByCategory(activeTab).reduce((s, c) => s + (voteCounts[c.id] ?? 0), 0).toLocaleString() }}</p>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCatForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editingCat ? 'Edit Category' : 'Add Category' }}</h2>
          <button @click="showCatForm = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
            <input v-model="catForm.icon" type="text" placeholder="e.g. 👑" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Label *</label>
            <input v-model="catForm.label" type="text" placeholder="e.g. Face of Harvest" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">ID (no spaces) *</label>
            <input v-model="catForm.id" type="text" placeholder="e.g. face" :disabled="!!editingCat" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold disabled:bg-gray-50 disabled:text-gray-400" />
          </div>
          <p v-if="catError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ catError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showCatForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
            <button @click="saveCat" :disabled="savingCat" class="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ savingCat ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Contestant Modal -->
    <div v-if="showContestantForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editingContestant ? 'Edit Contestant' : 'Add Contestant' }}</h2>
          <button @click="showContestantForm = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select v-model="cForm.category" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Number</label>
            <input v-model.number="cForm.number" type="number" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
            <input v-model="cForm.name" type="text" placeholder="Full name" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tagline</label>
            <input v-model="cForm.tagline" type="text" placeholder="e.g. 📞 08012345678 · Group name" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo</label>
            <input type="file" accept="image/*" @change="handlePhoto" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10" />
            <img v-if="cForm.photo" :src="cForm.photo" class="mt-3 h-28 rounded-xl object-cover object-top" />
            <p v-if="uploading" class="text-xs text-gold mt-2">Uploading...</p>
          </div>
          <p v-if="cFormError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ cFormError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showContestantForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm">Cancel</button>
            <button @click="saveContestant" :disabled="savingContestant" class="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ savingContestant ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const contestants = ref<any[]>([])
const categories = ref<any[]>([])
const voteCounts = ref<Record<string, number>>({})
const categoryTotals = ref<Record<string, number>>({})
const activeTab = ref('')

// Title
const contestTitle = ref('Harvest/Bazaar Thanksgiving 2026')
const contestSubtitle = ref('Cast your vote for your favourite contestants')
const savingTitle = ref(false)
const titleSaved = ref(false)

// Category form
const showCatForm = ref(false)
const editingCat = ref<any>(null)
const savingCat = ref(false)
const catError = ref('')
const catForm = reactive({ id: '', icon: '', label: '' })

// Contestant form
const showContestantForm = ref(false)
const editingContestant = ref<any>(null)
const savingContestant = ref(false)
const uploading = ref(false)
const cFormError = ref('')
const cForm = reactive({ category: '', number: 1, name: '', tagline: '', photo: '' })

onMounted(load)

async function load() {
  loading.value = true
  const [{ data: cs }, { data: vs }, { data: cats }, { data: titleData }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('votes').select('contestant_id, category, qty, status'),
    supabase.from('contest_categories').select('*').order('sort_order'),
    supabase.from('site_content').select('key,value').in('key', ['contest_title', 'contest_subtitle']),
  ])
  contestants.value = cs ?? []
  categories.value = cats ?? []
  if (categories.value.length > 0 && !activeTab.value) activeTab.value = categories.value[0].id

  const counts: Record<string, number> = {}
  const catCounts: Record<string, number> = {}

  vs?.forEach((v: any) => {
    if (v.status === 'approved') {
      const q = v.qty || 1
      if (v.contestant_id) counts[v.contestant_id] = (counts[v.contestant_id] ?? 0) + q
      if (v.category) catCounts[v.category] = (catCounts[v.category] ?? 0) + q
    }
  })

  voteCounts.value = counts
  categoryTotals.value = catCounts

  if (titleData) {
    titleData.forEach((r: any) => {
      if (r.key === 'contest_title') contestTitle.value = r.value
      if (r.key === 'contest_subtitle') contestSubtitle.value = r.value
    })
  }
  loading.value = false
}

function contestantsByCategory(catId: string) {
  return contestants.value.filter(c => c.category === catId).sort((a, b) => a.number - b.number)
}

async function saveTitle() {
  savingTitle.value = true
  await supabase.from('site_content').upsert([
    { key: 'contest_title', value: contestTitle.value },
    { key: 'contest_subtitle', value: contestSubtitle.value },
  ], { onConflict: 'key' })
  savingTitle.value = false
  titleSaved.value = true
  setTimeout(() => { titleSaved.value = false }, 3000)
}

// Category CRUD
function openCatForm(cat?: any) {
  editingCat.value = cat ?? null
  catError.value = ''
  if (cat) Object.assign(catForm, { id: cat.id, icon: cat.icon, label: cat.label })
  else Object.assign(catForm, { id: '', icon: '', label: '' })
  showCatForm.value = true
}

async function saveCat() {
  if (!catForm.label) { catError.value = 'Label is required.'; return }
  if (!editingCat.value && !catForm.id) { catError.value = 'ID is required.'; return }
  savingCat.value = true
  const payload = { icon: catForm.icon, label: catForm.label, sort_order: categories.value.length + 1 }
  const { error } = editingCat.value
    ? await supabase.from('contest_categories').update({ icon: catForm.icon, label: catForm.label }).eq('id', editingCat.value.id)
    : await supabase.from('contest_categories').insert({ ...payload, id: catForm.id })
  savingCat.value = false
  if (error) { catError.value = error.message; return }
  showCatForm.value = false
  load()
}

async function deleteCat(id: string) {
  if (!confirm('Delete this category? All contestants in it will also be deleted.')) return
  await supabase.from('contestants').delete().eq('category', id)
  await supabase.from('contest_categories').delete().eq('id', id)
  load()
}

// Contestant CRUD
function openContestantForm(c?: any) {
  editingContestant.value = c ?? null
  cFormError.value = ''
  if (c) {
    Object.assign(cForm, { category: c.category, number: c.number, name: c.name, tagline: c.tagline ?? '', photo: c.photo ?? '' })
  } else {
    Object.assign(cForm, { category: activeTab.value, number: contestantsByCategory(activeTab.value).length + 1, name: '', tagline: '', photo: '' })
  }
  showContestantForm.value = true
}

async function handlePhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `contestants/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish-media').upload(path, file, { upsert: true })
  if (!error && data) {
    const { data: url } = supabase.storage.from('parish-media').getPublicUrl(path)
    cForm.photo = url.publicUrl
  }
  uploading.value = false
}

async function saveContestant() {
  if (!cForm.name) { cFormError.value = 'Name is required.'; return }
  savingContestant.value = true
  const payload = { category: cForm.category, number: cForm.number, name: cForm.name, tagline: cForm.tagline, photo: cForm.photo }
  const { error } = editingContestant.value
    ? await supabase.from('contestants').update(payload).eq('id', editingContestant.value.id)
    : await supabase.from('contestants').insert(payload)
  savingContestant.value = false
  if (error) { cFormError.value = error.message; return }
  showContestantForm.value = false
  load()
}

async function deleteContestant(id: string) {
  if (!confirm('Delete this contestant?')) return
  await supabase.from('contestants').delete().eq('id', id)
  load()
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
