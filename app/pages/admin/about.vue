<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">About Page</h1>
        <p class="text-gray-400 text-sm mt-1">Edit church info, mission, history and clergy</p>
      </div>
      <button @click="saveAll" :disabled="saving" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        {{ saving ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>

    <p v-if="saved" class="mb-4 text-green-600 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">✓ Changes saved successfully.</p>
    <p v-if="saveError" class="mb-4 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{{ saveError }}</p>

    <div class="space-y-6">

      <!-- Stats -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="font-playfair font-bold text-navy text-lg mb-4">Stats</h2>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="(s, i) in content.stats" :key="i" class="space-y-2">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Value</label>
              <input v-model="s.value" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Label</label>
              <input v-model="s.label" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
          </div>
        </div>
      </div>

      <!-- Mission -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="font-playfair font-bold text-navy text-lg mb-4">Mission Statement</h2>
        <textarea v-model="content.mission" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
      </div>

      <!-- History -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-playfair font-bold text-navy text-lg">History Timeline</h2>
          <button @click="addHistory" class="text-xs text-gold hover:text-navy font-bold transition-colors">+ Add Entry</button>
        </div>
        <div class="space-y-4">
          <div v-for="(h, i) in content.history" :key="i" class="border border-gray-100 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black text-navy bg-navy/10 w-6 h-6 rounded-full flex items-center justify-center">{{ i + 1 }}</span>
              <button @click="content.history.splice(i, 1)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Remove</button>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
              <input v-model="h.title" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Text</label>
              <textarea v-model="h.text" rows="3" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Clergy -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="font-playfair font-bold text-navy text-lg">Clergy</h2>
          <button @click="openClergy()" class="text-xs px-4 py-2 rounded-xl text-white font-bold" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">+ Add</button>
        </div>
        <div v-if="clergyLoading" class="text-center py-8 text-gray-400 text-sm">Loading...</div>
        <div v-else class="space-y-3">
          <div v-for="c in clergy" :key="c.id" class="flex items-center gap-4 border border-gray-100 rounded-xl p-3">
            <div class="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
              <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
              <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-lg">✝</div>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-semibold text-navy text-sm truncate">{{ c.name }}</p>
              <p class="text-xs text-gold">{{ c.role }}</p>
              <p class="text-xs text-gray-400">Sort order: {{ c.sort_order }}</p>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <button @click="openClergy(c)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
              <button @click="deleteClergy(c.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
            </div>
          </div>
          <p v-if="clergy.length === 0" class="text-center py-6 text-gray-400 text-sm">No clergy added yet.</p>
        </div>
      </div>

    </div>

    <!-- Clergy Modal -->
    <div v-if="showClergyForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editingClergy ? 'Edit Clergy' : 'Add Clergy' }}</h2>
          <button @click="showClergyForm = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
            <input v-model="clergyForm.name" type="text" placeholder="Rev. Fr. Full Name, OSA" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role</label>
            <input v-model="clergyForm.role" type="text" placeholder="e.g. Parish Priest" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea v-model="clergyForm.bio" rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order <span class="text-gray-400 font-normal normal-case">(1 = Pastor shown first)</span></label>
            <input v-model.number="clergyForm.sort_order" type="number" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo</label>
            <input type="file" accept="image/*" @change="handleClergyPhoto" class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10" />
            <img v-if="clergyForm.photo" :src="clergyForm.photo" class="mt-3 h-28 rounded-xl object-cover object-top" />
            <p v-if="uploading" class="text-xs text-gold mt-2">Uploading...</p>
          </div>
          <p v-if="clergyError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ clergyError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showClergyForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="saveClergy" :disabled="clergySaving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ clergySaving ? 'Saving...' : 'Save' }}
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
const saving = ref(false)
const saved = ref(false)
const saveError = ref('')
const clergyLoading = ref(true)
const clergy = ref<any[]>([])
const showClergyForm = ref(false)
const editingClergy = ref<any>(null)
const uploading = ref(false)
const clergyError = ref('')
const clergySaving = ref(false)

const clergyForm = reactive({ name: '', role: '', bio: '', photo: '', sort_order: 1 })

const DEFAULT_CONTENT = {
  stats: [
    { value: '1988', label: 'Year Founded' },
    { value: '2,400+', label: 'Registered Families' },
    { value: '37+', label: 'Years of Faith' },
  ],
  mission: 'To know Christ, to make Christ known, and to serve all people in His name — through worship, community, and compassionate outreach.',
  history: [
    { title: '12th May, 1988 — The Beginning', text: 'What is now known as St. John of the Cross Catholic Church Mararaba was founded on the 12th May, 1988 on the feast of Ascension. Before this time, the popular mango tree where the Church started was a Block Rosary Centre.' },
    { title: 'Catechist John Awori', text: 'On the 12th of May 1988, Catechist John Awori mobilised people for a Church Service numbering about seven (7) — that marked the beginning of St. John Catholic Church Mararaba.' },
    { title: 'First Priests', text: 'Rev. Fr. Donald Fennessy started coming from St. Peter\'s Keffi to say Masses in Mararaba. Father Donald Fennessy and Father Oliver Akaatenger were the first priests coming from Keffi at the time.' },
    { title: 'January 1997 — The Augustinians Arrive', text: 'The Church grew very quickly and in less than ten years it was considered an independent Mission and handed over to the Augustinians by Bishop A. A. Usuh of Makurdi Diocese in January 1997.' },
  ],
}

const content = reactive(JSON.parse(JSON.stringify(DEFAULT_CONTENT)))

onMounted(async () => {
  const { data } = await supabase.from('site_content').select('key, value').in('key', ['about_stats', 'about_mission', 'about_history'])
  if (data) {
    for (const row of data) {
      try {
        if (row.key === 'about_stats') content.stats = JSON.parse(row.value)
        if (row.key === 'about_mission') content.mission = row.value
        if (row.key === 'about_history') content.history = JSON.parse(row.value)
      } catch {}
    }
  }
  loadClergy()
})

async function loadClergy() {
  clergyLoading.value = true
  const { data } = await supabase.from('clergy').select('*').order('sort_order')
  clergy.value = data ?? []
  clergyLoading.value = false
}

async function saveAll() {
  saving.value = true
  saveError.value = ''
  saved.value = false
  const rows = [
    { key: 'about_stats', value: JSON.stringify(content.stats) },
    { key: 'about_mission', value: content.mission },
    { key: 'about_history', value: JSON.stringify(content.history) },
  ]
  const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
  saving.value = false
  if (error) { saveError.value = error.message; return }
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}

function addHistory() {
  content.history.push({ title: '', text: '' })
}

function openClergy(c?: any) {
  editingClergy.value = c ?? null
  clergyError.value = ''
  if (c) {
    Object.assign(clergyForm, { name: c.name, role: c.role ?? '', bio: c.bio ?? '', photo: c.photo ?? '', sort_order: c.sort_order ?? 1 })
  } else {
    Object.assign(clergyForm, { name: '', role: '', bio: '', photo: '', sort_order: clergy.value.length + 1 })
  }
  showClergyForm.value = true
}

async function handleClergyPhoto(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `clergy/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish media').upload(path, file, { upsert: true })
  if (!error && data) {
    const { data: url } = supabase.storage.from('parish media').getPublicUrl(path)
    clergyForm.photo = url.publicUrl
  }
  uploading.value = false
}

async function saveClergy() {
  if (!clergyForm.name) { clergyError.value = 'Name is required.'; return }
  clergySaving.value = true
  const payload = { name: clergyForm.name, role: clergyForm.role, bio: clergyForm.bio, photo: clergyForm.photo, sort_order: clergyForm.sort_order }
  const { error } = editingClergy.value
    ? await supabase.from('clergy').update(payload).eq('id', editingClergy.value.id)
    : await supabase.from('clergy').insert(payload)
  clergySaving.value = false
  if (error) { clergyError.value = error.message; return }
  showClergyForm.value = false
  loadClergy()
}

async function deleteClergy(id: string) {
  if (!confirm('Delete this clergy member?')) return
  await supabase.from('clergy').delete().eq('id', id)
  loadClergy()
}
</script>
