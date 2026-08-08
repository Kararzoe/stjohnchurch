<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Homepage</h1>
        <p class="text-gray-400 text-sm mt-1">Edit all homepage text sections</p>
      </div>
      <button @click="saveAll" :disabled="saving" class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        {{ saving ? 'Saving...' : 'Save All Changes' }}
      </button>
    </div>

    <p v-if="saved" class="mb-4 text-green-600 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">✓ Changes saved successfully.</p>
    <p v-if="saveError" class="mb-4 text-red-500 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-3">{{ saveError }}</p>

    <div class="space-y-5">

      <!-- Hero -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 class="font-playfair font-bold text-navy text-lg">Hero Section</h2>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Scripture Quote</label>
          <input v-model="c.hero_quote" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Quote Reference</label>
          <input v-model="c.hero_quote_ref" type="text" placeholder="e.g. Matthew 11:28" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
      </div>

      <!-- Daily Scripture -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 class="font-playfair font-bold text-navy text-lg">Daily Scripture</h2>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Verse</label>
          <input v-model="c.daily_verse" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Reference</label>
          <input v-model="c.daily_verse_ref" type="text" placeholder="e.g. Philippians 4:13" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
      </div>

      <!-- About Banner -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 class="font-playfair font-bold text-navy text-lg">About Banner</h2>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea v-model="c.about_banner_text" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
        </div>
      </div>

      <!-- Prayer of the Month -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 class="font-playfair font-bold text-navy text-lg">Prayer of the Month</h2>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prayer Title</label>
          <input v-model="c.prayer_title" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Prayer Text</label>
          <textarea v-model="c.prayer_text" rows="4" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
        </div>
      </div>

      <!-- Donate CTA -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
        <h2 class="font-playfair font-bold text-navy text-lg">Donate Section</h2>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Heading</label>
          <input v-model="c.donate_heading" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description</label>
          <textarea v-model="c.donate_text" rows="3" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold resize-none" />
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

const c = reactive({
  hero_quote: '"Come to me, all you who are weary and burdened, and I will give you rest."',
  hero_quote_ref: 'Matthew 11:28',
  daily_verse: '"I can do all things through Christ who strengthens me."',
  daily_verse_ref: 'Philippians 4:13',
  about_banner_text: 'St. John of the Cross Catholic Church, Mararaba has been a spiritual home for families in Nasarawa State. We celebrate the sacraments, grow in discipleship, and reach out to those in need.',
  prayer_title: 'Act of Contrition',
  prayer_text: '"O my God, I am heartily sorry for having offended Thee, and I detest all my sins because of Thy just punishments, but most of all because they offend Thee, my God, who art all good and deserving of all my love..."',
  donate_heading: 'Support Our Parish',
  donate_text: 'Your generosity helps us maintain our church, support our ministries, and serve those in need in our community.',
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
