export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tagpaySecretKey: process.env.TAGPAY_SECRET_KEY,
    tagpayWebhookSecret: process.env.TAGPAY_WEBHOOK_SECRET,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL,
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY,
      tagpayPublicKey: process.env.TAGPAY_PUBLIC_KEY,
    }
  },
  app: {
    head: {
      title: 'St. John of the Cross Catholic Church - Mararaba',
      meta: [
        { name: 'description', content: 'St. John of the Cross Catholic Church, Mararaba Gurku, Nasarawa State. Mass times, events, and parish information.' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=Inter:wght@300;400;500;600&display=swap'
        }
      ]
    }
  }
})
