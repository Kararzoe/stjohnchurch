<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Mass Times</h1>
        <p class="text-gray-400 text-sm mt-1">Edit mass schedule displayed on the website</p>
      </div>
      <button @click="save" :disabled="saving"
        class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-60"
        style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
        {{ saving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <p v-if="saved" class="mb-4 text-green-600 text-sm font-semibold bg-green-50 rounded-xl px-4 py-3 border border-green-100">✓ Mass times saved successfully</p>
    <p v-if="error" class="mb-4 text-red-500 text-sm bg-red-50 rounded-xl px-4 py-3 border border-red-100">{{ error }}</p>

    <div class="space-y-6">
      <div v-for="(day, di) in schedule" :key="di" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <h2 class="font-playfair font-bold text-white">{{ day.day }}</h2>
          <button @click="addTime(di)" class="text-gold text-sm font-bold hover:text-white transition-colors">+ Add Time</button>
        </div>
        <div class="p-4 space-y-3">
          <div v-for="(mass, mi) in day.masses" :key="mi" class="flex items-center gap-3">
            <input v-model="mass.time" type="text" placeholder="e.g. 7:00 AM"
              class="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            <input v-model="mass.note" type="text" placeholder="Note (optional, e.g. Hausa Mass)"
              class="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            <button @click="removeTime(di, mi)" class="text-red-400 hover:text-red-600 font-bold text-lg transition-colors shrink-0">×</button>
          </div>
          <p v-if="day.masses.length === 0" class="text-gray-400 text-sm text-center py-2">No masses — click + Add Time</p>
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
const error = ref('')

const schedule = ref([
  {
    day: 'Sunday',
    masses: [
      { time: '5:30 AM', note: '' },
      { time: '7:30 AM', note: '' },
      { time: '9:30 AM', note: 'Hausa Mass' },
      { time: '9:30 AM', note: "Children's Mass" },
      { time: '11:00 AM', note: '' },
      { time: '5:15 PM', note: 'Benediction' },
      { time: '6:00 PM', note: '' },
    ],
  },
  {
    day: 'Monday',
    masses: [{ time: '6:30 AM', note: '' }],
  },
  {
    day: 'Tuesday',
    masses: [{ time: '6:30 AM', note: '' }],
  },
  {
    day: 'Wednesday',
    masses: [{ time: '6:30 AM', note: '' }],
  },
  {
    day: 'Thursday',
    masses: [{ time: '6:30 AM', note: '' }],
  },
  {
    day: 'Friday',
    masses: [{ time: '6:30 AM', note: '' }],
  },
  {
    day: 'Saturday',
    masses: [{ time: '7:00 AM', note: '' }],
  },
])

onMounted(async () => {
  const { data } = await supabase.from('mass_times').select('*').order('id')
  if (data && data.length > 0) {
    // Group by day
    const grouped: Record<string, any[]> = {}
    data.forEach((row: any) => {
      if (!grouped[row.day]) grouped[row.day] = []
      grouped[row.day].push({ time: row.time, note: row.note ?? '' })
    })
    schedule.value = schedule.value.map(d => ({
      ...d,
      masses: grouped[d.day] ?? d.masses,
    }))
  }
})

function addTime(di: number) {
  schedule.value[di].masses.push({ time: '', note: '' })
}

function removeTime(di: number, mi: number) {
  schedule.value[di].masses.splice(mi, 1)
}

async function save() {
  saving.value = true
  error.value = ''
  saved.value = false

  // Delete all existing and re-insert
  const { data: existing } = await supabase.from('mass_times').select('id')
  if (existing && existing.length > 0) {
    const ids = existing.map((r: any) => r.id)
    await supabase.from('mass_times').delete().in('id', ids)
  }

  const rows: any[] = []
  schedule.value.forEach(day => {
    day.masses.forEach(m => {
      if (m.time) rows.push({ day: day.day, time: m.time, note: m.note || null })
    })
  })

  const { error: err } = await supabase.from('mass_times').insert(rows)
  if (err) error.value = err.message
  else saved.value = true

  saving.value = false
}
</script>
