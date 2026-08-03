<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="font-playfair text-2xl font-bold text-navy">Members</h1>
        <p class="text-gray-400 text-sm mt-1">Manage eligible voters and their login access</p>
      </div>
      <button @click="showAdd = true"
        class="px-5 py-2.5 rounded-xl text-white text-sm font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
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
        <thead class="bg-gray-50 border-b border-gray-100">
          <tr>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Member ID</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Group</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Voted</th>
            <th class="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.id" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
            <td class="px-5 py-4 font-mono text-xs text-gray-500">{{ m.id }}</td>
            <td class="px-5 py-4 font-semibold text-navy">{{ m.name }}</td>
            <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ m.group }}</td>
            <td class="px-5 py-4">
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', m.active ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500']">
                {{ m.active ? 'Active' : 'Disabled' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <span :class="['text-xs font-bold px-2.5 py-1 rounded-full', m.voted ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400']">
                {{ m.voted ? 'Yes' : 'No' }}
              </span>
            </td>
            <td class="px-5 py-4">
              <div class="flex items-center gap-2 justify-end">
                <button @click="m.active = !m.active" class="text-xs text-gold hover:text-navy font-bold transition-colors">
                  {{ m.active ? 'Disable' : 'Enable' }}
                </button>
                <button @click="removeM(m.id)" class="text-xs text-red-400 hover:text-red-600 font-bold transition-colors">Remove</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
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
            <button type="submit" class="flex-1 py-3 rounded-xl text-white font-bold shadow-lg hover:-translate-y-0.5 transition-all" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
              Add Member
            </button>
            <button type="button" @click="showAdd = false" class="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold hover:border-navy transition-all">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const showAdd = ref(false)
const search = ref('')
const newMember = reactive({ name: '', group: '', password: '' })

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
