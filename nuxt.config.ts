export default defineNuxtConfig({
  compatibilityDate: '2024-11-01', // deploy: force-refresh
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tagpaySecretKey: process.env.TAGPAY_SECRET_KEY || process.env.NUXT_TAGPAY_SECRET_KEY || '',
    tagpayWebhookSecret: process.env.TAGPAY_WEBHOOK_SECRET || process.env.NUXT_TAGPAY_WEBHOOK_SECRET || '',
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || process.env.NUXT_PUBLIC_SUPABASE_URL || 'https://bworzpdoqinverdtbooq.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || process.env.NUXT_PUBLIC_SUPABASE_KEY || 'sb_publishable_iydqBWj7YvaHtM-CI4zDJg_7NY0Ieln',
      tagpayPublicKey: process.env.TAGPAY_PUBLIC_KEY || process.env.NUXT_PUBLIC_TAGPAY_PUBLIC_KEY || '',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
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
