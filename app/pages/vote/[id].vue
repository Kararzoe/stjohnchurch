<template>
  <div class="min-h-screen bg-cream pt-24 pb-16 px-4">
    <div class="max-w-2xl mx-auto">

      <!-- Voting step -->
      <div v-if="step === 'vote'">
        <!-- Header -->
        <div class="text-center mb-8 reveal">
          <div class="w-14 h-14 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
            <span class="text-gold-light text-2xl">🗳️</span>
          </div>
          <h1 class="font-playfair text-3xl md:text-4xl font-bold text-navy mb-2">
            Parish Council Elections 2026
          </h1>
          <p class="text-gray-500 text-sm max-w-sm mx-auto">
            Select one candidate per position. Review your choices before submitting.
          </p>
          <!-- Progress -->
          <div class="mt-5 flex items-center justify-center gap-2">
            <div v-for="(pos, i) in positions" :key="pos.title"
              :class="['w-2.5 h-2.5 rounded-full transition-all', votes[pos.title] ? 'bg-gold scale-125' : 'bg-gray-300']" />
          </div>
          <p class="text-xs text-gray-400 mt-2">{{ Object.keys(votes).length }} of {{ positions.length }} positions selected</p>
        </div>

        <!-- Positions -->
        <div class="space-y-6">
          <div v-for="(pos, i) in positions" :key="pos.title" :class="`reveal delay-${(i + 1) * 100}`">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <!-- Position header -->
              <div class="bg-navy px-5 py-3 flex items-center gap-3">
                <span class="w-7 h-7 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold shrink-0">
                  {{ i + 1 }}
                </span>
                <h2 class="font-playfair font-bold text-white text-lg">{{ pos.title }}</h2>
                <span v-if="votes[pos.title]" class="ml-auto text-green-400 text-xs font-semibold flex items-center gap-1">
                  ✓ Selected
                </span>
              </div>

              <!-- Candidates -->
              <div class="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="c in pos.candidates"
                  :key="c.name"
                  :class="[
                    'flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all w-full',
                    votes[pos.title] === c.name
                      ? 'border-gold bg-gold/5 shadow-md'
                      : 'border-gray-100 hover:border-gold/40 hover:bg-gray-50'
                  ]"
                  @click="votes[pos.title] = c.name"
                >
                  <!-- Candidate photo/avatar -->
                  <div class="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2"
                    :class="votes[pos.title] === c.name ? 'border-gold' : 'border-gray-200'">
                    <img v-if="c.photo" :src="c.photo" :alt="c.name" class="w-full h-full object-cover" />
                    <div v-else class="w-full h-full bg-navy/10 flex items-center justify-center text-2xl">
                      👤
                    </div>
                  </div>

                  <!-- Info -->
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-navy text-sm">{{ c.name }}</p>
                    <p class="text-gray-400 text-xs mt-0.5">{{ c.desc }}</p>
                  </div>

                  <!-- Radio indicator -->
                  <div :class="[
                    'w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all',
                    votes[pos.title] === c.name ? 'border-gold bg-gold' : 'border-gray-300'
                  ]">
                    <span v-if="votes[pos.title] === c.name" class="text-white text-xs font-bold">✓</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="mt-8 reveal">
          <p v-if="submitError" class="text-red-500 text-sm text-center mb-4 bg-red-50 rounded-xl p-3">
            {{ submitError }}
          </p>
          <button
            :class="[
              'w-full py-4 rounded-full font-semibold text-base transition-all',
              allVoted
                ? 'bg-gold text-white hover:bg-gold-light hover:shadow-xl hover:shadow-gold/40'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            ]"
            :disabled="!allVoted"
            @click="goToConfirm"
          >
            Review & Submit Votes →
          </button>
          <p class="text-center text-xs text-gray-400 mt-3">
            You will be able to review your choices before final submission.
          </p>
        </div>
      </div>

      <!-- Confirm step -->
      <div v-if="step === 'confirm'" class="reveal">
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <span class="text-2xl">📋</span>
          </div>
          <h1 class="font-playfair text-3xl font-bold text-navy mb-2">Review Your Votes</h1>
          <p class="text-gray-500 text-sm">Please confirm your selections before submitting.</p>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          <div class="bg-navy px-5 py-3">
            <p class="text-white font-semibold text-sm">Parish Council Elections 2026</p>
          </div>
          <div class="divide-y divide-gray-50">
            <div v-for="pos in positions" :key="pos.title" class="flex items-center justify-between px-5 py-4">
              <div>
                <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ pos.title }}</p>
                <p class="font-bold text-navy mt-0.5">{{ votes[pos.title] }}</p>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-green-500 text-lg">✓</span>
                <button @click="step = 'vote'" class="text-xs text-gold hover:text-navy transition-colors font-medium">
                  Change
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span class="text-amber-500 text-lg shrink-0">⚠️</span>
          <p class="text-amber-700 text-xs leading-relaxed">
            Once submitted, your vote cannot be changed. Please make sure your selections are correct.
          </p>
        </div>

        <div class="flex gap-3">
          <button @click="step = 'vote'"
            class="flex-1 py-3.5 rounded-full border-2 border-gray-200 text-gray-600 font-semibold hover:border-gray-300 transition-all text-sm">
            ← Go Back
          </button>
          <button @click="submitVotes"
            class="flex-1 py-3.5 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30 text-sm">
            Submit Final Vote ✅
          </button>
        </div>
      </div>

      <!-- Success step -->
      <div v-if="step === 'done'" class="text-center py-16 reveal">
        <div class="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-5xl">✅</span>
        </div>
        <h1 class="font-playfair text-4xl font-bold text-navy mb-3">Vote Submitted!</h1>
        <div class="catholic-divider mb-4"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 mb-3 max-w-sm mx-auto text-sm leading-relaxed">
          Thank you for participating in the Parish Council Elections 2026.
          Your vote has been recorded securely.
        </p>
        <p class="text-gray-400 text-xs mb-8 italic">
          "Let all things be done decently and in order." — 1 Corinthians 14:40
        </p>
        <NuxtLink to="/"
          class="inline-block px-8 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all">
          Back to Home ✝
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

const step = ref<'vote' | 'confirm' | 'done'>('vote')
const submitError = ref('')
const votes = reactive<Record<string, string>>({})

const positions = [
  {
    title: 'Chairman',
    candidates: [
      { name: 'Candidate A', desc: 'Parish member since 2010', photo: '' },
      { name: 'Candidate B', desc: 'Parish member since 2008', photo: '' },
    ],
  },
  {
    title: 'Secretary',
    candidates: [
      { name: 'Candidate C', desc: 'Parish member since 2015', photo: '' },
      { name: 'Candidate D', desc: 'Parish member since 2012', photo: '' },
    ],
  },
  {
    title: 'Treasurer',
    candidates: [
      { name: 'Candidate E', desc: 'Parish member since 2009', photo: '' },
      { name: 'Candidate F', desc: 'Parish member since 2014', photo: '' },
    ],
  },
  {
    title: 'PRO',
    candidates: [
      { name: 'Candidate G', desc: 'Parish member since 2016', photo: '' },
      { name: 'Candidate H', desc: 'Parish member since 2011', photo: '' },
    ],
  },
]

const allVoted = computed(() => Object.keys(votes).length === positions.length)

function goToConfirm() {
  if (!allVoted.value) {
    submitError.value = 'Please select a candidate for every position before continuing.'
    return
  }
  submitError.value = ''
  step.value = 'confirm'
}

function submitVotes() {
  step.value = 'done'
}
</script>
