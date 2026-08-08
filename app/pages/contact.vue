<template>
  <!-- Hero -->
  <section class="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
    <div class="absolute inset-0 parallax-hero"
      style="background-image: url('/church-11.jpg')" />
    <div class="absolute inset-0 bg-navy/80" />
    <div class="relative z-10 text-center text-white px-4">
      <span class="section-label">Reach Out</span>
      <h1 class="font-playfair text-4xl sm:text-6xl md:text-7xl font-black">Contact Us</h1>
      <p class="text-gray-300 mt-3 text-base md:text-lg">We'd love to hear from you</p>
    </div>
    <div class="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none"><path d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z" fill="#faf8f3"/></svg>
    </div>
  </section>

  <section class="py-12 md:py-24 px-4 md:px-6 bg-cream">
    <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
      <!-- Info -->
      <div class="space-y-6 reveal-left">
        <div>
          <span class="section-label">Parish Information</span>
          <h2 class="font-playfair text-3xl font-bold text-navy">Get In Touch</h2>
        </div>
        <div v-for="info in contactInfo" :key="info.label"
          class="flex items-start gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-gold/30 transition-all">
          <div class="w-12 h-12 rounded-xl bg-navy flex items-center justify-center text-xl shrink-0">
            {{ info.icon }}
          </div>
          <div>
            <p class="text-xs text-gold font-bold uppercase tracking-widest mb-1">{{ info.label }}</p>
            <p class="text-gray-700 text-sm whitespace-pre-line">{{ info.value }}</p>
          </div>
        </div>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-3xl p-5 md:p-8 shadow-xl border border-gray-100 reveal-right">
        <h2 class="font-playfair text-2xl font-bold text-navy mb-6">Send a Message</h2>
        <form class="space-y-4" @submit.prevent>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">First Name</label>
              <input type="text" placeholder="John"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Last Name</label>
              <input type="text" placeholder="Doe"
                class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
            </div>
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email</label>
            <input type="email" placeholder="you@example.com"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Subject</label>
            <input type="text" placeholder="How can we help?"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Message</label>
            <textarea rows="4" placeholder="Your message..."
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all resize-none" />
          </div>
          <button type="submit"
            class="w-full py-4 rounded-full bg-gold text-white font-semibold hover:bg-gold-light transition-all hover:shadow-lg hover:shadow-gold/30 hover:-translate-y-0.5">
            Send Message ✉️
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useScrollReveal()

const supabase = useSupabase()
const contactInfo = ref([
  { icon: '📍', label: 'Address', value: 'St. John of the Cross Catholic Church,\nBehind Nasarawa State High Court, Mararaba' },
  { icon: '📞', label: 'Phone', value: '08142053461' },
  { icon: '✉️', label: 'Email', value: 'stjohncatholicchurchmararaba@gmail.com' },
  { icon: '🕐', label: 'Office Hours', value: 'Mon–Fri: 9 AM – 5 PM\nSat: 9 AM – 1 PM' },
])

onMounted(async () => {
  const { data } = await supabase.from('site_content').select('key, value')
    .in('key', ['contact_address', 'contact_phone', 'contact_email', 'contact_hours'])
  if (data) {
    const map: Record<string, string> = {}
    data.forEach((r: any) => { map[r.key] = r.value })
    contactInfo.value = [
      { icon: '📍', label: 'Address', value: map.contact_address ?? contactInfo.value[0].value },
      { icon: '📞', label: 'Phone', value: map.contact_phone ?? contactInfo.value[1].value },
      { icon: '✉️', label: 'Email', value: map.contact_email ?? contactInfo.value[2].value },
      { icon: '🕐', label: 'Office Hours', value: map.contact_hours ?? contactInfo.value[3].value },
    ]
  }
})
</script>
