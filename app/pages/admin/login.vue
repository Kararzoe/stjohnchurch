<template>
  <div class="min-h-screen bg-navy flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-4">
          <span class="text-gold text-3xl">✝</span>
        </div>
        <h1 class="font-playfair text-2xl font-bold text-white">Admin Portal</h1>
        <p class="text-gray-400 text-xs mt-1">St. John of the Cross · Mararaba</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-3xl p-8 shadow-2xl">
        <h2 class="font-playfair text-xl font-bold text-navy mb-6">Sign In</h2>

        <form @submit.prevent="login" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
            <input v-model="form.email" type="email" placeholder="admin@stjohnmararaba.org"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
            <input v-model="form.password" type="password" placeholder="••••••••"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>

          <p v-if="error" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ error }}</p>

          <button type="submit" :disabled="loading"
            class="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
            style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const router = useRouter()
const form = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

async function login() {
  error.value = ''
  loading.value = true
  const supabase = useSupabase()
  const { error: err } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  })
  loading.value = false
  if (err) {
    error.value = err.message
  } else {
    router.push('/admin')
  }
}
</script>
