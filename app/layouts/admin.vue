<template>
  <div class="min-h-screen bg-gray-50 flex">

    <!-- Sidebar -->
    <aside :class="['fixed inset-y-0 left-0 z-50 flex flex-col bg-navy transition-all duration-300', sidebarOpen ? 'w-64' : 'w-16']">
      <!-- Logo -->
      <div class="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div class="w-8 h-8 shrink-0 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
          <span class="text-gold text-sm">✝</span>
        </div>
        <div v-if="sidebarOpen" class="min-w-0">
          <p class="text-white font-playfair font-bold text-sm leading-tight truncate">St. John Admin</p>
          <p class="text-gold/60 text-[10px] truncate">Parish Dashboard</p>
        </div>
      </div>

      <!-- Nav links -->
      <nav class="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        <NuxtLink
          v-for="item in visibleNavItems"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group',
            $route.path === item.to ? 'bg-gold/20 text-gold' : 'text-gray-400 hover:bg-white/10 hover:text-white'
          ]"
        >
          <span class="text-lg shrink-0">{{ item.icon }}</span>
          <span v-if="sidebarOpen" class="text-sm font-medium truncate">{{ item.label }}</span>
        </NuxtLink>
      </nav>

      <!-- Logout -->
      <div class="p-3 border-t border-white/10">
        <button
          @click="logout"
          :class="['flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:bg-red-500/20 hover:text-red-400 transition-all w-full']"
        >
          <span class="text-lg shrink-0">🚪</span>
          <span v-if="sidebarOpen" class="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <div :class="['flex-1 flex flex-col transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-16']">
      <!-- Top bar -->
      <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <button @click="sidebarOpen = !sidebarOpen" class="text-gray-500 hover:text-navy transition-colors">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex items-center gap-3">
          <span class="text-xs text-gray-400">St. John of the Cross · Mararaba</span>
          <div class="w-8 h-8 rounded-full bg-navy flex items-center justify-center">
            <span class="text-gold text-xs font-bold">A</span>
          </div>
        </div>
      </header>

      <!-- Page slot -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
const sidebarOpen = ref(true)
const router = useRouter()
const harvestActive = ref(true)

onMounted(async () => {
  const { data } = await supabase.from('site_content').select('value').eq('key', 'harvest_active').single()
  harvestActive.value = data ? data.value === 'true' : true
})

const navItems = [
  { to: '/admin', icon: '📊', label: 'Overview' },
  { to: '/admin/homepage', icon: '🏠', label: 'Homepage' },
  { to: '/admin/contact', icon: '📞', label: 'Contact Info' },
  { to: '/admin/ministries', icon: '🙌', label: 'Ministries' },
  { to: '/admin/votes', icon: '🗳️', label: 'Harvest Votes', harvestOnly: true },
  { to: '/admin/contestants', icon: '🏆', label: 'Contestants', harvestOnly: true },
  { to: '/admin/donations', icon: '💰', label: 'Donations' },
  { to: '/admin/news', icon: '📰', label: 'News' },
  { to: '/admin/events', icon: '📅', label: 'Events' },
  { to: '/admin/mass-times', icon: '⛪', label: 'Mass Times' },
  { to: '/admin/clergy', icon: '✝️', label: 'Clergy' },
  { to: '/admin/about', icon: '🏛️', label: 'About Page' },
  { to: '/admin/members', icon: '👥', label: 'Members' },
  { to: '/admin/elections', icon: '🗳️', label: 'Elections' },
  { to: '/admin/gallery', icon: '🖼️', label: 'Gallery' },
]

const visibleNavItems = computed(() => navItems.filter((i: any) => !i.harvestOnly || harvestActive.value))

async function logout() {
  const supabase = useSupabase()
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>
