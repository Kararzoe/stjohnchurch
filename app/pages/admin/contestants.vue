<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Contestants</h1>
        <p class="text-gray-400 text-sm mt-1">Harvest/Bazaar Thanksgiving 2026 — all categories</p>
      </div>
      <button @click="openForm()" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + Add Contestant
      </button>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
      <button
        v-for="cat in CATEGORIES" :key="cat.id"
        @click="activeTab = cat.id"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0',
          activeTab === cat.id ? 'bg-navy text-white border-navy' : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
        ]"
      >
        {{ cat.icon }} {{ cat.label }}
        <span class="ml-1 text-xs font-black">({{ activeContestants.length }})</span>
      </button>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
      <div v-else-if="activeContestants.length === 0" class="text-center py-12 text-gray-400 text-sm">No contestants in this category yet.</div>
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
            <tr v-for="c in activeContestants" :key="c.id" class="border-b border-gray-50 hover:bg-gray-50 transition-colors">
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
                  <button @click="openForm(c)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
                  <button @click="deleteContestant(c.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400 font-semibold">{{ activeContestants.length }} contestants</p>
        <p class="text-xs font-black text-navy">Total votes: {{ activeContestants.reduce((s, c) => s + (voteCounts[c.id] ?? 0), 0).toLocaleString() }}</p>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editing ? 'Edit Contestant' : 'Add Contestant' }}</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select v-model="form.category" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold">
              <option v-for="cat in CATEGORIES" :key="cat.id" :value="cat.id">{{ cat.icon }} {{ cat.label }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Number</label>
            <input v-model.number="form.number" type="number" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
            <input v-model="form.name" type="text" placeholder="Full name" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tagline</label>
            <input v-model="form.tagline" type="text" placeholder="e.g. 📞 08012345678 · Group name" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo</label>
            <input type="file" accept="image/*" @change="handlePhoto" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10" />
            <img v-if="form.photo" :src="form.photo" class="mt-3 h-28 rounded-xl object-cover object-top" />
            <p v-if="uploading" class="text-xs text-gold mt-2">Uploading...</p>
          </div>
          <p v-if="formError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ formError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="save" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ saving ? 'Saving...' : 'Save' }}
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
const voteCounts = ref<Record<string, number>>({})
const activeTab = ref('face')
const showForm = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const uploading = ref(false)
const formError = ref('')

const CATEGORIES = [
  { id: 'face', label: 'Face of Harvest', icon: '👑' },
  { id: 'king', label: 'King of Harvest', icon: '🤴' },
  { id: 'queen', label: 'Queen of Harvest', icon: '👸' },
  { id: 'prince', label: 'Prince of Harvest', icon: '🫅' },
  { id: 'princess', label: 'Princess of Harvest', icon: '🌸' },
]

const activeContestants = computed(() =>
  contestants.value.filter(c => c.category === activeTab.value).sort((a, b) => a.number - b.number)
)

const form = reactive({ category: 'face', number: 1, name: '', tagline: '', photo: '' })

onMounted(load)

async function load() {
  loading.value = true
  const [{ data: cs }, { data: vs }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('votes').select('contestant_id'),
  ])
  contestants.value = cs ?? []
  const counts: Record<string, number> = {}
  vs?.forEach((v: any) => { counts[v.contestant_id] = (counts[v.contestant_id] ?? 0) + 1 })
  voteCounts.value = counts
  loading.value = false
}

function openForm(c?: any) {
  editing.value = c ?? null
  formError.value = ''
  if (c) {
    Object.assign(form, { category: c.category, number: c.number, name: c.name, tagline: c.tagline ?? '', photo: c.photo ?? '' })
  } else {
    Object.assign(form, { category: activeTab.value, number: (activeContestants.value.length + 1), name: '', tagline: '', photo: '' })
  }
  showForm.value = true
}

async function handlePhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `contestants/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish media').upload(path, file, { upsert: true })
  if (!error && data) {
    const { data: url } = supabase.storage.from('parish media').getPublicUrl(path)
    form.photo = url.publicUrl
  }
  uploading.value = false
}

async function save() {
  if (!form.name) { formError.value = 'Name is required.'; return }
  saving.value = true
  const payload = { category: form.category, number: form.number, name: form.name, tagline: form.tagline, photo: form.photo }
  const { error } = editing.value
    ? await supabase.from('contestants').update(payload).eq('id', editing.value.id)
    : await supabase.from('contestants').insert(payload)
  saving.value = false
  if (error) { formError.value = error.message; return }
  showForm.value = false
  load()
}

async function deleteContestant(id: string) {
  if (!confirm('Delete this contestant? This cannot be undone.')) return
  await supabase.from('contestants').delete().eq('id', id)
  load()
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
