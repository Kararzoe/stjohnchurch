<template>
  <div class="min-h-screen bg-cream">

    <!-- ── HERO ── -->
    <section class="relative h-[42vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="/church-interior.jpg" alt="Harvest" class="w-full h-full object-cover object-center" />
      </div>
      <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(26,39,68,0.88) 0%, rgba(26,39,68,0.65) 50%, rgba(26,39,68,0.92) 100%)" />
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 60%, rgba(212,175,55,0.25) 0%, transparent 65%)" />

      <div class="relative z-10 text-center px-4">
        <div class="animate-float inline-block mb-3">
          <div class="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold/50 flex items-center justify-center mx-auto">
            <span class="text-2xl">🌾</span>
          </div>
        </div>
        <p class="section-label text-center">St. John of the Cross</p>
        <h1 class="font-playfair text-4xl sm:text-6xl font-black text-white leading-tight">
          Harvest Festival
          <span class="block gold-text">2025 Voting</span>
        </h1>
        <p class="text-gray-300 text-sm mt-3 max-w-md mx-auto">
          Cast your vote for your favourite contestants across all five categories
        </p>
      </div>

      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
      </div>
    </section>

    <!-- ── VOTING AREA ── -->
    <div v-if="step === 'vote'" class="py-12 px-4">
      <div class="max-w-5xl mx-auto">

        <!-- Progress bar -->
        <div class="mb-8">
          <div class="flex items-center justify-between mb-2">
            <p class="text-xs text-gray-400 font-medium uppercase tracking-widest">Your Progress</p>
            <p class="text-xs font-bold text-gold">{{ totalVoted }} / {{ categories.length }} categories voted</p>
          </div>
          <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-gold to-yellow-400 rounded-full transition-all duration-500"
              :style="`width: ${(totalVoted / categories.length) * 100}%`"
            />
          </div>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            @click="activeTab = i"
            :class="[
              'flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-300 shrink-0 border-2',
              activeTab === i
                ? 'bg-navy text-white border-navy shadow-lg shadow-navy/30'
                : votes[cat.id]
                  ? 'bg-gold/10 text-gold border-gold/40'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-gold/40'
            ]"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
            <span v-if="votes[cat.id]" class="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-white text-[10px]">✓</span>
          </button>
        </div>

        <!-- Active category panel -->
        <transition name="tab-slide" mode="out-in">
          <div :key="activeTab">
            <div class="text-center mb-6">
              <div class="inline-flex items-center gap-3 bg-navy text-white px-6 py-3 rounded-2xl shadow-lg shadow-navy/20">
                <span class="text-2xl">{{ categories[activeTab].icon }}</span>
                <div class="text-left">
                  <p class="text-xs text-gold uppercase tracking-widest font-semibold">Category {{ activeTab + 1 }} of {{ categories.length }}</p>
                  <h2 class="font-playfair font-bold text-lg leading-tight">{{ categories[activeTab].label }}</h2>
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
                  'relative rounded-2xl overflow-hidden border-2 transition-all duration-300 text-left group',
                  votes[categories[activeTab].id] === contestant.id
                    ? 'border-gold shadow-xl shadow-gold/30 scale-[1.03]'
                    : 'border-gray-200 hover:border-gold/50 hover:shadow-lg hover:-translate-y-1'
                ]"
              >
                <!-- Photo -->
                <div class="relative aspect-[3/4] bg-navy/10 overflow-hidden">
                  <img
                    v-if="contestant.photo"
                    :src="contestant.photo"
                    :alt="contestant.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-navy/10 to-gold/10">
                    <span class="text-5xl mb-2">{{ categories[activeTab].icon }}</span>
                    <span class="text-xs text-gray-400">No photo</span>
                  </div>

                  <!-- Contestant number badge -->
                  <div class="absolute top-2 left-2 w-7 h-7 rounded-full bg-navy/80 text-white text-xs font-bold flex items-center justify-center">
                    {{ contestant.number }}
                  </div>

                  <!-- Selected overlay -->
                  <div
                    v-if="votes[categories[activeTab].id] === contestant.id"
                    class="absolute inset-0 bg-gold/20 flex items-center justify-center"
                  >
                    <div class="w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg">
                      <span class="text-white text-xl font-bold">✓</span>
                    </div>
                  </div>

                  <!-- Gold shimmer on hover -->
                  <div class="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" />
                </div>

                <!-- Info -->
                <div class="p-3 bg-white">
                  <p class="font-playfair font-bold text-navy text-sm leading-tight">{{ contestant.name }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ contestant.tagline }}</p>
                  <div
                    :class="[
                      'mt-2 text-xs font-semibold px-2 py-0.5 rounded-full inline-block transition-all',
                      votes[categories[activeTab].id] === contestant.id
                        ? 'bg-gold text-white'
                        : 'bg-gray-100 text-gray-400'
                    ]"
                  >
                    {{ votes[categories[activeTab].id] === contestant.id ? '✓ Your Vote' : 'Tap to Vote' }}
                  </div>
                </div>
              </button>
            </div>

            <!-- Category nav -->
            <div class="flex items-center justify-between">
              <button
                v-if="activeTab > 0"
                @click="activeTab--"
                class="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold text-sm hover:border-navy transition-all"
              >
                ← Previous
              </button>
              <div v-else />

              <button
                v-if="activeTab < categories.length - 1"
                @click="activeTab++"
                :class="[
                  'flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all',
                  votes[categories[activeTab].id]
                    ? 'bg-navy text-white hover:bg-navy/90 shadow-lg'
                    : 'bg-gray-200 text-gray-400'
                ]"
              >
                Next Category →
              </button>

              <button
                v-else
                @click="goToConfirm"
                :class="[
                  'flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all',
                  totalVoted === categories.length
                    ? 'bg-gold text-white hover:bg-gold-light shadow-lg shadow-gold/30'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                ]"
                :disabled="totalVoted < categories.length"
              >
                Review & Submit 🌾
              </button>
            </div>

            <p v-if="submitError" class="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-xl p-3">
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
          <div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <span class="text-3xl">📋</span>
          </div>
          <h1 class="font-playfair text-3xl font-bold text-navy mb-2">Review Your Votes</h1>
          <div class="catholic-divider"><span class="text-gold text-base">✦</span></div>
          <p class="text-gray-500 text-sm mt-3">Confirm your selections before final submission.</p>
        </div>

        <div class="space-y-3 mb-6">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
          >
            <div class="flex items-center gap-4 p-4">
              <!-- Contestant photo thumbnail -->
              <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 border-2 border-gold/30">
                <img
                  v-if="getVotedContestant(cat)?.photo"
                  :src="getVotedContestant(cat)!.photo"
                  :alt="getVotedContestant(cat)!.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full bg-gold/10 flex items-center justify-center text-2xl">
                  {{ cat.icon }}
                </div>
              </div>

              <div class="flex-1 min-w-0">
                <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ cat.label }}</p>
                <p class="font-playfair font-bold text-navy mt-0.5">{{ getVotedContestant(cat)?.name }}</p>
                <p class="text-xs text-gray-400">{{ getVotedContestant(cat)?.tagline }}</p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="text-green-500 text-lg">✓</span>
                <button
                  @click="step = 'vote'; activeTab = categories.findIndex(c => c.id === cat.id)"
                  class="text-xs text-gold hover:text-navy transition-colors font-semibold"
                >
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span class="text-amber-500 text-lg shrink-0">⚠️</span>
          <p class="text-amber-700 text-xs leading-relaxed">
            Once submitted, your vote cannot be changed. Please make sure all your selections are correct.
          </p>
        </div>

        <div class="flex gap-3">
          <button
            @click="step = 'vote'"
            class="flex-1 py-3.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all text-sm"
          >
            ← Go Back
          </button>
          <button
            @click="submitVotes"
            class="flex-1 py-3.5 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30 text-sm"
          >
            Submit Final Vote 🌾
          </button>
        </div>
      </div>
    </div>

    <!-- ── SUCCESS STEP ── -->
    <div v-if="step === 'done'" class="py-20 px-4 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6 animate-float">
          <span class="text-5xl">🌾</span>
        </div>
        <h1 class="font-playfair text-4xl font-bold text-navy mb-3">Thank You!</h1>
        <div class="catholic-divider mb-4"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 mb-2 text-sm leading-relaxed max-w-sm mx-auto">
          Your votes for the <strong class="text-navy">Harvest Festival 2025</strong> have been recorded. May God bless our celebration!
        </p>
        <p class="text-gray-400 text-xs mb-8 italic">
          "Give thanks to the Lord, for He is good; His love endures forever." — Psalm 107:1
        </p>

        <!-- Summary chips -->
        <div class="flex flex-wrap gap-2 justify-center mb-8">
          <div
            v-for="cat in categories"
            :key="cat.id"
            class="flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-3 py-1.5"
          >
            <span class="text-sm">{{ cat.icon }}</span>
            <span class="text-xs font-semibold text-navy">{{ getVotedContestant(cat)?.name }}</span>
          </div>
        </div>

        <NuxtLink to="/"
          class="inline-block px-8 py-3.5 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40">
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
      { id: 'f1', number: 1, name: 'Chisom Okafor', tagline: 'Grace & Elegance', photo: '' },
      { id: 'f2', number: 2, name: 'Adaeze Nwosu', tagline: 'Faith & Beauty', photo: '' },
      { id: 'f3', number: 3, name: 'Blessing Eze', tagline: 'Joy & Radiance', photo: '' },
      { id: 'f4', number: 4, name: 'Ngozi Amadi', tagline: 'Poise & Devotion', photo: '' },
    ],
  },
  {
    id: 'king',
    label: 'King of Harvest',
    icon: '🤴',
    contestants: [
      { id: 'k1', number: 1, name: 'Emeka Chukwu', tagline: 'Strength & Honour', photo: '' },
      { id: 'k2', number: 2, name: 'Chidi Obi', tagline: 'Leadership & Faith', photo: '' },
      { id: 'k3', number: 3, name: 'Ikenna Eze', tagline: 'Courage & Service', photo: '' },
      { id: 'k4', number: 4, name: 'Obinna Nwachukwu', tagline: 'Wisdom & Integrity', photo: '' },
    ],
  },
  {
    id: 'queen',
    label: 'Queen of Harvest',
    icon: '👸',
    contestants: [
      { id: 'q1', number: 1, name: 'Uchenna Okonkwo', tagline: 'Virtue & Grace', photo: '' },
      { id: 'q2', number: 2, name: 'Amaka Igwe', tagline: 'Wisdom & Beauty', photo: '' },
      { id: 'q3', number: 3, name: 'Ifeoma Nwosu', tagline: 'Devotion & Charm', photo: '' },
      { id: 'q4', number: 4, name: 'Chinwe Onyeka', tagline: 'Purity & Strength', photo: '' },
    ],
  },
  {
    id: 'prince',
    label: 'Prince of Harvest',
    icon: '🫅',
    contestants: [
      { id: 'p1', number: 1, name: 'Tobechukwu Eze', tagline: 'Honour & Zeal', photo: '' },
      { id: 'p2', number: 2, name: 'Chukwuemeka Obi', tagline: 'Faith & Boldness', photo: '' },
      { id: 'p3', number: 3, name: 'Nnamdi Okafor', tagline: 'Talent & Devotion', photo: '' },
      { id: 'p4', number: 4, name: 'Kenechukwu Agu', tagline: 'Joy & Service', photo: '' },
    ],
  },
  {
    id: 'princess',
    label: 'Princess of Harvest',
    icon: '🌸',
    contestants: [
      { id: 'pr1', number: 1, name: 'Oluchi Nwosu', tagline: 'Sweetness & Light', photo: '' },
      { id: 'pr2', number: 2, name: 'Adanna Obi', tagline: 'Grace & Innocence', photo: '' },
      { id: 'pr3', number: 3, name: 'Chidinma Eze', tagline: 'Radiance & Faith', photo: '' },
      { id: 'pr4', number: 4, name: 'Somtochukwu Agu', tagline: 'Joy & Purity', photo: '' },
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
  transition: all 0.25s ease;
}
.tab-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.tab-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
