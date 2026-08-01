<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0">
      <img src="/church-interior.jpg" alt="Mass Times" class="w-full h-full object-cover object-center" />
    </div>
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Join Us</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Mass Times</h1>
      <div class="catholic-divider mt-3"><span class="text-gold-light text-base">✦</span></div>
      <p class="text-gray-300 mt-2 text-sm md:text-base italic">"All are welcome at the table of the Lord"</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-20 px-4 bg-cream">
    <div class="max-w-3xl mx-auto">

      <!-- Open all / close all -->
      <div class="flex justify-end mb-4 reveal">
        <button @click="toggleAll"
          class="text-xs text-gold hover:text-navy font-semibold transition-colors flex items-center gap-1">
          {{ allOpen ? 'Collapse All ↑' : 'Expand All ↓' }}
        </button>
      </div>

      <!-- Accordion -->
      <div class="space-y-3 reveal">
        <div v-for="(s, i) in schedule" :key="s.category"
          class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

          <!-- Dropdown header -->
          <button
            class="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gold/5 transition-colors group"
            @click="toggle(i)"
          >
            <div class="flex items-center gap-3">
              <div :class="['w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors', open[i] ? 'bg-gold' : 'bg-navy/10 group-hover:bg-gold/20']">
                <span class="text-base">{{ s.icon }}</span>
              </div>
              <div class="text-left">
                <p class="font-playfair font-bold text-navy text-base sm:text-lg leading-tight">{{ s.category }}</p>
                <p class="text-xs text-gray-400 mt-0.5">{{ s.subtitle }}</p>
              </div>
            </div>
            <!-- Chevron -->
            <span :class="['text-gold transition-transform duration-300 text-lg font-bold shrink-0 ml-3', open[i] ? 'rotate-180' : '']">
              ↓
            </span>
          </button>

          <!-- Dropdown content -->
          <Transition name="accordion">
            <div v-if="open[i]">
              <div class="border-t border-gray-100">
                <table class="w-full text-sm">
                  <thead>
                    <tr class="bg-navy/5">
                      <th class="text-left px-5 py-2.5 font-semibold text-navy text-xs uppercase tracking-wider">Day</th>
                      <th class="text-left px-5 py-2.5 font-semibold text-navy text-xs uppercase tracking-wider">Time</th>
                      <th class="text-left px-5 py-2.5 font-semibold text-navy text-xs uppercase tracking-wider hidden sm:table-cell">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(r, ri) in s.rows" :key="ri"
                      :class="['border-t border-gray-50 hover:bg-gold/5 transition-colors', ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/40']">
                      <td class="px-5 py-3 text-gray-700 text-xs sm:text-sm">{{ r.day }}</td>
                      <td class="px-5 py-3 font-bold text-navy text-xs sm:text-sm flex items-center gap-2">
                        <span class="text-gold-light text-xs">✝</span>{{ r.time }}
                      </td>
                      <td class="px-5 py-3 text-gray-400 text-xs hidden sm:table-cell">{{ r.note }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Notice -->
      <div class="reveal mt-6 flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800">
        <span class="text-2xl shrink-0">⚠️</span>
        <p class="text-sm leading-relaxed">
          Mass times may change on holidays and special occasions. Please check the bulletin
          or call the parish office to confirm.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const schedule = [
  {
    category: 'Sunday',
    subtitle: '7 Masses every Sunday',
    icon: '⛪',
    rows: [
      { day: 'Sunday', time: '5:30 AM', note: '' },
      { day: 'Sunday', time: '7:30 AM', note: '' },
      { day: 'Sunday', time: '9:30 AM', note: 'Hausa Mass' },
      { day: 'Sunday', time: '9:30 AM', note: "Children's Mass" },
      { day: 'Sunday', time: '11:00 AM', note: '' },
      { day: 'Sunday', time: '5:15 PM', note: 'Benediction' },
      { day: 'Sunday', time: '6:00 PM', note: 'Mass' },
    ],
  },
  {
    category: 'Weekdays',
    subtitle: 'Monday to Friday',
    icon: '🕐',
    rows: [
      { day: 'Monday – Friday', time: '6:00 AM', note: '' },
      { day: 'Monday – Friday', time: '6:00 PM', note: '' },
    ],
  },
  {
    category: 'Saturday',
    subtitle: 'Morning Mass',
    icon: '✝️',
    rows: [
      { day: 'Saturday', time: '6:00 AM', note: '' },
    ],
  },
  {
    category: 'Holy Days of Obligation',
    subtitle: 'Solemnities & Feast Days',
    icon: '📿',
    rows: [
      { day: 'To be announced', time: '—', note: 'Check bulletin' },
    ],
  },
]

const open = ref<boolean[]>(schedule.map((_, i) => i === 0))

const allOpen = computed(() => open.value.every(Boolean))

function toggle(i: number) {
  open.value[i] = !open.value[i]
}

function toggleAll() {
  const val = !allOpen.value
  open.value = open.value.map(() => val)
}
</script>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.accordion-enter-from,
.accordion-leave-to {
  opacity: 0;
  max-height: 0;
}
.accordion-enter-to,
.accordion-leave-from {
  opacity: 1;
  max-height: 500px;
}
</style>
