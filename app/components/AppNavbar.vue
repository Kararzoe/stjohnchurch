<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'bg-navy shadow-2xl py-3' : 'bg-transparent py-5'
    ]"
  >
    <div class="max-w-7xl mx-auto px-6 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-full bg-gold/20 border border-gold-light/40 flex items-center justify-center group-hover:bg-gold/40 transition-colors">
          <span class="text-gold-light text-lg">✝</span>
        </div>
        <div>
          <p class="text-white font-playfair font-bold text-lg leading-tight">St. John of the Cross</p>
          <p class="text-gold-light text-xs tracking-widest uppercase">Catholic Church · Mararaba</p>
        </div>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-8">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-sm text-gray-300 hover:text-gold-light transition-colors relative group"
        >
          {{ link.label }}
          <span class="absolute -bottom-1 left-0 w-0 h-px bg-gold-light group-hover:w-full transition-all duration-300" />
        </NuxtLink>
        <NuxtLink
          to="/donate"
          class="px-5 py-2 rounded-full bg-gold text-white text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5"
        >
          Donate
        </NuxtLink>
      </nav>

      <!-- Mobile toggle -->
      <button class="lg:hidden text-white p-2" @click="menuOpen = !menuOpen">
        <div class="w-6 flex flex-col gap-1.5 transition-all">
          <span :class="['block h-0.5 bg-white transition-all', menuOpen ? 'rotate-45 translate-y-2' : '']" />
          <span :class="['block h-0.5 bg-white transition-all', menuOpen ? 'opacity-0' : '']" />
          <span :class="['block h-0.5 bg-white transition-all', menuOpen ? '-rotate-45 -translate-y-2' : '']" />
        </div>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="lg:hidden bg-navy-dark border-t border-white/10 px-6 py-4">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="block py-3 text-gray-300 hover:text-gold-light border-b border-white/10 text-sm transition-colors"
          @click="menuOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
        <NuxtLink
          to="/donate"
          class="block mt-4 text-center py-2.5 rounded-full bg-gold text-white text-sm font-semibold"
          @click="menuOpen = false"
        >
          Donate
        </NuxtLink>
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const scrolled = computed(() => scrollY.value > 50)
const menuOpen = ref(false)

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/clergy', label: 'Clergy' },
  { to: '/mass-times', label: 'Mass Times' },
  { to: '/ministries', label: 'Ministries' },
  { to: '/events', label: 'Events' },
  { to: '/news', label: 'News' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/elections', label: 'Elections' },
  { to: '/contact', label: 'Contact' },
]
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
