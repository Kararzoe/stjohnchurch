<template>
  <div>
    <div class="mb-6">
      <h1 class="font-playfair text-2xl font-bold text-navy">Contestants</h1>
      <p class="text-gray-400 text-sm mt-1">Harvest/Bazaar Thanksgiving 2026 — all categories</p>
    </div>

    <!-- Category tabs -->
    <div class="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
      <button
        v-for="cat in categories" :key="cat.id"
        @click="activeTab = cat.id"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all border-2 shrink-0',
          activeTab === cat.id
            ? 'bg-navy text-white border-navy'
            : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
        ]"
      >
        {{ cat.icon }} {{ cat.label }}
        <span class="ml-1 text-xs font-black">({{ cat.contestants.length }})</span>
      </button>
    </div>

    <!-- Contestants table -->
    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
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
            <tr
              v-for="c in activeContestants" :key="c.id"
              class="border-b border-gray-50 hover:bg-gray-50 transition-colors"
            >
              <td class="px-5 py-3">
                <span class="w-7 h-7 rounded-full bg-navy/10 text-navy text-xs font-black flex items-center justify-center">{{ c.number }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="w-10 h-10 rounded-xl overflow-hidden border border-gray-100">
                  <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover object-top" />
                  <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-lg">👤</div>
                </div>
              </td>
              <td class="px-5 py-3">
                <p class="font-semibold text-navy text-sm">{{ c.name }}</p>
              </td>
              <td class="px-5 py-3 hidden md:table-cell">
                <p class="text-gray-400 text-xs">{{ c.tagline }}</p>
              </td>
              <td class="px-5 py-3 text-right">
                <span v-if="loading" class="text-gray-300 text-sm">—</span>
                <span v-else class="font-black text-navy text-sm">{{ voteCounts[c.id] ?? 0 }}</span>
              </td>
              <td class="px-5 py-3">
                <div class="flex items-center gap-3 justify-end">
                  <button @click="openEdit(c)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
                  <button @click="deleteContestant(c.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <p class="text-xs text-gray-400 font-semibold">{{ activeContestants.length }} contestants in this category</p>
        <p class="text-xs font-black text-navy">
          Total votes: {{ activeContestants.reduce((s, c) => s + (voteCounts[c.id] ?? 0), 0).toLocaleString() }}
        </p>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editTarget" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-md">
        <div class="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 class="font-playfair text-xl font-bold text-navy">Edit Contestant</h2>
          <button @click="editTarget = null" class="text-gray-400 hover:text-navy text-2xl leading-none">&times;</button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Name</label>
            <input v-model="editForm.name" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tagline</label>
            <input v-model="editForm.tagline" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Photo URL</label>
            <input v-model="editForm.photo" type="text" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            <img v-if="editForm.photo" :src="editForm.photo" class="mt-3 h-24 rounded-xl object-cover object-top" />
          </div>
          <div class="flex gap-3 pt-2">
            <button @click="editTarget = null" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy transition-all">Cancel</button>
            <button @click="saveEdit" class="flex-1 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">Save</button>
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
const voteCounts = ref<Record<string, number>>({})
const activeTab = ref('face')
const editTarget = ref<any>(null)
const editForm = reactive({ name: '', tagline: '', photo: '' })

const categories = reactive([
  {
    id: 'face', label: 'Face of Harvest', icon: '👑',
    contestants: [
      { id: 'f1', number: 1, name: 'Miss Chimamanda Lawrence', tagline: '📞 08087350321', photo: '/foh-chimamanda.jpg' },
      { id: 'f2', number: 2, name: 'Miss Emmanuelle Moses', tagline: '📞 07039730834', photo: '/foh-emmanuelle.jpg' },
      { id: 'f3', number: 3, name: 'Mr. Sebastian Felix', tagline: 'Face of Harvest', photo: '/foh-sebastian.jpg' },
      { id: 'f4', number: 4, name: 'Master John Agim', tagline: 'Face of Harvest', photo: '/foh-john.jpg' },
      { id: 'f5', number: 5, name: 'Master Iyeakachukwu Ugochukwu', tagline: 'Face of Harvest', photo: '/foh-iyeaka.jpg' },
      { id: 'f6', number: 6, name: 'Ashinatiang C. Perpetual', tagline: '📞 08114277256', photo: '/foh-perpetual.jpg' },
      { id: 'f7', number: 7, name: 'Onwumelu Omerebere Clare', tagline: 'CYON', photo: '/foh-clare.jpg' },
      { id: 'f8', number: 8, name: 'Mrs. Blessing Obiora', tagline: 'Face of Harvest', photo: '/foh-blessing.jpg' },
      { id: 'f9', number: 9, name: 'Uzuegbuna Felicity Chidinma', tagline: '📞 09045411265 · Voice of Saints Choir', photo: '/foh-felicity.jpg' },
    ],
  },
  {
    id: 'king', label: 'King of Harvest', icon: '🤴',
    contestants: [
      { id: 'k1', number: 1, name: 'Mr. Jonathan Dodo', tagline: 'King of Harvest', photo: '/koh-jonathan.jpg' },
      { id: 'k2', number: 2, name: 'Paul Djukpan', tagline: 'St. Patrick Edo/Delta', photo: '/koh-paul.jpg' },
    ],
  },
  {
    id: 'queen', label: 'Queen of Harvest', icon: '👸',
    contestants: [
      { id: 'q1', number: 1, name: 'Mrs. Queen Ogbodo', tagline: 'Queen of Harvest', photo: '/qoh-queen.jpg' },
      { id: 'q2', number: 2, name: 'Mrs. Veronica Aboi', tagline: 'Queen of Harvest', photo: '/qoh-veronica.jpg' },
      { id: 'q3', number: 3, name: 'Mrs. Elizabeth Akuezue', tagline: '📞 08053258408', photo: '/qoh-elizabeth.jpg' },
      { id: 'q4', number: 4, name: 'Mrs. Gladys Origbo Onome', tagline: 'Queen of Harvest', photo: '/qoh-gladys.jpg' },
      { id: 'q5', number: 5, name: 'Oghenekevwe Patience Godwin', tagline: 'St. Patrick Edo/Delta', photo: '/qoh-patience.jpg' },
    ],
  },
  {
    id: 'prince', label: 'Prince of Harvest', icon: '🫅',
    contestants: [
      { id: 'p1', number: 1, name: 'Peter Yohanna Akpajeshi', tagline: 'Prince of Harvest', photo: '/proh-peter.jpg' },
      { id: 'p2', number: 2, name: 'Andrew Kelechi Kenechukwu', tagline: 'Prince of Harvest', photo: '/proh-andrew.jpg' },
      { id: 'p3', number: 3, name: 'Okpara Franklin', tagline: '📞 07061668284 · Holy Trinity Igbo Youth', photo: '/proh-franklin.jpg' },
      { id: 'p4', number: 4, name: 'Sunday Wisdom', tagline: 'Blessed Iwene Tansi', photo: '/proh-sunday.jpg' },
      { id: 'p5', number: 5, name: 'Ukam Emmanuel Chukwuemeka', tagline: 'Prince of Harvest', photo: '/proh-ukam.jpg' },
    ],
  },
  {
    id: 'princess', label: 'Princess of Harvest', icon: '🌸',
    contestants: [
      { id: 'pr1', number: 1, name: 'Miss Joyce Gomerep', tagline: 'Princess of Harvest', photo: '/poh-joyce.jpg' },
      { id: 'pr2', number: 2, name: 'Miss Joan Okwuchi', tagline: 'Princess of Harvest', photo: '/poh-joan.jpg' },
      { id: 'pr3', number: 3, name: 'Miss Chioma Aniagboso', tagline: 'Princess of Harvest', photo: '/poh-chioma.jpg' },
      { id: 'pr4', number: 4, name: 'Grace Enyo-Ojo Okpanachi', tagline: 'Princess of Harvest', photo: '/poh-grace.jpg' },
      { id: 'pr5', number: 5, name: 'Eleme Lilian Chidera', tagline: 'Princess of Harvest', photo: '/poh-eleme.jpg' },
      { id: 'pr6', number: 6, name: 'Jaelynn Ebeyin Ikwen', tagline: 'Princess of Harvest', photo: '/poh-jaelynn.jpg' },
      { id: 'pr7', number: 7, name: 'Chukwunonso Anthonia Chidimma', tagline: 'Princess of Harvest', photo: '/poh-chukwunonso.jpg' },
      { id: 'pr8', number: 8, name: 'Omeje Chinecherem', tagline: '📞 08147566658 · Holy Trinity Igbo Youth', photo: '/poh-omeje.jpg' },
      { id: 'pr9', number: 9, name: 'Obayi Emmanuella Somtochukwu', tagline: 'Blessed Iwene Tansi', photo: '/poh-emmanuella.jpg' },
      { id: 'pr10', number: 10, name: 'Princess Oluwasindara Lucy Adodo', tagline: 'St. Michael Yoruba Catholic Community', photo: '/poh-oluwasindara.jpg' },
      { id: 'pr11', number: 11, name: 'Josephine Bonet', tagline: 'Princess of Harvest', photo: '/poh-josephine.jpg' },
      { id: 'pr12', number: 12, name: 'Maia Kosisochukwu', tagline: 'Princess of Harvest', photo: '/poh-maia.jpg' },
    ],
  },
])

const activeContestants = computed(() => categories.find(c => c.id === activeTab.value)?.contestants ?? [])

onMounted(async () => {
  const { data } = await supabase.from('votes').select('contestant_id')
  if (data) {
    data.forEach((v: any) => {
      voteCounts.value[v.contestant_id] = (voteCounts.value[v.contestant_id] ?? 0) + 1
    })
  }
  loading.value = false
})

function openEdit(c: any) {
  editTarget.value = c
  Object.assign(editForm, { name: c.name, tagline: c.tagline, photo: c.photo })
}

function saveEdit() {
  if (!editTarget.value) return
  const cat = categories.find(c => c.contestants.some(x => x.id === editTarget.value.id))
  if (!cat) return
  const idx = cat.contestants.findIndex(x => x.id === editTarget.value.id)
  if (idx !== -1) Object.assign(cat.contestants[idx], { name: editForm.name, tagline: editForm.tagline, photo: editForm.photo })
  editTarget.value = null
}

function deleteContestant(id: string) {
  if (!confirm('Remove this contestant? This only removes them from the list view.')) return
  for (const cat of categories) {
    const idx = cat.contestants.findIndex(c => c.id === id)
    if (idx !== -1) { cat.contestants.splice(idx, 1); break }
  }
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
