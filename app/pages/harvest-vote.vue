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
        <!-- Logos -->
        <div class="flex items-center justify-center gap-6 mb-5">
          <img src="/logo-stjohn.jpg" alt="St. John of the Cross" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold/60 shadow-lg" />
          <img src="/logo-osa.jpg" alt="Order of Saint Augustine" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold/60 shadow-lg" />
        </div>
        <p class="text-gold text-xs uppercase tracking-[0.4em] font-semibold mb-3">St. John of the Cross Catholic Church</p>
        <h1 class="font-playfair text-5xl sm:text-7xl font-black text-white leading-tight drop-shadow-2xl">
          Harvest/Bazaar
          <span class="block" style="background: linear-gradient(90deg, #d4af37, #f5e27a, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">Thanksgiving 2026</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gold/40" />
          <span class="text-gold text-lg">✦</span>
          <div class="h-px w-16 bg-gold/40" />
        </div>
        <p class="text-gray-300 text-sm mt-3 max-w-md mx-auto leading-relaxed">Cast your vote for your favourite contestants · St. John of the Cross &amp; Order of St. Augustine</p>
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
            <p class="text-xs font-black text-gold">{{ totalVoted }} of {{ categories.length }} categories voted</p>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :style="`width: ${(totalVoted / categories.length) * 100}%; background: linear-gradient(90deg, #b8860b, #d4af37)`" />
          </div>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button
            v-for="(cat, i) in categories"
            :key="cat.id"
            @click="activeTab = i"
            :class="[
              'px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 border-2',
              activeTab === i
                ? 'text-white border-transparent shadow-lg'
                : votes[cat.id]
                  ? 'bg-gold/10 text-gold border-gold/40'
                  : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy'
            ]"
            :style="activeTab === i ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''"
          >
            {{ cat.label }}
            <span v-if="votes[cat.id]" class="ml-1 text-green-500 font-black">✓</span>
          </button>
        </div>

        <!-- Active category panel -->
        <transition name="tab-slide" mode="out-in">
          <div :key="activeTab">
            <!-- Category header -->
            <div class="relative mb-6 rounded-2xl overflow-hidden" style="background: linear-gradient(135deg, #1a2744 0%, #2d4a8a 100%)">
              <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 24px 24px;" />
              <div class="relative flex items-center justify-between px-6 py-4">
                <div>
                  <p class="text-gold text-xs uppercase tracking-[0.3em] font-bold">Category {{ activeTab + 1 }} of {{ categories.length }}</p>
                  <h2 class="font-playfair font-black text-white text-xl leading-tight">{{ categories[activeTab].label }}</h2>
                  <p class="text-gray-400 text-xs mt-0.5">{{ categories[activeTab].contestants.length }} contestants &mdash; tap a card to cast your vote</p>
                </div>
                <div v-if="votes[categories[activeTab].id]" class="text-right">
                  <p class="text-green-400 text-xs font-bold uppercase tracking-widest">✓ Vote Cast</p>
                </div>
              </div>
            </div>

            <!-- Contestant cards -->
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div
                v-for="contestant in categories[activeTab].contestants"
                :key="contestant.id"
                @click="castVote(categories[activeTab].id, contestant)"
                :class="[
                  'relative rounded-2xl overflow-hidden text-left group transition-all duration-300 bg-white flex flex-col cursor-pointer',
                  votes[categories[activeTab].id] === contestant.id
                    ? 'ring-2 ring-gold shadow-xl shadow-gold/20'
                    : 'shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/30'
                ]"
              >
                <!-- Photo -->
                <div class="relative w-full aspect-[3/4] overflow-hidden">
                  <img
                    v-if="contestant.photo"
                    :src="contestant.photo"
                    :alt="contestant.name"
                    class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div v-else class="w-full h-full" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)" />

                  <!-- Number badge -->
                  <div class="absolute top-2 left-2 w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center" style="background: rgba(26,39,68,0.85)">
                    {{ contestant.number }}
                  </div>

                  <!-- Selected overlay -->
                  <transition name="fade">
                    <div v-if="votes[categories[activeTab].id] === contestant.id"
                      class="absolute inset-0 flex items-center justify-center"
                      style="background: rgba(212,175,55,0.3)"
                    >
                      <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: #d4af37">
                        <span class="text-white text-lg font-black">✓</span>
                      </div>
                    </div>
                  </transition>

                  <!-- Bottom gradient -->
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <p class="font-playfair font-black text-white text-sm leading-tight">{{ contestant.name }}</p>
                  </div>
                </div>

                <!-- Vote button -->
                <div
                  class="py-3 px-3 text-center text-sm font-black uppercase tracking-widest transition-all duration-300"
                  :style="votes[categories[activeTab].id] === contestant.id ? 'background: linear-gradient(90deg, #b8860b, #d4af37); color: white' : 'background: linear-gradient(135deg, #1a2744, #2d4a8a); color: white'"
                >
                  {{ votes[categories[activeTab].id] === contestant.id ? '✓ Voted' : 'Vote Now' }}
                </div>
              </div>
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
                  'flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all',
                  totalVoted === categories.length
                    ? 'text-white shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                ]"
                :style="totalVoted === categories.length ? 'background: linear-gradient(90deg, #b8860b, #d4af37)' : ''"
                :disabled="totalVoted < categories.length"
              >
                Review &amp; Submit
              </button>
            </div>
            <p v-if="submitError" class="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-2xl p-3 border border-red-100">
              {{ submitError }}
            </p>
          </div>
        </transition>
      </div>
    </div>

    <!-- ── PAYMENT STEP ── -->
    <div v-if="step === 'payment' && pendingVote" class="py-12 px-4">
      <div class="max-w-md mx-auto">

        <!-- Selected contestant summary -->
        <div class="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 mb-6">
          <div class="relative h-48 overflow-hidden">
            <img
              v-if="pendingVote.contestant.photo"
              :src="pendingVote.contestant.photo"
              :alt="pendingVote.contestant.name"
              class="w-full h-full object-cover object-top"
            />
            <div v-else class="w-full h-full" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)" />
            <div class="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
            <div class="absolute bottom-0 left-0 right-0 p-4">
              <p class="text-gold text-[10px] uppercase tracking-widest font-bold">{{ categories.find(c => c.id === pendingVote!.categoryId)?.label }}</p>
              <p class="font-playfair font-black text-white text-xl">{{ pendingVote.contestant.name }}</p>
              <p class="text-white/60 text-xs">{{ pendingVote.contestant.tagline }}</p>
            </div>
          </div>
          <div class="px-5 py-4 flex items-center gap-3 bg-gold/5 border-t border-gold/20">
            <div class="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
              <span class="text-gold text-sm">✦</span>
            </div>
            <p class="text-xs text-gray-600 leading-relaxed">Each vote costs <strong class="text-navy">₦200</strong>. You can vote multiple times to boost your contestant.</p>
          </div>
        </div>

        <!-- Payment form -->
        <div class="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <h2 class="font-playfair text-2xl font-bold text-navy mb-1">Complete Your Vote</h2>
          <p class="text-gray-400 text-xs mb-5">Fill in your details to proceed to payment</p>

          <div class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Number of Votes</label>
              <div class="flex items-center gap-3">
                <button @click="voteQty = Math.max(1, voteQty - 1)" class="w-10 h-10 rounded-xl border-2 border-gray-200 text-navy font-black text-lg hover:border-gold transition-all">−</button>
                <span class="flex-1 text-center font-playfair font-black text-2xl text-navy">{{ voteQty }}</span>
                <button @click="voteQty++" class="w-10 h-10 rounded-xl border-2 border-gray-200 text-navy font-black text-lg hover:border-gold transition-all">+</button>
              </div>
              <p class="text-center text-xs text-gold font-semibold mt-2">Total: ₦{{ (voteQty * 200).toLocaleString() }}</p>
            </div>

            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name</label>
              <input v-model="paymentForm.name" type="text" placeholder="Your full name"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>

            <p v-if="paymentError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ paymentError }}</p>

            <button @click="confirmPayment"
              class="w-full py-5 rounded-2xl text-white font-black text-xl transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 tracking-wide"
              style="background: linear-gradient(90deg, #b8860b, #d4af37)">
              Pay ₦{{ (voteQty * 200).toLocaleString() }} to Vote
            </button>
            <button @click="step = 'vote'" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all">
              ← Back to Contestants
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── REVIEW STEP ── -->
    <div v-if="step === 'confirm'" class="py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
            <svg class="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
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

        <div class="rounded-2xl p-4 mb-6 flex items-start gap-3 border border-amber-200 bg-amber-50">
          <svg class="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>
          <p class="text-amber-700 text-xs leading-relaxed">Once submitted, your vote cannot be changed. Please make sure all your selections are correct.</p>
        </div>

        <div class="flex gap-3">
          <button @click="step = 'vote'" class="flex-1 py-4 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:border-navy transition-all text-sm bg-white">← Go Back</button>
          <button @click="submitVotes" class="flex-1 py-4 rounded-xl text-white font-black transition-all text-sm shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">
            Submit Final Vote
          </button>
        </div>
      </div>
    </div>

    <!-- ── SUCCESS STEP ── -->
    <div v-if="step === 'done'" class="py-20 px-4 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <svg class="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 class="font-playfair text-5xl font-black text-navy mb-2">Thank You!</h1>
        <p class="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Vote Submitted Successfully</p>
        <div class="catholic-divider mb-5"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 mb-2 text-sm leading-relaxed max-w-sm mx-auto">
          Your votes for the <strong class="text-navy">Harvest Festival 2026</strong> have been recorded. May God bless our celebration!
        </p>
        <p class="text-gray-400 text-xs mb-8 italic">"Give thanks to the Lord, for He is good; His love endures forever." — Psalm 107:1</p>

        <div class="space-y-2 mb-8">
          <div v-for="cat in categories" :key="cat.id"
            class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm"
          >
            <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ cat.label }}</p>
            <p class="font-playfair font-bold text-navy text-sm">{{ getVotedContestant(cat)?.name }}</p>
          </div>
        </div>

        <NuxtLink to="/" class="inline-block px-10 py-4 rounded-xl text-white font-black hover:shadow-2xl transition-all shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">
          Back to Home
        </NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useScrollReveal()

const step = ref<'vote' | 'payment' | 'confirm' | 'done'>('vote')
const activeTab = ref(0)
const submitError = ref('')
const votes = reactive<Record<string, string>>({})

const pendingVote = ref<{ categoryId: string; contestant: any } | null>(null)

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

function castVote(categoryId: string, contestant: any) {
  pendingVote.value = { categoryId, contestant }
  step.value = 'payment'
}

const voteQty = ref(1)
const paymentError = ref('')
const paymentForm = reactive({ name: '' })

function confirmPayment() {
  if (!paymentForm.name) {
    paymentError.value = 'Please enter your name to continue.'
    return
  }
  paymentError.value = ''
  // TODO: trigger Paystack payment here
  // On success callback:
  votes[pendingVote.value!.categoryId] = pendingVote.value!.contestant.id
  pendingVote.value = null
  voteQty.value = 1
  paymentForm.name = ''
  // Move to next unvoted category or confirm
  const nextUnvoted = categories.findIndex(c => !votes[c.id])
  if (nextUnvoted !== -1) {
    activeTab.value = nextUnvoted
    step.value = 'vote'
  } else {
    step.value = 'confirm'
  }
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
