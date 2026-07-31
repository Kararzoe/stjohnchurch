<template>
  <div>
    <div class="mb-6">
      <h1 class="font-playfair text-2xl font-bold text-navy">Donations</h1>
      <p class="text-gray-400 text-sm mt-1">All parish donations</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total NGN</p>
        <p class="font-playfair text-2xl font-black text-navy">₦{{ totalNGN.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total USD</p>
        <p class="font-playfair text-2xl font-black text-navy">${{ totalUSD.toLocaleString() }}</p>
      </div>
      <div class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <p class="text-xs text-gray-400 uppercase tracking-widest font-bold mb-1">Total Donors</p>
        <p class="font-playfair text-2xl font-black text-navy">{{ donations.length }}</p>
      </div>
    </div>

    <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div v-if="loading" class="text-center py-12 text-gray-400 text-sm">Loading...</div>
      <div v-else-if="donations.length === 0" class="text-center py-12 text-gray-400 text-sm">No donations yet</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-gray-100">
            <tr>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Name</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Designation</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">Date</th>
              <th class="text-left px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in donations" :key="d.id" class="border-t border-gray-50 hover:bg-gray-50/50 transition-colors">
              <td class="px-5 py-4 font-semibold text-navy">{{ d.name }}</td>
              <td class="px-5 py-4 font-black text-green-600">{{ d.currency === 'NGN' ? '₦' : '$' }}{{ Number(d.amount).toLocaleString() }}</td>
              <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ d.designation }}</td>
              <td class="px-5 py-4 text-gray-400 hidden md:table-cell">{{ new Date(d.created_at).toLocaleDateString() }}</td>
              <td class="px-5 py-4">
                <span :class="['px-2.5 py-1 rounded-full text-xs font-bold', d.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600']">
                  {{ d.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loading = ref(true)
const donations = ref<any[]>([])

const totalNGN = computed(() => donations.value.filter(d => d.currency === 'NGN').reduce((s, d) => s + Number(d.amount), 0))
const totalUSD = computed(() => donations.value.filter(d => d.currency === 'USD').reduce((s, d) => s + Number(d.amount), 0))

onMounted(async () => {
  const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false })
  donations.value = data ?? []
  loading.value = false
})
</script>
