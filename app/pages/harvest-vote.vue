<template>
  <div class="min-h-screen bg-cream">

    <!-- ── HERO ── -->
    <section class="relative h-[55vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="/church-interior.jpg" alt="Harvest" class="w-full h-full object-cover object-center scale-105" />
      </div>
      <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(26,39,68,0.95) 0%, rgba(26,39,68,0.6) 50%, rgba(139,90,0,0.85) 100%)" />
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 70%, rgba(212,175,55,0.35) 0%, transparent 60%)" />
      <!-- Grain texture -->
      <div class="absolute inset-0 opacity-20 grain-texture" />

      <div class="relative z-10 text-center px-4">
        <!-- Decorative wheat icons -->
        <div class="flex items-center justify-center gap-4 mb-4">
          <span class="text-2xl opacity-60">🌾</span>
          <div class="animate-float">
            <div class="w-16 h-16 rounded-full border-2 border-gold/60 bg-gold/10 flex items-center justify-center shadow-2xl shadow-gold/30">
              <span class="text-3xl">🌾</span>
            </div>
          </div>
          <span class="text-2xl opacity-60">🌾</span>
        </div>
        <p class="text-gold text-xs uppercase tracking-[0.4em] font-semibold mb-2">St. John of the Cross Catholic Church</p>
        <h1 class="font-playfair text-5xl sm:text-7xl font-black text-white leading-tight drop-shadow-2xl">
          Harvest Festival
          <span class="block" style="background: linear-gradient(90deg, #d4af37, #f5e27a, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">2026 Voting</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gold/40" />
          <span class="text-gold text-lg">✦</span>
          <div class="h-px w-16 bg-gold/40" />
        </div>
        <p class="text-gray-300 text-sm mt-3 max-w-md mx-auto leading-relaxed">
          Cast your vote for your favourite contestants across all five categories
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L1440 80L1440 30C1200 80 960 10 720 30C480 50 240 0 0 30L0 80Z" fill="#faf8f3"/></svg>
      </div>
    </section>

    <!-- ── VOTING AREA ── -->
    <div v-if="step === 'vote'" class="py-10 px-4">
      <div class="max-w-5xl mx-auto">

        <!-- Progress bar -->
        <div class="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-widest">Your Progress</p>
            <p class="text-xs font-black text-gold">{{ totalVoted }} / {{ categories.length }} categories</p>
          </div>
          <div class="h-3 bg-gray-100 rounded-full overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-700"
              :style="`width: ${(totalVoted / categories.length) * 100}%; background: linear-gradient(90deg, #b8860b, #d4af37, #f5e27a)`"
            />
          </div>
          <div class="flex justify-between mt-2">
            <span v-for="(cat, i) in categories" :key="cat.id"
              :class="['text-lg transition-all duration-300', totalVoted > i ? 'opacity-100 scale-110' : 'opacity-30']"
            >{{ cat.icon }}</span>
          </div>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            @click="activeTab = i"
            :class="[
              'flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 border-2',
              activeTab === i
                ? 'text-white border-transparent shadow-xl shadow-navy/30'
                : votes[cat.id]
                  ? 'bg-gold/10 text-gold border-gold/40 hover:bg-gold/20'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold/40 hover:text-navy'
            ]"
            :style="activeTab === i ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''"
          >
            <span class="text-base">{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
            <span v-if="votes[cat.id]" class="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px] font-black shadow-sm">✓</span>
          </button>
        </div>

        <!-- Active category panel -->
        <transition name="tab-slide" mode="out-in">
          <div :key="activeTab">
            <!-- Category header -->
            <div class="relative mb-8 rounded-3xl overflow-hidden" style="background: linear-gradient(135deg, #1a2744 0%, #2d4a8a 100%)">
              <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 24px 24px;" />
              <div class="relative flex items-center gap-4 px-6 py-5">
                <div class="w-14 h-14 rounded-2xl bg-gold/20 border border-gold/40 flex items-center justify-center text-3xl shadow-lg">
                  {{ categories[activeTab].icon }}
                </div>
                <div>
                  <p class="text-gold text-xs uppercase tracking-[0.3em] font-bold">Category {{ activeTab + 1 }} of {{ categories.length }}</p>
                  <h2 class="font-playfair font-black text-white text-2xl leading-tight">{{ categories[activeTab].label }}</h2>
                  <p class="text-gray-400 text-xs mt-0.5">{{ categories[activeTab].contestants.length }} contestants</p>
                </div>
                <div class="ml-auto text-right hidden sm:block">
                  <p class="text-gray-400 text-xs">Tap a card to vote</p>
                  <p v-if="votes[categories[activeTab].id]" class="text-green-400 text-xs font-bold mt-1">✓ Vote cast!</p>
                </div>
              </div>
            </div>

            <!-- Contestant cards -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              <button
                v-for="contestant in categories[activeTab].contestants"
                :key="contestant.id"
                @click="castVote(categories[activeTab].id, contestant.id)"
                :class="[
                  'relative rounded-3xl overflow-hidden text-left group transition-all duration-300',
                  votes[categories[activeTab].id] === contestant.id
                    ? 'ring-4 ring-gold shadow-2xl shadow-gold/40 scale-[1.04] -translate-y-1'
                    : 'shadow-md hover:shadow-xl hover:-translate-y-2 hover:ring-2 hover:ring-gold/40'
                ]"
              >
                <!-- Photo -->
                <div class="relative aspect-[2/3] sm:aspect-[3/4] overflow-hidden bg-navy/10">
                  <img
                    v-if="contestant.photo"
                    :src="contestant.photo"
                    :alt="contestant.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                    <span class="text-6xl mb-2">{{ categories[activeTab].icon }}</span>
                  </div>

                  <!-- Number badge -->
                  <div class="absolute top-2.5 left-2.5 w-8 h-8 rounded-full text-white text-xs font-black flex items-center justify-center shadow-lg" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                    {{ contestant.number }}
                  </div>

                  <!-- Selected overlay -->
                  <transition name="fade">
                    <div v-if="votes[categories[activeTab].id] === contestant.id"
                      class="absolute inset-0 flex items-center justify-center"
                      style="background: rgba(212,175,55,0.25)"
                    >
                      <div class="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style="background: linear-gradient(135deg, #b8860b, #d4af37)">
                        <span class="text-white text-2xl font-black">✓</span>
                      </div>
                    </div>
                  </transition>

                  <!-- Bottom gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <!-- Name on photo -->
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <p class="font-playfair font-bold text-white text-sm leading-tight drop-shadow-lg">{{ contestant.name }}</p>
                    <p class="text-gold text-[10px] mt-0.5 leading-tight">{{ contestant.tagline }}</p>
                  </div>
                </div>

                <!-- Vote button bar -->
                <div
                  :class="[
                    'py-2.5 px-3 text-center text-xs font-black uppercase tracking-widest transition-all duration-300',
                    votes[categories[activeTab].id] === contestant.id
                      ? 'text-white'
                      : 'bg-white text-gray-400 group-hover:text-navy'
                  ]"
                  :style="votes[categories[activeTab].id] === contestant.id ? 'background: linear-gradient(90deg, #b8860b, #d4af37)' : ''"
                >
                  {{ votes[categories[activeTab].id] === contestant.id ? '✓ Your Vote' : 'Vote' }}
                </div>
              </button>
            </div>

            <!-- Category nav -->
            <div class="flex items-center justify-between gap-3">
              <button
                v-if="activeTab > 0"
                @click="activeTab--"
                class="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-navy hover:text-navy transition-all bg-white shadow-sm"
              >
                ← Previous
              </button>
              <div v-else />
              <button
                v-if="activeTab < categories.length - 1"
                @click="activeTab++"
                :class="[
                  'flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm',
                  votes[categories[activeTab].id]
                    ? 'text-white shadow-lg shadow-navy/30'
                    : 'bg-gray-100 text-gray-400'
                ]"
                :style="votes[categories[activeTab].id] ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''"
              >
                Next Category →
              </button>
              <button
                v-else
                @click="goToConfirm"
                :class="[
                  'flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all',
                  totalVoted === categories.length
                    ? 'text-white shadow-xl shadow-gold/40'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                ]"
                :style="totalVoted === categories.length ? 'background: linear-gradient(90deg, #b8860b, #d4af37)' : ''"
                :disabled="totalVoted < categories.length"
              >
                Review & Submit 🌾
              </button>
            </div>
            <p v-if="submitError" class="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-2xl p-3 border border-red-100">
              {{ submitError }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- ── REVIEW STEP ── -->
    <div v-if="step === 'confirm'" class="py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <div class="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-xl" style="background: linear-gradient(135deg, #b8860b, #d4af37)">
            <span class="text-4xl">📋</span>
          </div>
          <h1 class="font-playfair text-3xl font-black text-navy mb-2">Review Your Votes</h1>
          <div class="catholic-divider"><span class="text-gold text-base">✦</span></div>
          <p class="text-gray-500 text-sm mt-3">Confirm your selections before final submission.</p>
        </div>

        <div class="space-y-3 mb-6">
          <div v-for="cat in categories" :key="cat.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-gold/30 transition-all"
          >
            <div class="flex items-center gap-4 p-4">
              <div class="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-gold/30 shadow-sm">
                <img v-if="getVotedContestant(cat)?.photo" :src="getVotedContestant(cat)!.photo" :alt="getVotedContestant(cat)!.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-2xl" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">{{ cat.icon }}</div>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[10px] text-gold uppercase tracking-widest font-black">{{ cat.label }}</p>
                <p class="font-playfair font-bold text-navy mt-0.5 truncate">{{ getVotedContestant(cat)?.name }}</p>
                <p class="text-xs text-gray-400 truncate">{{ getVotedContestant(cat)?.tagline }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <div class="w-7 h-7 rounded-full bg-green-500 flex items-center justify-center text-white text-xs font-black">✓</div>
                <button @click="step = 'vote'; activeTab = categories.findIndex(c => c.id === cat.id)" class="text-xs text-gold hover:text-navy font-bold transition-colors">Edit</button>
              </div>
            </div>
          </div>
        </div>

        <div class="rounded-2xl p-4 mb-6 flex items-start gap-3 border" style="background: #fffbeb; border-color: #fcd34d">
          <span class="text-xl shrink-0">⚠️</span>
          <p class="text-amber-700 text-xs leading-relaxed">Once submitted, your vote cannot be changed. Please make sure all your selections are correct.</p>
        </div>

        <div class="flex gap-3">
          <button @click="step = 'vote'" class="flex-1 py-4 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold hover:border-navy transition-all text-sm bg-white">← Go Back</button>
          <button @click="submitVotes" class="flex-1 py-4 rounded-2xl text-white font-black transition-all text-sm shadow-xl shadow-gold/30" style="background: linear-gradient(90deg, #b8860b, #d4af37)">
            Submit Final Vote 🌾
          </button>
        </div>
      </div>
    </div>

    <!-- ── SUCCESS STEP ── -->
    <div v-if="step === 'done'" class="py-20 px-4 text-center">
      <div class="max-w-md mx-auto">
        <!-- Animated success icon -->
        <div class="relative inline-block mb-8">
          <div class="w-32 h-32 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-gold/40 animate-float" style="background: linear-gradient(135deg, #b8860b, #d4af37, #f5e27a)">
            <span class="text-6xl">🌾</span>
          </div>
          <div class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <span class="text-white text-lg font-black">✓</span>
          </div>
        </div>

        <h1 class="font-playfair text-5xl font-black text-navy mb-2">Thank You!</h1>
        <p class="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Vote Submitted Successfully</p>
        <div class="catholic-divider mb-5"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 mb-2 text-sm leading-relaxed max-w-sm mx-auto">
          Your votes for the <strong class="text-navy">Harvest Festival 2026</strong> have been recorded. May God bless our celebration!
        </p>
        <p class="text-gray-400 text-xs mb-8 italic">"Give thanks to the Lord, for He is good; His love endures forever." — Psalm 107:1</p>

        <!-- Summary chips -->
        <div class="flex flex-wrap gap-2 justify-center mb-8">
          <div v-for="cat in categories" :key="cat.id"
            class="flex items-center gap-2 rounded-2xl px-4 py-2 border border-gold/30 shadow-sm"
            style="background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))"
          >
            <span class="text-base">{{ cat.icon }}</span>
            <div class="text-left">
              <p class="text-[9px] text-gold uppercase tracking-widest font-bold">{{ cat.label }}</p>
              <p class="text-xs font-bold text-navy">{{ getVotedContestant(cat)?.name }}</p>
            </div>
          </div>
        </div>

        <NuxtLink to="/" class="inline-block px-10 py-4 rounded-2xl text-white font-black hover:shadow-2xl transition-all shadow-xl shadow-gold/30" style="background: linear-gradient(90deg, #b8860b, #d4af37)">
          Back to Home ✝
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useScrollReveal()

const step = ref<'vote' | 'confirm' | 'done'>('vote')
const activeTab = ref(0)
const submitError = ref('')
const votes = reactive<Record<string, string>>({})

const categories = [
  {
    id: 'face',
    label: 'Face of Harvest',
    icon: '👑',
    contestants: [
      { id: 'f1', number: 1, name: 'Miss Chimamanda Lawrence', tagline: '📞 08087350321', photo: '/foh-chimamanda.jpg' },
      { id: 'f2', number: 2, name: 'Miss Emmanuelle Moses', tagline: '📞 07039730834', photo: '/foh-emmanuelle.jpg' },
      { id: 'f3', number: 3, name: 'Mr. Sebastian Felix', tagline: 'Face of Harvest', photo: '/foh-sebastian.jpg' },
      { id: 'f4', number: 4, name: 'Master John Agim', tagline: 'Face of Harvest', photo: '/foh-john.jpg' },
      { id: 'f5', number: 5, name: 'Master Iyeakachukwu Ugochukwu', tagline: 'Face of Harvest', photo: '/foh-iyeaka.jpg' },
      { id: 'f6', number: 6, name: 'Omaguvwe Peace Oghenero', tagline: 'St. Patrick Edo/Delta', photo: '/foh-peace.jpg' },
      { id: 'f7', number: 7, name: 'Onwumelu Omerebere Clare', tagline: 'CYON', photo: '/foh-clare.jpg' },
      { id: 'f8', number: 8, name: 'Mrs. Blessing Obiora', tagline: 'Face of Harvest', photo: '/foh-blessing.jpg' },
      { id: 'f9', number: 9, name: 'Uzuegbuna Felicity Chidinma', tagline: '📞 09045411265 · Voice of Saints Choir', photo: '/foh-felicity.jpg' },
    ],
  },
  {
    id: 'king',
    label: 'King of Harvest',
    icon: '🤴',
    contestants: [
      { id: 'k1', number: 1, name: 'Mr. Jonathan Dodo', tagline: 'King of Harvest', photo: '/koh-jonathan.jpg' },
      { id: 'k2', number: 2, name: 'Paul Djukpan', tagline: 'St. Patrick Edo/Delta', photo: '/koh-paul.jpg' },
    ],
  },
  {
    id: 'queen',
    label: 'Queen of Harvest',
    icon: '👸',
    contestants: [
      { id: 'q1', number: 1, name: 'Mrs. Queen Ogbodo', tagline: 'Queen of Harvest', photo: '/qoh-queen.jpg' },
      { id: 'q2', number: 2, name: 'Mrs. Veronica Aboi', tagline: 'Queen of Harvest', photo: '/qoh-veronica.jpg' },
      { id: 'q3', number: 3, name: 'Mrs. Elizabeth Akuezue', tagline: '📞 08053258408', photo: '/qoh-elizabeth.jpg' },
      { id: 'q4', number: 4, name: 'Mrs. Gladys Origbo Onome', tagline: 'Queen of Harvest', photo: '/qoh-gladys.jpg' },
      { id: 'q5', number: 5, name: 'Oghenekevwe Patience Godwin', tagline: 'St. Patrick Edo/Delta', photo: '/qoh-patience.jpg' },
    ],
  },
  {
    id: 'prince',
    label: 'Prince of Harvest',
    icon: '🫅',
    contestants: [
      { id: 'p1', number: 1, name: 'Peter Yohanna Akpajeshi', tagline: 'Prince of Harvest', photo: '/proh-peter.jpg' },
      { id: 'p2', number: 2, name: 'Andrew Kelechi', tagline: 'Prince of Harvest', photo: '/proh-andrew.jpg' },
      { id: 'p3', number: 3, name: 'Okpara Franklin', tagline: '📞 07061668284 · Holy Trinity Igbo Youth', photo: '/proh-franklin.jpg' },
      { id: 'p4', number: 4, name: 'Sunday Wisdom', tagline: 'Blessed Iwene Tansi', photo: '/proh-sunday.jpg' },
      { id: 'p5', number: 5, name: 'Ukam Emmanuel Chukwuemeka', tagline: 'Prince of Harvest', photo: '/proh-ukam.jpg' },
    ],
  },
  {
    id: 'princess',
    label: 'Princess of Harvest',
    icon: '🌸',
    contestants: [
      { id: 'pr1', number: 1, name: 'Miss Joyce Gomerep', tagline: 'Princess of Harvest', photo: '/poh-joyce.jpg' },
      { id: 'pr2', number: 2, name: 'Miss Joan Okwuchi', tagline: 'Princess of Harvest', photo: '/poh-joan.jpg' },
      { id: 'pr3', number: 3, name: 'Miss Chioma Aniagboso', tagline: 'Princess of Harvest', photo: '/poh-chioma.jpg' },
      { id: 'pr4', number: 4, name: 'Grace Enyo-Ojo Okpanachi', tagline: 'Princess of Harvest', photo: '/poh-grace.jpg' },
      { id: 'pr5', number: 5, name: 'Eleme Lilian Chidera', tagline: 'Princess of Harvest', photo: '/poh-eleme.jpg' },
      { id: 'pr6', number: 6, name: 'Jaelynn Ebeyin Ikwen', tagline: 'Princess of Harvest', photo: '/poh-jaelynn.jpg' },
      { id: 'pr7', number: 7, name: 'Chukwunonso Anthonia Chidimma', tagline: 'Princess of Harvest', photo: '/poh-chukwunonso.jpg' },
      { id: 'pr8', number: 8, name: 'Omeje Chinecherem', tagline: '📞 08147566658 · Holy Trinity Igbo Youth', photo: '/poh-omeje.jpg' },
      { id: 'pr9', number: 9, name: 'Obayi Emmanuella Somtochukwu', tagline: 'Blessed Iwene Tansi', photo: '/poh-emmanuella.jpg' },
      { id: 'pr10', number: 10, name: 'Princess Oluwasindara Lucy Adodo', tagline: 'St. Michael Yoruba Catholic Community', photo: '/poh-oluwasindara.jpg' },
      { id: 'pr11', number: 11, name: 'Josephine Bonet', tagline: 'Princess of Harvest', photo: '/poh-josephine.jpg' },
      { id: 'pr12', number: 12, name: 'Maia Kosisochukwu', tagline: 'Princess of Harvest', photo: '/poh-maia.jpg' },
    ],
  },
]

const totalVoted = computed(() => Object.keys(votes).length)

function castVote(categoryId: string, contestantId: string) {
  votes[categoryId] = contestantId
}

function getVotedContestant(cat: typeof categories[0]) {
  return cat.contestants.find(c => c.id === votes[cat.id])
}

function goToConfirm() {
  if (totalVoted.value < categories.length) {
    submitError.value = 'Please vote in all 5 categories before submitting.'
    return
  }
  submitError.value = ''
  step.value = 'confirm'
}

function submitVotes() {
  step.value = 'done'
}
</script>

<style scoped>
.tab-slide-enter-active,
.tab-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.grain-texture { background-color: transparent; background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px); }
</style>
