<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
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
          class="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition-all text-sm group">
          <span class="text-lg">{{ item.icon }}</span>
          {{ item.label }}
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-white/10">
        <NuxtLink to="/" class="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors">
          <span>←</span> Back to Website
        </NuxtLink>
      </div>
    </aside>

    <!-- Main -->
    <main class="flex-1 p-8 overflow-auto">
      <div class="mb-8">
        <h1 class="font-playfair text-3xl font-bold text-navy">Dashboard</h1>
        <p class="text-gray-500 text-sm mt-1">Welcome back, Admin. Here's what's happening.</p>
      </div>

      <!-- Stats -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div v-for="s in stats" :key="s.label"
          class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center justify-between mb-3">
            <span class="text-2xl">{{ s.icon }}</span>
            <span :class="['text-xs font-semibold px-2 py-0.5 rounded-full', s.up ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500']">
              {{ s.change }}
            </span>
          </div>
          <p class="font-playfair text-3xl font-black text-navy">{{ s.value }}</p>
          <p class="text-gray-500 text-xs mt-1">{{ s.label }}</p>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="mb-8">
        <h2 class="font-semibold text-navy mb-4">Quick Actions</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <NuxtLink v-for="a in actions" :key="a.label" :to="a.to"
            class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gold/30 transition-all group text-center">
            <span class="text-3xl block mb-2">{{ a.icon }}</span>
            <p class="text-sm font-semibold text-navy group-hover:text-gold transition-colors">{{ a.label }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- Recent activity -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 class="font-semibold text-navy mb-4">Recent Activity</h2>
        <div class="space-y-3">
          <div v-for="a in activity" :key="a.text" class="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <div class="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-sm shrink-0">{{ a.icon }}</div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-gray-700">{{ a.text }}</p>
              <p class="text-xs text-gray-400">{{ a.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊' },
  { to: '/admin/content', label: 'Website Content', icon: '📝' },
  { to: '/admin/elections', label: 'Elections', icon: '🗳️' },
  { to: '/admin/members', label: 'Members', icon: '👥' },
  { to: '/admin/gallery', label: 'Photo Gallery', icon: '📷' },
  { to: '/admin/news', label: 'News & Updates', icon: '📰' },
  { to: '/admin/mass-times', label: 'Mass Times', icon: '🕐' },
]

const stats = [
  { icon: '👥', label: 'Registered Members', value: '240', change: '+12', up: true },
  { icon: '🗳️', label: 'Votes Cast', value: '187', change: '78%', up: true },
  { icon: '📅', label: 'Upcoming Events', value: '6', change: '+2', up: true },
  { icon: '📰', label: 'News Posts', value: '5', change: 'Active', up: false },
]

const actions = [
  { icon: '➕', label: 'Add News Post', to: '/admin/news' },
  { icon: '🗳️', label: 'Manage Elections', to: '/admin/elections' },
  { icon: '👤', label: 'Add Member', to: '/admin/members' },
  { icon: '📷', label: 'Upload Photos', to: '/admin/gallery' },
]

const activity = [
  { icon: '🗳️', text: 'Member SJC-2026-042 cast their vote', time: '2 minutes ago' },
  { icon: '👤', text: 'New member added: SJC-2026-241', time: '1 hour ago' },
  { icon: '📰', text: 'News post published: "Parish Council Elections Coming Soon"', time: '3 hours ago' },
  { icon: '🗳️', text: 'Election "Parish Council 2026" opened for voting', time: 'Yesterday' },
  { icon: '📷', text: '5 new photos added to gallery', time: '2 days ago' },
]
</script>
