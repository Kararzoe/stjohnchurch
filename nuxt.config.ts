export default defineNuxtConfig({
  routeRules: {
    '/harvest-vote': { ssr: false },
    '/vote-callback': { ssr: false },
    '/admin': { ssr: false },
    '/admin/votes': { ssr: false },
    '/admin/login': { ssr: false },
    '/admin/contestants': { ssr: false },
    '/admin/donations': { ssr: false },
    '/admin/events': { ssr: false },
    '/admin/news': { ssr: false },
    '/admin/gallery': { ssr: false },
    '/admin/members': { ssr: false },
    '/admin/clergy': { ssr: false },
    '/admin/about': { ssr: false },
    '/admin/contact': { ssr: false },
    '/admin/homepage': { ssr: false },
    '/admin/ministries': { ssr: false },
    '/admin/mass-times': { ssr: false },
    '/admin/elections': { ssr: false },
    '/admin/reset-password': { ssr: false },
  },
  compatibilityDate: '2024-11-01', // cache-bust-3
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
