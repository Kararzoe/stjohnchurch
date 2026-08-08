<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Communities & Groups</h1>
        <p class="text-gray-400 text-sm mt-1">Manage parish ministries and groups</p>
      </div>
      <button @click="openForm()" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + Add Group
      </button>
    </div>

    <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="m in groups" :key="m.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-start justify-between mb-3">
          <div class="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center text-2xl">{{ m.icon }}</div>
          <div class="flex gap-2">
            <button @click="openForm(m)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
            <button @click="deleteGroup(m.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
          </div>
        </div>
        <h3 class="font-playfair font-bold text-navy text-base mb-1">{{ m.name }}</h3>
        <p class="text-xs text-gold font-semibold mb-2">{{ m.years }} of service</p>
        <p class="text-gray-500 text-xs leading-relaxed">{{ m.description }}</p>
      </div>
      <div v-if="groups.length === 0" class="col-span-3 text-center py-12 text-gray-400 text-sm">No groups yet.</div>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editing ? 'Edit Group' : 'Add Group' }}</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Icon (emoji)</label>
            <input v-model="form.icon" type="text" placeholder="e.g. 👩" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name *</label>
            <input v-model="form.name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Years of Service</label>
            <input v-model="form.years" type="text" placeholder="e.g. 20+ years" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea v-model="form.desc" rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Sort Order</label>
            <input v-model.number="form.sort_order" type="number" min="1" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <p v-if="formError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ formError }}</p>
          <div class="flex gap-3 pt-2">
            <button @click="showForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="save" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
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
const groups = ref<any[]>([])
const showForm = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const formError = ref('')

const form = reactive({ icon: '', name: '', years: '20+ years', desc: '', sort_order: 1 })

onMounted(load)

async function load() {
  loading.value = true
  const { data } = await supabase.from('ministries').select('*').order('sort_order')
  groups.value = data ?? []
  loading.value = false
}

function openForm(m?: any) {
  editing.value = m ?? null
  formError.value = ''
  if (m) {
    Object.assign(form, { icon: m.icon, name: m.name, years: m.years, desc: m.description, sort_order: m.sort_order })
  } else {
    Object.assign(form, { icon: '', name: '', years: '20+ years', desc: '', sort_order: groups.value.length + 1 })
  }
  showForm.value = true
}

async function save() {
  if (!form.name) { formError.value = 'Name is required.'; return }
  saving.value = true
  const payload = { icon: form.icon, name: form.name, years: form.years, description: form.desc, sort_order: form.sort_order }
  const { error } = editing.value
    ? await supabase.from('ministries').update(payload).eq('id', editing.value.id)
    : await supabase.from('ministries').insert(payload)
  saving.value = false
  if (error) { formError.value = error.message; return }
  showForm.value = false
  load()
}

async function deleteGroup(id: string) {
  if (!confirm('Delete this group?')) return
  await supabase.from('ministries').delete().eq('id', id)
  load()
}
</script>
