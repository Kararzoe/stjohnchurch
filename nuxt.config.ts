export default defineNuxtConfig({
  compatibilityDate: '2024-11-01', // deploy: force-refresh
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    tagpaySecretKey: '',
    tagpayWebhookSecret: '',
    supabaseServiceRoleKey: '',
    public: {
      supabaseUrl: 'https://bworzpdoqinverdtbooq.supabase.co',
      supabaseKey: 'sb_publishable_iydqBWj7YvaHtM-CI4zDJg_7NY0Ieln',
      tagpayPublicKey: '',
      siteUrl: 'https://www.stjohncatholicchurch.org',
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
