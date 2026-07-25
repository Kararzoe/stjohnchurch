<template>
  <div class="min-h-screen bg-cream pt-24 pb-16 px-6">
    <div class="max-w-2xl mx-auto">

      <!-- Login step -->
      <div v-if="step === 'login'" class="reveal">
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-full bg-navy flex items-center justify-center mx-auto mb-4">
            <span class="text-gold-light text-2xl">🔑</span>
          </div>
          <h1 class="font-playfair text-3xl font-bold text-navy mb-2">Member Login</h1>
          <p class="text-gray-500 text-sm">Enter the credentials provided by the parish office</p>
        </div>
        <div class="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <form class="space-y-4" @submit.prevent="login">
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Member ID</label>
              <input v-model="form.memberId" type="text" placeholder="e.g. SJC-2026-001"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input v-model="form.password" type="password" placeholder="Your password"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
            <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
            <button type="submit"
              class="w-full py-4 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30">
              Login to Vote →
            </button>
          </form>
          <p class="text-center text-xs text-gray-400 mt-4">
            Don't have credentials? Contact the parish office.
          </p>
        </div>
      </div>

      <!-- Voting step -->
      <div v-if="step === 'vote'">
        <div class="text-center mb-8 reveal">
          <h1 class="font-playfair text-3xl font-bold text-navy mb-2">Parish Council Elections 2026</h1>
          <p class="text-gray-500 text-sm">Select one candidate per position. You cannot change your vote after submitting.</p>
        </div>

        <div class="space-y-8">
          <div v-for="(pos, i) in positions" :key="pos.title" :class="`reveal delay-${(i + 1) * 100}`">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 class="font-playfair font-bold text-navy text-xl mb-4 flex items-center gap-2">
                <span class="w-7 h-7 rounded-full bg-gold text-white text-xs flex items-center justify-center font-bold">{{ i + 1 }}</span>
                {{ pos.title }}
              </h2>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  v-for="c in pos.candidates"
                  :key="c.name"
                  :class="[
                    'flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all',
                    votes[pos.title] === c.name
                      ? 'border-gold bg-gold/5 shadow-md'
                      : 'border-gray-100 hover:border-gold/40'
                  ]"
                  @click="votes[pos.title] = c.name"
                >
                  <div class="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center shrink-0 text-lg">
                    {{ c.icon }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-semibold text-navy text-sm">{{ c.name }}</p>
                    <p class="text-gray-400 text-xs truncate">{{ c.desc }}</p>
                  </div>
                  <div :class="['w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all', votes[pos.title] === c.name ? 'border-gold bg-gold' : 'border-gray-300']">
                    <span v-if="votes[pos.title] === c.name" class="text-white text-xs">✓</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 reveal">
          <p v-if="submitError" class="text-red-500 text-sm text-center mb-4">{{ submitError }}</p>
          <button
            class="w-full py-4 rounded-full bg-gold text-white font-semibold text-lg hover:bg-gold-light transition-all hover:shadow-xl hover:shadow-gold/40 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="!allVoted"
            @click="submitVotes"
          >
            Submit My Votes ✅
          </button>
          <p class="text-center text-xs text-gray-400 mt-3">
            {{ Object.keys(votes).length }} of {{ positions.length }} positions selected
          </p>
        </div>
      </div>

      <!-- Success step -->
      <div v-if="step === 'done'" class="text-center py-16 reveal">
        <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <span class="text-4xl">✅</span>
        </div>
        <h1 class="font-playfair text-4xl font-bold text-navy mb-4">Vote Submitted!</h1>
        <p class="text-gray-500 mb-8 max-w-sm mx-auto">
          Thank you for participating. Your vote has been recorded securely.
          Results will be announced by the parish admin.
        </p>
        <NuxtLink to="/"
          class="inline-block px-8 py-3 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all">
          Back to Home
        </NuxtLink>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
useScrollReveal()

const step = ref<'login' | 'vote' | 'done'>('login')
const form = reactive({ memberId: '', password: '' })
const error = ref('')
const submitError = ref('')
const votes = reactive<Record<string, string>>({})

const positions = [
  {
    title: 'Chairman',
    candidates: [
      { name: 'Candidate A', desc: 'Parish member since 2010', icon: '👤' },
      { name: 'Candidate B', desc: 'Parish member since 2008', icon: '👤' },
    ],
  },
  {
    title: 'Secretary',
    candidates: [
      { name: 'Candidate C', desc: 'Parish member since 2015', icon: '👤' },
      { name: 'Candidate D', desc: 'Parish member since 2012', icon: '👤' },
    ],
  },
  {
    title: 'Treasurer',
    candidates: [
      { name: 'Candidate E', desc: 'Parish member since 2009', icon: '👤' },
      { name: 'Candidate F', desc: 'Parish member since 2014', icon: '👤' },
    ],
  },
  {
    title: 'PRO',
    candidates: [
      { name: 'Candidate G', desc: 'Parish member since 2016', icon: '👤' },
      { name: 'Candidate H', desc: 'Parish member since 2011', icon: '👤' },
    ],
  },
]

const allVoted = computed(() => Object.keys(votes).length === positions.length)

function login() {
  if (!form.memberId || !form.password) {
    error.value = 'Please enter your Member ID and password.'
    return
  }
  // Demo: accept any credentials — real auth handled by backend
  error.value = ''
  step.value = 'vote'
}

function submitVotes() {
  if (!allVoted.value) {
    submitError.value = 'Please vote for all positions before submitting.'
    return
  }
  submitError.value = ''
  step.value = 'done'
}
</script>
