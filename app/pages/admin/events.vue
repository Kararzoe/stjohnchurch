<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Events</h1>
        <p class="text-gray-400 text-sm mt-1">Manage parish events</p>
      </div>
      <button @click="openForm()" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        + New Event
      </button>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
      <div v-else-if="events.length === 0" class="text-center py-12 text-gray-400 text-sm">No events yet.</div>
      <table v-else class="w-full text-sm">
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Event</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ev in events" :key="ev.id" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-4">
              <div class="flex items-center gap-3">
                <img v-if="ev.image_url" :src="ev.image_url" class="w-10 h-10 rounded-lg object-cover shrink-0" />
                <div v-else class="w-10 h-10 rounded-lg bg-navy/5 flex items-center justify-center shrink-0 text-lg">📅</div>
                <p class="font-semibold text-navy truncate max-w-xs">{{ ev.title }}</p>
              </div>
            </td>
            <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ ev.event_date }}</td>
            <td class="px-5 py-4">
              <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', ev.published ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500']">
                {{ ev.published ? 'Published' : 'Draft' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2 justify-end">
                <button @click="openForm(ev)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
                <button @click="deleteEvent(ev.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showForm" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">{{ editing ? 'Edit Event' : 'New Event' }}</h2>
          <button @click="showForm = false" class="text-gray-400 hover:text-navy text-xl">✕</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title</label>
            <input v-model="form.title" type="text" placeholder="Event title"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <input v-model="form.event_date" type="date"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Time</label>
              <input v-model="form.event_time" type="text" placeholder="e.g. 10:00 AM"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea v-model="form.description" rows="4" placeholder="Event description..."
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cover Image</label>
            <input type="file" accept="image/*" @change="handleImageUpload"
              class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-navy/5 file:text-navy hover:file:bg-navy/10" />
            <img v-if="form.image_url" :src="form.image_url" class="mt-3 h-28 rounded-xl object-cover" />
            <p v-if="uploading" class="text-xs text-gold mt-2">Uploading...</p>
          </div>
          <div class="flex items-center gap-3">
            <input v-model="form.published" type="checkbox" id="pub" class="w-4 h-4 accent-gold" />
            <label for="pub" class="text-sm font-semibold text-navy">Publish immediately</label>
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="showForm = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="saveEvent" :disabled="saving" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              {{ saving ? 'Saving...' : 'Save Event' }}
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
const events = ref<any[]>([])
const showForm = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const uploading = ref(false)

const form = reactive({ title: '', description: '', event_date: '', event_time: '', image_url: '', published: false })

onMounted(loadEvents)

async function loadEvents() {
  loading.value = true
  const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true })
  events.value = data ?? []
  loading.value = false
}

function openForm(ev?: any) {
  editing.value = ev ?? null
  if (ev) Object.assign(form, { title: ev.title, description: ev.description ?? '', event_date: ev.event_date ?? '', event_time: ev.event_time ?? '', image_url: ev.image_url ?? '', published: ev.published })
  else Object.assign(form, { title: '', description: '', event_date: '', event_time: '', image_url: '', published: false })
  showForm.value = true
}

async function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return
  uploading.value = true
  const path = `events/${Date.now()}.${file.name.split('.').pop()}`
  const { data, error } = await supabase.storage.from('parish-media').upload(path, file, { upsert: true })
  if (!error && data) {
    const { data: url } = supabase.storage.from('parish-media').getPublicUrl(path)
    form.image_url = url.publicUrl
  }
  uploading.value = false
}

async function saveEvent() {
  if (!form.title) return
  saving.value = true
  if (editing.value) await supabase.from('events').update({ ...form }).eq('id', editing.value.id)
  else await supabase.from('events').insert({ ...form })
  saving.value = false
  showForm.value = false
  loadEvents()
}

async function deleteEvent(id: string) {
  if (!confirm('Delete this event?')) return
  await supabase.from('events').delete().eq('id', id)
  loadEvents()
}
</script>
