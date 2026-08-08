<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Contact Info</h1>
        <p class="text-gray-400 text-sm mt-1">Edit church contact details shown on the site and footer</p>
      </div>
      <button @click="saveAll" :disabled="saving" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <p v-if="saved" class="mb-4 text-green-600 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">✓ Saved successfully.</p>
    <p v-if="saveError" class="mb-4 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{{ saveError }}</p>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
        <textarea v-model="c.contact_address" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
        <input v-model="c.contact_phone" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
        <input v-model="c.contact_email" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Office Hours</label>
        <textarea v-model="c.contact_hours" rows="2" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Facebook URL</label>
        <input v-model="c.social_facebook" type="text" placeholder="https://facebook.com/..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Instagram URL</label>
        <input v-model="c.social_instagram" type="text" placeholder="https://instagram.com/..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">YouTube URL</label>
        <input v-model="c.social_youtube" type="text" placeholder="https://youtube.com/..." class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
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

const c = reactive({
  contact_address: 'St. John of the Cross Catholic Church,\nBehind Nasarawa State High Court, Mararaba',
  contact_phone: '08142053461',
  contact_email: 'stjohncatholicchurchmararaba@gmail.com',
  contact_hours: 'Mon–Fri: 9 AM – 5 PM\nSat: 9 AM – 1 PM',
  social_facebook: '#',
  social_instagram: '#',
  social_youtube: '#',
})

const KEYS = Object.keys(c) as (keyof typeof c)[]

onMounted(async () => {
  const { data } = await supabase.from('site_content').select('key, value').in('key', KEYS)
  if (data) {
    for (const row of data) {
      if (row.key in c) (c as any)[row.key] = row.value
    }
  }
})

async function saveAll() {
  saving.value = true
  saveError.value = ''
  saved.value = false
  const rows = KEYS.map(k => ({ key: k, value: c[k] }))
  const { error } = await supabase.from('site_content').upsert(rows, { onConflict: 'key' })
  saving.value = false
  if (error) { saveError.value = error.message; return }
  saved.value = true
  setTimeout(() => { saved.value = false }, 3000)
}
</script>
