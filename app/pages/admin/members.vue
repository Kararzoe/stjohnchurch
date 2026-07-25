<template>
  <div class="min-h-screen bg-gray-50 flex">
    <aside class="w-64 bg-navy min-h-screen flex flex-col shrink-0">
      <div class="p-6 border-b border-white/10">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-full bg-gold/20 border border-gold-light/40 flex items-center justify-center">
            <span class="text-gold-light">✝</span>
          </div>
          <div>
            <p class="text-white font-bold text-sm leading-tight">St. John of the Cross</p>
            <p class="text-gold-light text-xs">Admin Dashboard</p>
          </div>
        </div>
      </div>
      <nav class="flex-1 p-4 space-y-1">
        <NuxtLink v-for="item in navItems" :key="item.to" :to="item.to"
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm">
          <span class="text-lg">{{ item.icon }}</span>{{ item.label }}
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-white/10">
        <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <span>←</span> Back to Website
        </NuxtLink>
      </div>
    </aside>

    <main class="flex-1 p-8 overflow-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="font-playfair text-3xl font-bold text-navy">Members</h1>
          <p class="text-gray-500 text-sm mt-1">Manage eligible voters and their login access</p>
        </div>
        <button @click="showAdd = true"
          class="px-5 py-2.5 rounded-full bg-gold text-white font-semibold text-sm hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30">
          + Add Member
        </button>
      </div>

      <!-- Search -->
      <div class="mb-6">
        <input v-model="search" type="text" placeholder="Search by name or member ID..."
          class="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold bg-white" />
      </div>

      <!-- Table -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table class="w-full text-sm">
          <thead class="bg-navy text-white">
            <tr>
              <th class="text-left px-6 py-4 font-medium">Member ID</th>
              <th class="text-left px-6 py-4 font-medium">Name</th>
              <th class="text-left px-6 py-4 font-medium hidden md:table-cell">Group</th>
              <th class="text-left px-6 py-4 font-medium">Status</th>
              <th class="text-left px-6 py-4 font-medium">Voted</th>
              <th class="text-left px-6 py-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(m, i) in filtered" :key="m.id"
              :class="['border-t border-gray-50 hover:bg-gold/5 transition-colors', i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30']">
              <td class="px-6 py-4 font-mono text-xs text-gray-500">{{ m.id }}</td>
              <td class="px-6 py-4 font-medium text-navy">{{ m.name }}</td>
              <td class="px-6 py-4 text-gray-500 hidden md:table-cell">{{ m.group }}</td>
              <td class="px-6 py-4">
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', m.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600']">
                  {{ m.active ? 'Active' : 'Disabled' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span :class="['text-xs font-bold px-2 py-1 rounded-full', m.voted ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500']">
                  {{ m.voted ? 'Yes' : 'No' }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <button @click="m.active = !m.active"
                    class="text-xs px-3 py-1 rounded-lg border border-gray-200 hover:border-gold hover:text-gold transition-colors">
                    {{ m.active ? 'Disable' : 'Enable' }}
                  </button>
                  <button @click="removeM(m.id)"
                    class="text-xs px-3 py-1 rounded-lg border border-red-100 text-red-500 hover:bg-red-50 transition-colors">
                    Remove
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="px-6 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {{ filtered.length }} of {{ members.length }} members
        </div>
      </div>

      <!-- Add member modal -->
      <div v-if="showAdd" class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
          <h2 class="font-playfair text-2xl font-bold text-navy mb-6">Add New Member</h2>
          <form class="space-y-4" @submit.prevent="addMember">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input v-model="newMember.name" type="text" placeholder="John Doe"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Group / Ministry</label>
              <input v-model="newMember.group" type="text" placeholder="e.g. Men's Group"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input v-model="newMember.password" type="text" placeholder="Assign a password"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold" />
            </div>
            <div class="flex gap-3 pt-2">
              <button type="submit"
                class="flex-1 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all">
                Add Member
              </button>
              <button type="button" @click="showAdd = false"
                class="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const showAdd = ref(false)
const search = ref('')
const newMember = reactive({ name: '', group: '', password: '' })

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/content', label: 'Website Content', icon: '📝' },
  { to: '/admin/elections', label: 'Elections', icon: '🗳️' },
  { to: '/admin/members', label: 'Members', icon: '👥' },
  { to: '/admin/gallery', label: 'Photo Gallery', icon: '📷' },
  { to: '/admin/news', label: 'News & Updates', icon: '📰' },
  { to: '/admin/mass-times', label: 'Mass Times', icon: '🕐' },
]

const members = ref([
  { id: 'SJC-2026-001', name: 'Emmanuel Okafor', group: "Men's Group", active: true, voted: true },
  { id: 'SJC-2026-002', name: 'Grace Adeyemi', group: "Women's Group", active: true, voted: true },
  { id: 'SJC-2026-003', name: 'Peter Nwachukwu', group: 'Youth', active: true, voted: false },
  { id: 'SJC-2026-004', name: 'Mary Bello', group: 'Choir', active: true, voted: true },
  { id: 'SJC-2026-005', name: 'Joseph Danladi', group: "Men's Group", active: false, voted: false },
  { id: 'SJC-2026-006', name: 'Blessing Uche', group: 'Altar Servers', active: true, voted: false },
])

const filtered = computed(() =>
  members.value.filter(m =>
    m.name.toLowerCase().includes(search.value.toLowerCase()) ||
    m.id.toLowerCase().includes(search.value.toLowerCase())
  )
)

function addMember() {
  const id = `SJC-2026-${String(members.value.length + 1).padStart(3, '0')}`
  members.value.push({ id, name: newMember.name, group: newMember.group, active: true, voted: false })
  showAdd.value = false
  Object.assign(newMember, { name: '', group: '', password: '' })
}

function removeM(id: string) {
  members.value = members.value.filter(m => m.id !== id)
}
</script>
