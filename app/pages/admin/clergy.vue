<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Clergy</h1>
        <p class="text-gray-400 text-sm mt-1">Manage parish priests and staff</p>
      </div>
      <button @click="openForm()"
        class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all"
        style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + Add Clergy
      </button>
    </div>

    <p v-if="saved" class="mb-4 text-green-600 text-sm font-semibold bg-green-50 rounded-xl px-4 py-3 border border-green-100">✓ Saved successfully</p>

    <div v-if="loading" class="text-center py-20 text-gray-400 text-sm">Loading...</div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="p in clergy" :key="p.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="relative h-48 overflow-hidden">
          <img v-if="p.photo" :src="p.photo" :alt="p.name" class="w-full h-full object-cover object-top" />
          <div v-else class="w-full h-full flex items-center justify-center text-5xl" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">✝</div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div class="absolute bottom-0 left-0 right-0 p-3">
            <p class="text-gold text-[10px] uppercase tracking-widest font-bold">{{ p.role }}</p>
            <p class="font-playfair font-black text-white text-sm leading-tight">{{ p.name }}</p>
          </div>
        </div>
        <div class="p-4 flex items-center justify-between">
          <p class="text-xs text-gray-400 truncate flex-1">{{ p.bio?.slice(0, 60) }}{{ p.bio?.length > 60 ? '...' : '' }}</p>
          <div class="flex gap-2 shrink-0 ml-2">
            <button @click="openForm(p)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
            <button @click="deletePriest(p.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editing ? 'Edit Clergy' : 'Add Clergy' }}</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-navy text-xl transition-colors">✕</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
            <input v-model="form.name" type="text" placeholder="e.g. Rev. Fr. John Doe OSA"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Role / Title</label>
            <input v-model="form.role" type="text" placeholder="e.g. Parish Priest, Associate Priest"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo URL</label>
            <input v-model="form.photo" type="text" placeholder="/priest-1.jpg or full URL"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            <div class="mt-2">
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Or Upload Photo</label>
              <input type="file" accept="image/*" @change="handleUpload"
                class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10" />
              <p v-if="uploading" class="text-xs text-gold mt-1">Uploading...</p>
            </div>
            <img v-if="form.photo" :src="form.photo" class="mt-3 h-24 rounded-xl object-cover object-top" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bio</label>
            <textarea v-model="form.bio" rows="4" placeholder="Short biography..."
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input v-model.number="form.sort_order" type="number" placeholder="1 = first"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="showForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="savePriest" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
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
const saving = ref(false)
const uploading = ref(false)
const saved = ref(false)
const showForm = ref(false)
const editing = ref<any>(null)
const clergy = ref<any[]>([])

const form = reactive({ name: '', role: '', photo: '', bio: '', sort_order: 1 })

onMounted(load)

async function load() {
  loading.value = true
  const { data } = await supabase.from('clergy').select('*').order('sort_order')
  clergy.value = data ?? []
  loading.value = false
}

function openForm(p?: any) {
  editing.value = p ?? null
  if (p) Object.assign(form, { name: p.name, role: p.role, photo: p.photo ?? '', bio: p.bio ?? '', sort_order: p.sort_order ?? 1 })
  else Object.assign(form, { name: '', role: '', photo: '', bio: '', sort_order: clergy.value.length + 1 })
  showForm.value = true
}

async function handleUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `clergy/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish media').upload(path, file, { upsert: true })
  if (!error && data) {
    const { data: url } = supabase.storage.from('parish media').getPublicUrl(path)
    form.photo = url.publicUrl
  }
  uploading.value = false
}

async function savePriest() {
  if (!form.name) return
  saving.value = true
  if (editing.value) {
    await supabase.from('clergy').update({ ...form }).eq('id', editing.value.id)
  } else {
    await supabase.from('clergy').insert({ ...form })
  }
  saving.value = false
  showForm.value = false
  saved.value = true
  setTimeout(() => saved.value = false, 3000)
  load()
}

async function deletePriest(id: string) {
  if (!confirm('Delete this clergy member?')) return
  await supabase.from('clergy').delete().eq('id', id)
  load()
}
</script>
