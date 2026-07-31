<template>
  <div class="min-h-screen bg-navy flex items-center justify-center px-4">
    <div class="w-full max-w-sm">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-4">
          <span class="text-gold text-3xl">✝</span>
        </div>
        <h1 class="font-playfair text-2xl font-bold text-white">Reset Password</h1>
        <p class="text-gray-400 text-xs mt-1">St. John of the Cross · Mararaba</p>
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-2xl">
        <div v-if="done" class="text-center">
          <p class="text-green-600 font-bold mb-4">✓ Password updated successfully!</p>
          <NuxtLink to="/admin/login" class="text-gold font-bold text-sm hover:text-navy transition-colors">Go to Login →</NuxtLink>
        </div>
        <form v-else @submit.prevent="updatePassword" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">New Password</label>
            <input v-model="password" type="password" placeholder="Enter new password"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Confirm Password</label>
            <input v-model="confirm" type="password" placeholder="Confirm new password"
              class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-all" />
          </div>
          <p v-if="error" class="text-red-500 text-xs bg-red-50 rounded-xl p-3 border border-red-100">{{ error }}</p>
          <button type="submit" :disabled="loading"
            class="w-full py-3.5 rounded-xl text-white font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 disabled:opacity-60"
            style="background: linear-gradient(135deg, #1a2744, #2d4a8a)">
            {{ loading ? 'Updating...' : 'Update Password' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })

const supabase = useSupabase()
const password = ref('')
const confirm = ref('')
const error = ref('')
const loading = ref(false)
const done = ref(false)

async function updatePassword() {
  error.value = ''
  if (!password.value || password.value.length < 6) {
    error.value = 'Password must be at least 6 characters.'
    return
  }
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  const { error: err } = await supabase.auth.updateUser({ password: password.value })
  loading.value = false
  if (err) {
    error.value = err.message
  } else {
    done.value = true
  }
}
</script>
