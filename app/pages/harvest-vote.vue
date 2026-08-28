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
    <section v-if="harvestActive && step === 'vote'" class="relative h-[55vh] flex items-center justify-center overflow-hidden">
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

        <!-- Countdown -->
        <ClientOnly>
        <div class="mb-8 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <p class="text-xs text-gray-400 font-semibold uppercase tracking-widest text-center mb-4">Voting ends in</p>
          <div class="flex items-center justify-center gap-3">
            <div v-for="unit in countdown" :key="unit.label" class="flex flex-col items-center flex-1">
              <div class="w-full py-3 rounded-xl flex items-center justify-center font-playfair font-black text-3xl text-white shadow-md" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                <span class="tabular-nums">{{ unit.value }}</span>
              </div>
              <p class="text-gold text-[10px] uppercase tracking-widest mt-1.5 font-bold">{{ unit.label }}</p>
            </div>
          </div>
        </div>
        </ClientOnly>

        <!-- Category tabs -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          <button v-for="(cat, i) in categories" :key="cat.id" @click="activeTab = i"
            :class="['px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 shrink-0 border-2 flex items-center gap-2',
              activeTab === i ? 'text-white border-transparent shadow-lg' : votes[cat.id] ? 'bg-gold/10 text-gold border-gold/40' : 'bg-white text-gray-500 border-gray-200 hover:border-navy hover:text-navy']"
            :style="activeTab === i ? 'background: linear-gradient(135deg, #1a2744, #2d4a8a)' : ''"
          >
            <span>{{ cat.label }}</span>
            <span :class="['text-xs font-black px-2 py-0.5 rounded-full', activeTab === i ? 'bg-white/20 text-gold-light' : 'bg-gray-100 text-gray-500']">
              {{ (categoryTotals[cat.id] ?? 0).toLocaleString() }} votes
            </span>
          </button>
        </div>

        <!-- Active category -->
        <transition name="tab-slide" mode="out-in">
          <div :key="activeTab">
            <div class="relative mb-6 rounded-2xl overflow-hidden shadow-sm" style="background: linear-gradient(135deg, #1a2744 0%, #2d4a8a 100%)">
              <div class="absolute inset-0 opacity-10" style="background-image: radial-gradient(circle, #d4af37 1px, transparent 1px); background-size: 24px 24px;" />
              <div class="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-5">
                <div>
                  <p class="text-gold text-xs uppercase tracking-[0.3em] font-bold">Category {{ activeTab + 1 }} of {{ categories.length }}</p>
                  <h2 class="font-playfair font-black text-white text-2xl leading-tight mt-0.5">{{ categories[activeTab]?.label }}</h2>
                  <p class="text-gray-300 text-xs mt-1">{{ categories[activeTab]?.contestants.length }} contestants &mdash; tap any card to vote</p>
                </div>
                <div class="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-gold/30 rounded-2xl px-4 py-2.5 self-start sm:self-auto shadow-inner">
                  <div class="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center text-lg">🗳️</div>
                  <div>
                    <p class="text-[10px] text-gold-light uppercase tracking-widest font-bold">Category Total</p>
                    <p class="text-base font-black text-white leading-tight">
                      {{ (categoryTotals[categories[activeTab]?.id] ?? 0).toLocaleString() }}
                      <span class="text-gold-light text-xs font-semibold">votes</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contestant cards -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
              <div v-for="contestant in categories[activeTab]?.contestants ?? []" :key="contestant.id"
                @click="selectContestant(categories[activeTab].id, contestant)"
                :class="['relative rounded-2xl overflow-hidden text-left group transition-all duration-300 bg-white flex flex-col cursor-pointer shadow-sm border border-gray-100 hover:shadow-xl hover:border-gold/40 hover:-translate-y-1']"
              >
                <!-- Image Container -->
                <div class="relative w-full aspect-[4/5] overflow-hidden bg-navy/5">
                  <img v-if="contestant.photo" :src="contestant.photo" :alt="contestant.name" class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                    <span class="text-4xl text-gold/60">✝</span>
                  </div>

                  <!-- Number badge (no #) -->
                  <div class="absolute top-3 left-3 w-8 h-8 rounded-full text-white text-xs font-black flex items-center justify-center shadow-lg border border-white/20" style="background: rgba(26,39,68,0.9)">
                    {{ contestant.number }}
                  </div>

                  <!-- Vote count badge (top right) -->
                  <div class="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black shadow-lg border border-gold/40" style="background: rgba(26,39,68,0.92); color: #f5e27a;">
                    <span>🗳️</span>
                    <span>{{ (contestantVotes[contestant.id] ?? 0).toLocaleString() }}</span>
                    <span class="text-[10px] uppercase font-bold text-gray-300">votes</span>
                  </div>

                  <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  <!-- Bottom text on photo -->
                  <div class="absolute bottom-0 left-0 right-0 p-4">
                    <p class="font-playfair font-black text-white text-lg leading-snug drop-shadow-md">{{ contestant.name }}</p>
                    <p v-if="contestant.tagline" class="text-gray-300 text-xs mt-0.5 line-clamp-1 drop-shadow">{{ contestant.tagline }}</p>
                  </div>
                </div>

                <!-- Card footer with vote count & CTA button -->
                <div class="p-3.5 bg-white flex flex-col gap-2.5">
                  <div class="flex items-center justify-between px-1">
                    <span class="text-xs text-gray-500 font-semibold">Total Votes</span>
                    <span class="font-black text-navy text-sm">
                      {{ (contestantVotes[contestant.id] ?? 0).toLocaleString() }}
                      <span class="text-gold text-xs font-bold">votes</span>
                    </span>
                  </div>

                  <div class="py-2.5 px-4 text-center text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm group-hover:shadow-md text-white flex items-center justify-center gap-1.5"
                    style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
                    <span>Vote for {{ contestant.name.split(' ')[0] }}</span>
                    <span>→</span>
                  </div>
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
                class="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all text-white shadow-lg"
                style="background: linear-gradient(90deg, #b8860b, #d4af37)">
                Proceed to Payment →
              </button>
            </div>
            <p v-if="submitError" class="text-red-500 text-xs text-center mt-4 bg-red-50 rounded-2xl p-3 border border-red-100">{{ submitError }}</p>
          </div>
        </transition>
      </div>
    </div>

    <!-- ── STEP: DETAILS & PAYMENT METHOD ── -->
    <div v-if="harvestActive && step === 'details'" class="py-12 px-4">
      <div class="max-w-lg mx-auto space-y-5">
        <div class="text-center mb-2">
          <p class="text-gold text-xs uppercase tracking-widest font-bold mb-1">Step 2 of 2</p>
          <h2 class="font-playfair text-3xl font-black text-navy">Your Details & Payment</h2>
          <div class="flex items-center justify-center gap-3 mt-3">
            <div class="h-px w-12 bg-gold/40" /><span class="text-gold">✦</span><div class="h-px w-12 bg-gold/40" />
          </div>
        </div>

        <!-- Selected Contestant Preview Card -->
        <div v-for="cat in categories.filter(c => votes[c.id])" :key="cat.id" class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center justify-between gap-3">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-gray-100 bg-navy/5">
              <img v-if="getVotedContestant(cat)?.photo" :src="getVotedContestant(cat).photo" class="w-full h-full object-cover object-top" />
              <div v-else class="w-full h-full flex items-center justify-center text-gold text-lg">✝</div>
            </div>
            <div class="min-w-0">
              <p class="text-[11px] text-gold uppercase tracking-wider font-bold truncate">{{ cat.label }}</p>
              <p class="font-playfair font-black text-navy text-base leading-tight truncate">{{ getVotedContestant(cat)?.name }}</p>
              <p class="text-gray-400 text-xs mt-0.5">Contestant {{ getVotedContestant(cat)?.number }}</p>
            </div>
          </div>
          <button @click="goTo('vote')" class="text-xs text-navy/70 hover:text-gold font-bold px-3 py-1.5 rounded-lg border border-gray-200 shrink-0">
            Change
          </button>
        </div>

        <!-- Voter Form -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Full Name *</label>
            <input v-model="payForm.name" type="text" placeholder="Your full name"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Phone Number *</label>
            <input v-model="payForm.phone" type="tel" placeholder="08012345678" inputmode="numeric" pattern="[0-9]*"
              @input="payForm.phone = payForm.phone.replace(/[^0-9]/g, '')"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Number of Votes (₦200 each)</label>
            <div class="flex items-center gap-4">
              <button @click="voteQty = Math.max(1, voteQty - 1)" class="w-11 h-11 rounded-xl border-2 border-gray-200 text-navy font-black text-xl hover:border-gold transition-all">−</button>
              <span class="flex-1 text-center font-playfair font-black text-3xl text-navy">{{ voteQty }}</span>
              <button @click="voteQty++" class="w-11 h-11 rounded-xl border-2 border-gray-200 text-navy font-black text-xl hover:border-gold transition-all">+</button>
            </div>
            <p class="text-center text-sm text-gold font-black mt-3">Total Amount: ₦{{ (voteQty * 200).toLocaleString() }}</p>
          </div>

          <p v-if="payError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ payError }}</p>

          <!-- Dual Payment Choices -->
          <div class="pt-2 space-y-3">
            <p class="text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Choose Payment Option</p>

            <!-- Option 1: Online TagPay -->
            <button @click="initPayment" :disabled="submitting"
              class="w-full p-4 rounded-2xl text-navy font-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 flex items-center justify-between group cursor-pointer border border-gold/30"
              style="background: linear-gradient(90deg, #d4af37, #f5e27a)">
              <div class="flex items-center gap-3 text-left">
                <div class="w-11 h-11 rounded-xl bg-navy/10 flex items-center justify-center text-2xl shrink-0">💳</div>
                <div>
                  <p class="text-sm font-black text-navy leading-tight">Pay Online with TagPay</p>
                  <p class="text-[11px] text-navy/75 font-semibold">Card / USSD / Transfer · Instant Auto-Approval</p>
                </div>
              </div>
              <span class="text-sm font-black text-navy shrink-0 ml-2">{{ submitting ? 'Loading...' : `₦${(voteQty * 200).toLocaleString()} →` }}</span>
            </button>

            <!-- Option 2: Manual Bank Transfer -->
            <button @click="goTo('payment')"
              class="w-full p-4 rounded-2xl border-2 border-gray-200 text-navy font-bold text-sm transition-all hover:border-navy hover:bg-gray-50 flex items-center justify-between bg-white shadow-sm cursor-pointer">
              <div class="flex items-center gap-3 text-left">
                <div class="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-2xl shrink-0">🏦</div>
                <div>
                  <p class="text-sm font-bold text-navy leading-tight">Manual Bank Transfer</p>
                  <p class="text-[11px] text-gray-400 font-normal">Access Bank · Awaiting Admin Verification</p>
                </div>
              </div>
              <span class="text-xs text-gray-400 font-bold shrink-0 ml-2">₦{{ (voteQty * 200).toLocaleString() }} →</span>
            </button>
          </div>

          <button @click="goTo('vote')" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all bg-white mt-2">← Back to Contestants</button>
        </div>
      </div>
    </div>

    <!-- ── STEP: PAYMENT (Manual Bank Transfer) ── -->
    <div v-if="harvestActive && step === 'payment'" class="py-12 px-4">
      <div class="max-w-lg mx-auto space-y-5">
        <div class="text-center mb-2">
          <p class="text-gold text-xs uppercase tracking-widest font-bold mb-1">Manual Transfer</p>
          <h2 class="font-playfair text-3xl font-black text-navy">Pay via Access Bank</h2>
          <div class="flex items-center justify-center gap-3 mt-3">
            <div class="h-px w-12 bg-gold/40" /><span class="text-gold">✦</span><div class="h-px w-12 bg-gold/40" />
          </div>
        </div>

        <!-- Transfer summary -->
        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 divide-y divide-gray-100 text-sm">
          <div class="flex justify-between py-2">
            <span class="text-gray-400">Voter Name</span>
            <span class="font-bold text-navy">{{ payForm.name }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-400">Phone Number</span>
            <span class="font-bold text-navy">{{ payForm.phone }}</span>
          </div>
          <div class="flex justify-between py-2">
            <span class="text-gray-400">Votes</span>
            <span class="font-bold text-navy">{{ voteQty }} vote{{ voteQty > 1 ? 's' : '' }} (₦200 each)</span>
          </div>
          <div class="flex justify-between py-2 text-base">
            <span class="font-bold text-navy">Total Amount</span>
            <span class="font-black text-gold">₦{{ (voteQty * 200).toLocaleString() }}</span>
          </div>
        </div>

        <!-- Bank Details Card -->
        <div class="rounded-2xl border-2 border-gold/30 p-6 shadow-md" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gold text-xs uppercase tracking-widest font-bold">Access Bank</p>
            <span class="text-xs bg-gold/20 text-gold-light px-2.5 py-1 rounded-full font-bold">Parish Account</span>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
            <p class="text-gray-300 text-xs mb-1">Account Number</p>
            <p class="text-white font-playfair font-black text-2xl tracking-wider select-all">0044170761</p>
            <p class="text-gold-light text-xs font-semibold mt-1">St Johns Catholic Church</p>
          </div>
          <div class="space-y-1.5 text-xs text-gray-300">
            <p>1. Transfer exactly <strong class="text-gold text-sm">₦{{ (voteQty * 200).toLocaleString() }}</strong> to the account above.</p>
            <p>2. Use <strong class="text-white">{{ payForm.name }}</strong> as the transfer narration.</p>
            <p>3. Click the confirmation button below after completing payment.</p>
          </div>
        </div>

        <p v-if="payError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ payError }}</p>

        <button @click="submitVotes" :disabled="submitting"
          class="w-full py-5 rounded-2xl text-navy font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60 cursor-pointer"
          style="background: linear-gradient(90deg, #d4af37, #f5e27a)">
          {{ submitting ? 'Submitting...' : "✅ I've Paid — Submit My Vote" }}
        </button>
        <button @click="goTo('details')" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all bg-white">← Back to Payment Options</button>
      </div>
    </div>

    <!-- ── STEP: TAGPAY TRANSFER ── -->
    <div v-if="harvestActive && step === 'tagpay-transfer'" class="py-12 px-4">
      <div class="max-w-lg mx-auto space-y-5">
        <div class="text-center mb-2">
          <p class="text-gold text-xs uppercase tracking-widest font-bold mb-1">Virtual Account</p>
          <h2 class="font-playfair text-3xl font-black text-navy">Complete Your Payment</h2>
          <div class="flex items-center justify-center gap-3 mt-3">
            <div class="h-px w-12 bg-gold/40" /><span class="text-gold">✦</span><div class="h-px w-12 bg-gold/40" />
          </div>
        </div>
        <div class="rounded-2xl border-2 border-gold/30 p-6 shadow-md" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <div class="flex items-center justify-between mb-4">
            <p class="text-gold text-xs uppercase tracking-widest font-bold">Diamond Bank</p>
            <span class="text-xs bg-gold/20 text-gold-light px-2.5 py-1 rounded-full font-bold">Virtual Account</span>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
            <p class="text-gray-300 text-xs mb-1">Account Number</p>
            <p class="text-white font-playfair font-black text-3xl tracking-wider select-all">1128613331</p>
            <p class="text-gold-light text-xs font-semibold mt-1">St John of the Cross</p>
          </div>
          <div class="space-y-1.5 text-xs text-gray-300">
            <p>1. Transfer <strong class="text-gold text-sm">any amount (min ₦200)</strong> to the account above.</p>
            <p>2. Use <strong class="text-white">{{ payForm.name }}</strong> as your transfer narration.</p>
            <p>3. Click confirm below after transferring.</p>
          </div>
        </div>
        <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <p class="text-amber-800 text-xs leading-relaxed">Transfer to the account above, then click confirm. Your vote will be approved automatically once payment is received.</p>
        </div>
        <button @click="pollTagPay" :disabled="submitting"
          class="w-full py-5 rounded-2xl text-navy font-black text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-60"
          style="background: linear-gradient(90deg, #d4af37, #f5e27a)">
          {{ submitting ? 'Verifying payment...' : "✅ I've Transferred — Confirm" }}
        </button>
        <p v-if="payError" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ payError }}</p>
        <button @click="goTo('details')" class="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-500 font-bold text-sm hover:border-navy hover:text-navy transition-all bg-white">← Back</button>
      </div>
    </div>

    <!-- ── STEP: DONE ── -->
    <div v-if="harvestActive && step === 'done'" class="py-20 px-4 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float" style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
          <svg class="w-12 h-12 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
        </div>
        <h1 class="font-playfair text-5xl font-black text-navy mb-2">Vote Confirmed!</h1>
        <p class="text-gold font-semibold text-sm uppercase tracking-widest mb-4">{{ paidWithTagPay ? 'Payment Verified' : 'Awaiting Verification' }}</p>
        <div class="catholic-divider mb-5"><span class="text-gold text-base">✦</span></div>
        <div v-if="paidWithTagPay" class="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 text-left">
          <p class="text-green-800 text-sm font-bold mb-1">✅ Payment Confirmed</p>
          <p class="text-green-700 text-xs leading-relaxed">Your payment was verified and your vote has been automatically counted. Thank you for participating!</p>
        </div>
        <div v-else class="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-left">
          <p class="text-amber-800 text-sm font-bold mb-1">⏳ Pending Admin Approval</p>
          <p class="text-amber-700 text-xs leading-relaxed">Your vote has been submitted and is awaiting approval. Our admin team will verify your bank transfer and approve your vote. This usually takes a few hours.</p>
        </div>
        <div class="space-y-2 mb-8">
          <div v-for="cat in categories.filter(c => votes[c.id])" :key="cat.id" class="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-gray-100 shadow-sm">
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
const step = ref<'vote' | 'details' | 'payment' | 'tagpay-transfer' | 'done'>('vote')
const paidWithTagPay = ref(false)
const activeTab = ref(0)
const submitError = ref('')
const votes = reactive<Record<string, string>>({})
const voteQty = ref(1)
const payError = ref('')
const submitting = ref(false)
const payForm = reactive({ name: '', phone: '' })
const tagpayAccount = reactive({ bankName: '', accountNumber: '', reference: '', amount: 0, checkoutUrl: '', txId: '' })

const contestTitle = ref('Harvest/Bazaar Thanksgiving 2026')
const contestSubtitle = ref('Cast your vote for your favourite contestants · St. John of the Cross & Order of St. Augustine')
const categories = ref<any[]>([])
const harvestActive = ref(true)

const contestantVotes = ref<Record<string, number>>({})
const categoryTotals = ref<Record<string, number>>({})
const grandTotalVotes = ref(0)

function calcCountdown() {
  const end = new Date('2026-11-01T00:00:00+01:00').getTime()
  const diff = end - Date.now()
  if (diff <= 0) return [{ label: 'Days', value: '00' }, { label: 'Hours', value: '00' }, { label: 'Mins', value: '00' }, { label: 'Secs', value: '00' }]
  const d = Math.floor(diff / 86400000)
  const h = Math.floor((diff % 86400000) / 3600000)
  const m = Math.floor((diff % 3600000) / 60000)
  const s = Math.floor((diff % 60000) / 1000)
  return [
    { label: 'Days', value: String(d).padStart(2, '0') },
    { label: 'Hours', value: String(h).padStart(2, '0') },
    { label: 'Mins', value: String(m).padStart(2, '0') },
    { label: 'Secs', value: String(s).padStart(2, '0') },
  ]
}
const countdown = ref(calcCountdown())
let timer: any

onMounted(async () => {
  countdown.value = calcCountdown()
  timer = setInterval(() => { countdown.value = calcCountdown() }, 1000)

  const [{ data: contestants }, { data: cats }, { data: titleData }, { data: hd }, { data: votesData }] = await Promise.all([
    supabase.from('contestants').select('*').order('number'),
    supabase.from('contest_categories').select('*').order('sort_order'),
    supabase.from('site_content').select('key,value').in('key', ['contest_title', 'contest_subtitle']),
    supabase.from('site_content').select('value').eq('key', 'harvest_active').single(),
    supabase.from('votes').select('contestant_id, category, qty, status'),
  ])
  harvestActive.value = hd ? hd.value === 'true' : true
  if (titleData) {
    titleData.forEach((r: any) => {
      if (r.key === 'contest_title') contestTitle.value = r.value
      if (r.key === 'contest_subtitle') contestSubtitle.value = r.value
    })
  }

  // Calculate approved vote counts
  const cVotes: Record<string, number> = {}
  const catVotes: Record<string, number> = {}
  let totalApproved = 0

  votesData?.forEach((v: any) => {
    if (v.status === 'approved') {
      const q = v.qty || 1
      if (v.contestant_id) {
        cVotes[v.contestant_id] = (cVotes[v.contestant_id] ?? 0) + q
      }
      if (v.category) {
        catVotes[v.category] = (catVotes[v.category] ?? 0) + q
      }
      totalApproved += q
    }
  })
  contestantVotes.value = cVotes
  categoryTotals.value = catVotes
  grandTotalVotes.value = totalApproved

  const grouped: Record<string, any[]> = {}
  for (const c of contestants ?? []) {
    if (!grouped[c.category]) grouped[c.category] = []
    grouped[c.category].push(c)
  }
  categories.value = (cats ?? [])
    .filter((cat: any) => grouped[cat.id]?.length)
    .map((cat: any) => ({ ...cat, contestants: grouped[cat.id] }))


})

onUnmounted(() => clearInterval(timer))

const totalVoted = computed(() => Object.keys(votes).length)

function selectContestant(categoryId: string, contestant: any) {
  votes[categoryId] = contestant.id
  goTo('details')
}

function getVotedContestant(cat: any) {
  return cat.contestants.find((c: any) => c.id === votes[cat.id])
}

function goTo(s: typeof step.value) {
  step.value = s
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToPayment() {
  if (totalVoted.value === 0) {
    submitError.value = 'Please vote for at least one contestant before proceeding.'
    return
  }
  submitError.value = ''
  goTo('details')
}

async function initPayment() {
  if (!payForm.name) { payError.value = 'Please enter your full name.'; return }
  if (!payForm.phone || payForm.phone.length < 10) { payError.value = 'Please enter a valid phone number.'; return }

  submitting.value = true
  payError.value = ''

  const txRef = `harvest-${Date.now()}`
  const rows = categories.value.filter(cat => votes[cat.id]).map(cat => ({
    voter_name: payForm.name,
    voter_phone: payForm.phone,
    bank: 'TagPay',
    reference: txRef,
    qty: voteQty.value,
    amount: voteQty.value * 200,
    status: 'pending',
    category: cat.id,
    contestant_id: votes[cat.id],
    contestant_name: getVotedContestant(cat)?.name ?? '',
  }))

  const { error: dbErr } = await supabase.from('votes').insert(rows)
  submitting.value = false
  if (dbErr) { payError.value = dbErr.message; return }

  tagpayAccount.reference = txRef
  tagpayAccount.amount = voteQty.value * 200
  goTo('tagpay-transfer')
}

async function pollTagPay() {
  submitting.value = true
  payError.value = ''
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const { data } = await supabase.from('votes').select('status').eq('reference', tagpayAccount.reference).limit(1).single()
    if (data?.status === 'approved') {
      paidWithTagPay.value = true
      submitting.value = false
      goTo('done')
      return
    }
  }
  // 30s elapsed, go to done with pending status
  submitting.value = false
  paidWithTagPay.value = false
  goTo('done')
}

async function submitVotes() {
  if (!payForm.name) { payError.value = 'Please enter your full name.'; return }
  if (!payForm.phone || payForm.phone.length < 10) { payError.value = 'Please enter a valid phone number.'; return }

  submitting.value = true
  payError.value = ''

  const rows = categories.value.filter(cat => votes[cat.id]).map(cat => ({
    voter_name: payForm.name,
    voter_phone: payForm.phone,
    bank: 'Access Bank',
    reference: 'self-declared',
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
  paidWithTagPay.value = false
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
