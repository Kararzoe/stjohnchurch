<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      scrolled ? 'bg-navy shadow-2xl py-2' : 'bg-transparent py-4'
    ]"
  >
    <div class="max-w-7xl mx-auto px-4 flex items-center justify-between">
      <!-- Logo -->
      <NuxtLink to="/" class="flex items-center gap-2 group min-w-0">
        <img src="/logo-stjohn.jpg" alt="St. John of the Cross" class="w-8 h-8 shrink-0 rounded-full object-cover border border-gold-light/40" />
        <div class="min-w-0">
          <p class="text-white font-playfair font-bold text-sm md:text-base leading-tight truncate">St. John of the Cross</p>
          <p class="text-gold-light text-[10px] tracking-widest uppercase hidden sm:block">Catholic Church · Mararaba</p>
        </div>
        <img src="/logo-osa.jpg" alt="Order of Saint Augustine" class="w-8 h-8 shrink-0 rounded-full object-cover border border-gold-light/40" />
        <div class="min-w-0">
          <p class="text-white font-playfair font-bold text-sm md:text-base leading-tight truncate">St. John of the Cross</p>
          <p class="text-gold-light text-[10px] tracking-widest uppercase hidden sm:block">Catholic Church · Mararaba</p>
        </div>
      </NuxtLink>

      <!-- Desktop nav -->
      <nav class="hidden lg:flex items-center gap-6">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          :class="[
            'text-sm transition-colors relative group whitespace-nowrap pb-1',
            isActive(link.to) ? 'text-gold-light font-semibold' : 'text-gray-300 hover:text-gold-light'
          ]"
        >
          {{ link.label }}
          <span :class="['absolute -bottom-0 left-0 h-0.5 rounded-full bg-gold-light transition-all duration-300', isActive(link.to) ? 'w-full' : 'w-0 group-hover:w-full']" />
        </NuxtLink>
        <NuxtLink
          to="/harvest-vote"
          class="px-4 py-2 rounded-full border border-white/60 text-white text-sm font-semibold hover:bg-white/10 transition-all"
        >
          Contest
        </NuxtLink>
        <NuxtLink
          to="/donate"
          class="px-4 py-2 rounded-full bg-gold text-white text-sm font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30"
        >
          Donate
        </NuxtLink>
      </nav>

      <!-- Mobile toggle -->
      <button
        class="lg:hidden text-white p-2 ml-2 shrink-0"
        aria-label="Toggle menu"
        @click="menuOpen = !menuOpen"
      >
        <div class="w-6 flex flex-col gap-1.5">
          <span :class="['block h-0.5 bg-white transition-all duration-300', menuOpen ? 'rotate-45 translate-y-2' : '']" />
          <span :class="['block h-0.5 bg-white transition-all duration-300', menuOpen ? 'opacity-0' : '']" />
          <span :class="['block h-0.5 bg-white transition-all duration-300', menuOpen ? '-rotate-45 -translate-y-2' : '']" />
        </div>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-down">
      <div v-if="menuOpen" class="lg:hidden bg-navy border-t border-white/10 max-h-[80vh] overflow-y-auto">
        <div class="px-4 py-3 space-y-1">
          <NuxtLink
            v-for="link in links"
            :key="link.to"
            :to="link.to"
            :class="[
              'flex items-center gap-3 py-3 px-3 rounded-xl transition-all text-sm',
              isActive(link.to) ? 'bg-gold/20 text-gold-light font-semibold' : 'text-gray-300 hover:bg-white/10 hover:text-gold-light'
            ]"
            @click="menuOpen = false"
          >
            <span class="text-gold-light text-xs">✝</span>
            {{ link.label }}
          </NuxtLink>
        </div>
        <div class="px-4 pt-2 pb-4 flex flex-col gap-3">
          <NuxtLink
            to="/harvest-vote"
            :class="[
              'block text-center py-3.5 rounded-full text-sm font-bold transition-colors',
              isActive('/harvest-vote') ? 'bg-white text-navy' : 'border border-white/60 text-white hover:bg-white/10'
            ]"
            @click="menuOpen = false"
          >
            Contest
          </NuxtLink>
          <NuxtLink
            to="/donate"
            class="block text-center py-3.5 rounded-full bg-gold text-white text-sm font-bold hover:bg-gold-light transition-colors"
            @click="menuOpen = false"
          >
            Donate ✝
          </NuxtLink>
        </div>
        <div class="border-t border-white/10" />
      </div>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const { y: scrollY } = useWindowScroll()
const scrolled = computed(() => scrollY.value > 50)
const menuOpen = ref(false)

const route = useRoute()
watch(() => route.path, () => { menuOpen.value = false })

function isActive(path: string) {
  return path === '/' ? route.path === '/' : route.path.startsWith(path)
}

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/mass-times', label: 'Mass Times' },
  { to: '/ministries', label: 'Communities & Groups' },
  { to: '/events', label: 'Events' },
  { to: '/news', label: 'News' },
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
  transform: translateY(-8px);
}
</style>
