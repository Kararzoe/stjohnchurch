<template>
  <div class="min-h-screen bg-cream">

    <!-- ── CLOSED ── -->
    <div v-if="!harvestActive" class="py-32 px-4 text-center">
      <div class="max-w-md mx-auto">
        <div class="text-6xl mb-6">🌾</div>
        <h1 class="font-playfair text-4xl font-black text-navy mb-3">Voting is Closed</h1>
        <div class="catholic-divider mb-5"><span class="text-gold text-base">✦</span></div>
        <p class="text-gray-500 text-sm leading-relaxed mb-8">The Harvest voting season is not currently active. Please check back later or contact the parish for more information.</p>
        <NuxtLink to="/" class="inline-block px-8 py-4 rounded-xl text-white font-black shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">Back to Home</NuxtLink>
      </div>
    </div>

    <!-- ── HERO ── -->
    <section v-if="harvestActive" class="relative h-[55vh] flex items-center justify-center overflow-hidden">
      <div class="absolute inset-0">
        <img src="/church-interior.jpg" alt="Harvest" class="w-full h-full object-cover object-center scale-105" />
      </div>
      <div class="absolute inset-0" style="background: linear-gradient(135deg, rgba(26,39,68,0.95) 0%, rgba(26,39,68,0.6) 50%, rgba(139,90,0,0.85) 100%)" />
      <div class="absolute inset-0" style="background: radial-gradient(ellipse at 50% 70%, rgba(212,175,55,0.35) 0%, transparent 60%)" />
      <div class="absolute inset-0 opacity-20 grain-texture" />
      <div class="relative z-10 text-center px-4">
        <div class="flex items-center justify-center gap-6 mb-5">
          <img src="/logo-stjohn.jpg" alt="St. John of the Cross" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold/60 shadow-lg" />
          <img src="/logo-osa.jpg" alt="Order of Saint Augustine" class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gold/60 shadow-lg" />
        </div>
        <p class="text-gold text-xs uppercase tracking-[0.4em] font-semibold mb-3">St. John of the Cross Catholic Church</p>
        <h1 class="font-playfair text-5xl sm:text-7xl font-black text-white leading-tight drop-shadow-2xl">
          <span class="block" style="background: linear-gradient(90deg, #d4af37, #f5e27a, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">{{ contestTitle }}</span>
        </h1>
        <div class="flex items-center justify-center gap-3 mt-4">
          <div class="h-px w-16 bg-gold/40" />
          <span class="text-gold text-lg">✦</span>
          <div class="h-px w-16 bg-gold/40" />
        </div>
        <p class="text-gray-300 text-sm mt-3 max-w-md mx-auto leading-relaxed">{{ contestSubtitle }}</p>
      </div>
      <div class="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none"><path d="M0 80L1440 80L1440 30C1200 80 960 10 720 30C480 50 240 0 0 30L0 80Z" fill="#faf8f3"/></svg>
      </div>
    </section>

    <!-- ── STEP: VOTE ── -->
    <div v-if="harvestActive && step === 'vote'" class="py-10 px-4">
      <div class="max-w-5xl mx-auto">

        <!-- Progress -->
        <div class="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div class="flex items-center justify-between mb-3">
            <p class="text-xs text-gray-400 font-semibold uppercase tracking-widest">Your Progress</p>
            <p class="text-xs font-black text-gold">{{ totalVoted }} of {{ categories.length }} categories voted</p>
          </div>
          <div class="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-700" :style="`width: ${categories.length ? (totalVoted / categories.length) * 100 : 0}%; background: linear-gradient(90deg, #b8860b, #d4af37)`" />
          </div>
        </div>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button v-for="(cat, i) in categories" :key="cat.id" @click="activeTab = i"
            :class="['px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 border-2',
              activeTab === i ? 'text-white border-transparent shadow-lg' : votes[cat.id] ? 'bg-gold/10 text-gold border-gold/40' : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy']"
            :style="activeTab === i ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''"
          >
            {{ cat.label }}<span v-if="votes[cat.id]" class="ml-1 text-green-500 font-black">✓</span>
          </button>
        </div>

        <!-- Active category -->
        <transition name="tab-slide" mode="out-in">
          <div :key="activeTab">
            <div class="relative mb-6 rounded-2xl overflow-hidden" style="background: linear-gradient(135deg, #1a2744 0%, #2d4a8a 100%)">
              <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 24px 24px;" />
              <div class="relative flex items-center justify-between px-6 py-4">
                <div>
                  <p class="text-gold text-xs uppercase tracking-[0.3em] font-bold">Category {{ activeTab + 1 }} of {{ categories.length }}</p>
                  <h2 class="font-playfair font-black text-white text-xl leading-tight">{{ categories[activeTab]?.label }}</h2>
                  <p class="text-gray-400 text-xs mt-0.5">{{ categories[activeTab]?.contestants.length }} contestants &mdash; tap a card to vote</p>
                </div>
                <div v-if="votes[categories[activeTab]?.id]" class="text-right">
                  <p class="text-green-400 text-xs font-bold uppercase tracking-widest">✓ Selected</p>
                </div>
              </div>
            </div>

            <!-- Contestant cards -->
            <div class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              <div v-for="contestant in categories[activeTab]?.contestants ?? []" :key="contestant.id"
                @click="selectContestant(categories[activeTab].id, contestant)"
                :class="['relative rounded-2xl overflow-hidden text-left group transition-all duration-300 bg-white flex flex-col cursor-pointer',
                  votes[categories[activeTab].id] === contestant.id ? 'ring-2 ring-gold shadow-xl shadow-gold/20' : 'shadow-sm border border-gray-100 hover:shadow-md hover:border-gold/30']"
              >
                <div class="relative w-full aspect-[3/4] overflow-hidden">
                  <img v-if="contestant.photo" :src="contestant.photo" :alt="contestant.name" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div v-else class="w-full h-full" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)" />
                  <div class="absolute top-2 left-2 w-7 h-7 rounded-full text-white text-xs font-black flex items-center justify-center" style="background: rgba(26,39,68,0.85)">{{ contestant.number }}</div>
                  <transition name="fade">
                    <div v-if="votes[categories[activeTab].id] === contestant.id" class="absolute inset-0 flex items-center justify-center" style="background: rgba(212,175,55,0.3)">
                      <div class="w-10 h-10 rounded-full flex items-center justify-center" style="background: #d4af37"><span class="text-white text-lg font-black">✓</span></div>
                    </div>
                  </transition>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <div class="absolute bottom-0 left-0 right-0 p-3">
                    <p class="font-playfair font-black text-white text-sm leading-tight">{{ contestant.name }}</p>
                  </div>
                </div>
                <div class="py-3 px-3 text-center text-sm font-black uppercase tracking-widest transition-all duration-300"
                  :style="votes[categories[activeTab].id] === contestant.id ? 'background: linear-gradient(90deg, #b8860b, #d4af37); color: white' : 'background: linear-gradient(135deg, #1a2744, #2d4a8a); color: white'">
                  {{ votes[categories[activeTab].id] === contestant.id ? '✓ Voted' : 'Vote' }}
                </div>
              </div>
            </div>

            <!-- Nav -->
            <div class="flex items-center justify-between gap-3">
              <button v-if="activeTab > 0" @click="activeTab--" class="flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-sm hover:border-navy hover:text-navy transition-all bg-white shadow-sm">← Previous</button>
              <div v-else />
              <button v-if="activeTab < categories.length - 1" @click="activeTab++"
                :class="['flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm', votes[categories[activeTab]?.id] ? 'text-white shadow-lg shadow-navy/30' : 'bg-gray-100 text-gray-400']"
                :style="votes[categories[activeTab]?.id] ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''">
                Next Category →
              </button>
              <button v-else @click="goToPayment"
                :class="['flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all', totalVoted === categories.length ? 'text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed']"
                :style="totalVoted === categories.length ? 'background: linear-gradient(90deg, #b8860b, #d4af37)' : ''"
                :disabled="totalVoted < categories.length">
                Proceed to Payment →
              </button>
            </div>
            <p v-if="submitError" class="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-2xl p-3 border border-red-100">{{ submitError }}</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- ── STEP: PAYMENT ── -->
    <div v-if="harvestActive && step === 'payment'" class="py-12 px-4">
      <div class="max-w-lg mx-auto space-y-5">

        <!-- Vote summary -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 class="font-playfair text-xl font-bold text-navy mb-4">Your Selections</h2>
          <div class="space-y-2">
            <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ cat.label }}</p>
              <p class="font-playfair font-bold text-navy text-sm">{{ getVotedContestant(cat)?.name }}</p>
            </div>
          </div>
        </div>

        <!-- Vote quantity -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Number of Votes (₦200 each)</label>
          <div class="flex items-center gap-4">
            <button @click="voteQty = Math.max(1, voteQty - 1)" class="w-11 h-11 rounded-xl border-2 border-gray-200 text-navy font-black text-xl hover:border-gold transition-all">−</button>
            <span class="flex-1 text-center font-playfair font-black text-3xl text-navy">{{ voteQty }}</span>
            <button @click="voteQty++" class="w-11 h-11 rounded-xl border-2 border-gray-200 text-navy font-black text-xl hover:border-gold transition-all">+</button>
          </div>
          <p class="text-center text-sm text-gold font-black mt-3">Total: ₦{{ (voteQty * 200).toLocaleString() }}</p>
        </div>

        <!-- Bank details -->
        <div class="rounded-2xl border-2 border-gold/30 p-5" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <p class="text-gold text-xs uppercase tracking-widest font-bold mb-4">Pay to any of these accounts</p>
          <div class="space-y-4">
            <div class="bg-white/10 rounded-xl p-4">
              <p class="text-gold text-[10px] uppercase tracking-widest font-bold mb-1">Access Bank</p>
              <p class="text-white font-playfair font-black text-lg">0044170761</p>
              <p class="text-gray-300 text-xs mt-0.5">St Johns Catholic Church</p>
            </div>
            <div class="bg-white/10 rounded-xl p-4">
              <p class="text-gold text-[10px] uppercase tracking-widest font-bold mb-1">Zenith Bank</p>
              <p class="text-white font-playfair font-black text-lg">1228639690</p>
              <p class="text-gray-300 text-xs mt-0.5">St John Of The Cross Cath Church Mararaba</p>
            </div>
          </div>
          <p class="text-gray-400 text-xs mt-4 leading-relaxed">Transfer exactly <strong class="text-gold">₦{{ (voteQty * 200).toLocaleString() }}</strong> and use your name as the transfer narration. Then fill in the form below.</p>
        </div>

        <!-- Reference form -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 class="font-playfair text-lg font-bold text-navy">Confirm Your Payment</h3>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
            <input v-model="payForm.name" type="text" placeholder="Your full name"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
            <input v-model="payForm.phone" type="tel" placeholder="08012345678"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bank Paid To *</label>
            <select v-model="payForm.bank" class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all">
              <option value="">Select bank</option>
              <option value="Access Bank">Access Bank</option>
              <option value="Zenith Bank">Zenith Bank</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Transaction Reference / Receipt No. *</label>
            <input v-model="payForm.reference" type="text" placeholder="e.g. FT25ABC123456"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            <p class="text-xs text-gray-400 mt-1">Find this on your bank app or SMS receipt after transfer.</p>
          </div>

          <p v-if="payError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ payError }}</p>

          <button @click="submitVotes" :disabled="submitting"
            class="w-full py-4 rounded-2xl text-white font-black text-base transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60"
            style="background: linear-gradient(90deg, #b8860b, #d4af37)">
            {{ submitting ? 'Submitting...' : 'Submit Vote for Verification' }}
          </button>
          <button @click="step = 'vote'" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all">← Back to Selections</button>
        </div>

      </div>
    </div>

    <!-- ── STEP: DONE ── -->
    <div v-if="harvestActive && step === 'done'" class="py-20 px-4 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <svg class="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 class="font-playfair text-5xl font-black text-navy mb-2">Submitted!</h1>
        <p class="text-gold font-semibold text-sm uppercase tracking-widest mb-4">Awaiting Verification</p>
        <div class="catholic-divider mb-5"><span class="text-gold text-base">✦</span></div>

        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <p class="text-amber-800 text-sm font-bold mb-1">⏳ What happens next?</p>
          <p class="text-amber-700 text-xs leading-relaxed">Our admin team will verify your payment reference against the bank records. Once confirmed, your vote will be approved and counted. This usually takes a few hours.</p>
        </div>

        <div class="space-y-2 mb-8">
          <div v-for="cat in categories" :key="cat.id" class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
            <p class="text-xs text-gray-400 uppercase tracking-widest font-semibold">{{ cat.label }}</p>
            <p class="font-playfair font-bold text-navy text-sm">{{ getVotedContestant(cat)?.name }}</p>
          </div>
        </div>

        <p class="text-gray-400 text-xs mb-8 italic">"Give thanks to the Lord, for He is good; His love endures forever." — Psalm 107:1</p>
        <NuxtLink to="/" class="inline-block px-10 py-4 rounded-xl text-white font-black hover:shadow-2xl transition-all shadow-lg" style="background: linear-gradient(90deg, #b8860b, #d4af37)">Back to Home</NuxtLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })
useScrollReveal()

const supabase = useSupabase()
const step = ref<'vote' | 'payment' | 'done'>('vote')
const activeTab = ref(0)
const submitError = ref('')
const votes = reactive<Record<string, string>>({})
const voteQty = ref(1)
const payError = ref('')
const submitting = ref(false)
const payForm = reactive({ name: '', phone: '', bank: '', reference: '' })

const contestTitle = ref('Harvest/Bazaar Thanksgiving 2026')
const contestSubtitle = ref('Cast your vote for your favourite contestants · St. John of the Cross & Order of St. Augustine')
const categories = ref<any[]>([])
const harvestActive = ref(true)

onMounted(async () => {
  const [{ data: contestants }, { data: cats }, { data: titleData }, { data: hd }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('contest_categories').select('*').order('sort_order'),
    supabase.from('site_content').select('key,value').in('key', ['contest_title', 'contest_subtitle']),
    supabase.from('site_content').select('value').eq('key', 'harvest_active').single(),
  ])
  harvestActive.value = hd ? hd.value === 'true' : true
  if (titleData) {
    titleData.forEach((r: any) => {
      if (r.key === 'contest_title') contestTitle.value = r.value
      if (r.key === 'contest_subtitle') contestSubtitle.value = r.value
    })
  }
  const grouped: Record<string, any[]> = {}
  for (const c of contestants ?? []) {
    if (!grouped[c.category]) grouped[c.category] = []
    grouped[c.category].push(c)
  }
  categories.value = (cats ?? [])
    .filter((cat: any) => grouped[cat.id]?.length)
    .map((cat: any) => ({ ...cat, contestants: grouped[cat.id] }))
})

const totalVoted = computed(() => Object.keys(votes).length)

function selectContestant(categoryId: string, contestant: any) {
  votes[categoryId] = contestant.id
  setTimeout(() => {
    if (activeTab.value < categories.value.length - 1) {
      activeTab.value++
    } else if (totalVoted.value === categories.value.length) {
      step.value = 'payment'
    }
  }, 400)
}

function getVotedContestant(cat: any) {
  return cat.contestants.find((c: any) => c.id === votes[cat.id])
}

function goToPayment() {
  if (totalVoted.value < categories.value.length) {
    submitError.value = 'Please select a contestant in every category before proceeding.'
    return
  }
  submitError.value = ''
  step.value = 'payment'
}

async function submitVotes() {
  if (!payForm.name) { payError.value = 'Please enter your full name.'; return }
  if (!payForm.phone) { payError.value = 'Please enter your phone number.'; return }
  if (!payForm.bank) { payError.value = 'Please select the bank you paid to.'; return }
  if (!payForm.reference) { payError.value = 'Please enter your transaction reference.'; return }

  submitting.value = true
  payError.value = ''

  const rows = categories.value.map(cat => ({
    voter_name: payForm.name,
    voter_phone: payForm.phone,
    bank: payForm.bank,
    reference: payForm.reference,
    qty: voteQty.value,
    amount: voteQty.value * 200,
    status: 'pending',
    category: cat.id,
    contestant_id: votes[cat.id],
    contestant_name: getVotedContestant(cat)?.name ?? '',
  }))

  const { error } = await supabase.from('votes').insert(rows)
  submitting.value = false

  if (error) { payError.value = error.message; return }
  step.value = 'done'
}
</script>

<style scoped>
.tab-slide-enter-active, .tab-slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.tab-slide-enter-from { opacity: 0; transform: translateX(30px); }
.tab-slide-leave-to { opacity: 0; transform: translateX(-30px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.grain-texture { background-color: transparent; background-image: repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 4px); }
</style>
