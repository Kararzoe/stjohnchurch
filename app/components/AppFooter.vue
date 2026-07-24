<template>
  <footer class="bg-navy-dark text-gray-300 pt-16 pb-6">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
      <!-- Brand -->
      <div class="md:col-span-2">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-full bg-gold/20 border border-gold-light/40 flex items-center justify-center">
            <span class="text-gold-light text-lg">✝</span>
          </div>
          <div>
            <p class="text-white font-playfair font-bold text-lg leading-tight">St. John</p>
            <p class="text-gold-light text-xs tracking-widest uppercase">Catholic Church</p>
          </div>
        </div>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs">
          A welcoming community rooted in faith, nourished by the sacraments, and called to serve one another in love.
        </p>
        <div class="flex gap-3 mt-5">
          <a v-for="s in socials" :key="s.label" :href="s.href"
            class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-gold transition-colors text-sm">
            {{ s.icon }}
          </a>
        </div>
      </div>

      <!-- Quick links -->
      <div>
        <h3 class="text-gold-light text-xs uppercase tracking-widest font-semibold mb-4">Quick Links</h3>
        <ul class="space-y-2 text-sm">
          <li v-for="link in links" :key="link.to">
            <NuxtLink :to="link.to" class="hover:text-gold-light transition-colors flex items-center gap-2 group">
              <span class="w-1 h-1 rounded-full bg-gold-light opacity-0 group-hover:opacity-100 transition-opacity" />
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Contact -->
      <div>
        <h3 class="text-gold-light text-xs uppercase tracking-widest font-semibold mb-4">Contact</h3>
        <ul class="space-y-3 text-sm">
          <li class="flex items-start gap-2">
            <span class="text-gold-light mt-0.5">📍</span>
            <span>123 Church Street<br>Your City, ST 00000</span>
          </li>
          <li class="flex items-center gap-2">
            <span class="text-gold-light">📞</span>
            (555) 123-4567
          </li>
          <li class="flex items-center gap-2">
            <span class="text-gold-light">✉️</span>
            info@stjohncatholic.org
          </li>
        </ul>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
      <p>© {{ new Date().getFullYear() }} St. John Catholic Church. All rights reserved.</p>
      <p>Built with ❤️ for our parish community</p>
    </div>
  </footer>
</template>

<script setup lang="ts">
const links = [
  { to: '/about', label: 'About Us' },
  { to: '/mass-times', label: 'Mass Times' },
  { to: '/events', label: 'Events' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/contact', label: 'Contact' },
  { to: '/donate', label: 'Donate' },
]
const socials = [
  { label: 'Facebook', href: '#', icon: 'f' },
  { label: 'Instagram', href: '#', icon: '📷' },
  { label: 'YouTube', href: '#', icon: '▶' },
]
</script>
