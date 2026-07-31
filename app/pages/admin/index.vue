<template>
  <div>
    <div class="mb-6">
      <h1 class="font-playfair text-2xl font-bold text-navy">Dashboard Overview</h1>
      <p class="text-gray-400 text-sm mt-1">Welcome back, Admin</p>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div v-for="stat in stats" :key="stat.label"
        class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <span class="text-2xl">{{ stat.icon }}</span>
          <span :class="['text-xs font-bold px-2 py-1 rounded-full', stat.up ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400']">
            {{ stat.change }}
          </span>
        </div>
        <p class="font-playfair text-2xl font-black text-navy">{{ stat.value }}</p>
        <p class="text-gray-400 text-xs mt-1">{{ stat.label }}</p>
      </div>
    </div>

    <!-- Quick actions -->
    <div class="mb-8">
      <h2 class="font-playfair text-lg font-bold text-navy mb-4">Quick Actions</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <NuxtLink v-for="action in quickActions" :key="action.to" :to="action.to"
          class="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:border-gold/40 hover:shadow-md hover:-translate-y-0.5 transition-all group text-center">
          <span class="text-2xl block mb-2">{{ action.icon }}</span>
          <p class="text-xs font-semibold text-navy group-hover:text-gold transition-colors">{{ action.label }}</p>
        </NuxtLink>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top votes -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-playfair font-bold text-navy">Top Voted</h3>
          <NuxtLink to="/admin/votes" class="text-xs text-gold hover:text-navy font-semibold transition-colors">View all →</NuxtLink>
        </div>
        <div v-if="loadingVotes" class="text-center py-6 text-gray-400 text-sm">Loading...</div>
        <div v-else-if="topVotes.length === 0" class="text-center py-6 text-gray-400 text-sm">No votes yet</div>
        <div v-else class="space-y-3">
          <div v-for="v in topVotes" :key="v.contestant_id" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <span class="text-gold text-xs font-black">{{ v.rank }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-navy truncate">{{ v.name }}</p>
              <p class="text-xs text-gray-400">{{ v.category }}</p>
            </div>
            <span class="text-sm font-black text-navy">{{ v.total }}</span>
          </div>
        </div>
      </div>

      <!-- Recent donations -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-playfair font-bold text-navy">Recent Donations</h3>
          <NuxtLink to="/admin/donations" class="text-xs text-gold hover:text-navy font-semibold transition-colors">View all →</NuxtLink>
        </div>
        <div v-if="loadingDonations" class="text-center py-6 text-gray-400 text-sm">Loading...</div>
        <div v-else-if="recentDonations.length === 0" class="text-center py-6 text-gray-400 text-sm">No donations yet</div>
        <div v-else class="space-y-3">
          <div v-for="d in recentDonations" :key="d.id" class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full bg-navy/5 flex items-center justify-center shrink-0 text-sm">💰</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-semibold text-navy truncate">{{ d.name }}</p>
              <p class="text-xs text-gray-400">{{ d.designation }}</p>
            </div>
            <span class="text-sm font-black text-green-600">{{ d.currency === 'NGN' ? '₦' : '$' }}{{ Number(d.amount).toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const supabase = useSupabase()
const loadingVotes = ref(true)
const loadingDonations = ref(true)
const topVotes = ref<any[]>([])
const recentDonations = ref<any[]>([])

const stats = ref([
  { icon: '🗳️', label: 'Total Votes', value: '—', change: '', up: false },
  { icon: '💰', label: 'Total Donations', value: '—', change: '', up: false },
  { icon: '📰', label: 'News Posts', value: '—', change: '', up: false },
  { icon: '📅', label: 'Events', value: '—', change: '', up: false },
])

const quickActions = [
  { icon: '📰', label: 'New Post', to: '/admin/news' },
  { icon: '📅', label: 'New Event', to: '/admin/events' },
  { icon: '👥', label: 'Add Contestant', to: '/admin/contestants' },
  { icon: '🖼️', label: 'Upload Photo', to: '/admin/gallery' },
]

onMounted(async () => {
  // Load vote counts
  const { data: votes } = await supabase
    .from('votes')
    .select('contestant_id, contestant_name, category')
  if (votes) {
    const counts: Record<string, any> = {}
    votes.forEach((v: any) => {
      if (!counts[v.contestant_id]) counts[v.contestant_id] = { contestant_id: v.contestant_id, name: v.contestant_name, category: v.category, total: 0 }
      counts[v.contestant_id].total++
    })
    topVotes.value = Object.values(counts)
      .sort((a: any, b: any) => b.total - a.total)
      .slice(0, 5)
      .map((v: any, i: number) => ({ ...v, rank: i + 1 }))
    stats.value[0].value = String(votes.length)
  }
  loadingVotes.value = false

  // Load donations
  const { data: donations } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  if (donations) {
    recentDonations.value = donations
    stats.value[1].value = '₦' + donations.reduce((s: number, d: any) => s + (d.currency === 'NGN' ? Number(d.amount) : 0), 0).toLocaleString()
  }
  loadingDonations.value = false

  // Load news count
  const { count: newsCount } = await supabase.from('news').select('*', { count: 'exact', head: true })
  stats.value[2].value = String(newsCount ?? 0)

  // Load events count
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
  stats.value[3].value = String(eventsCount ?? 0)
})
</script>
