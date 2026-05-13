<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()

const email    = ref('')
const password = ref('')
const confirm  = ref('')
const error    = ref('')
const loading  = ref(false)

async function submit() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    await auth.register(email.value.trim(), password.value)
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main class="flex min-h-screen items-center justify-center bg-black px-6 py-12">
    <div class="w-full max-w-sm">

      <!-- Brand -->
      <div class="mb-10 text-center">
        <span class="text-5xl">🔧</span>
        <h1 class="mt-4 text-3xl font-black tracking-tight text-white">SHADE TREE DIY</h1>
        <p class="mt-1 text-zinc-400">Create your account</p>
      </div>

      <!-- Card -->
      <div class="rounded-2xl border border-zinc-700 bg-zinc-800 px-8 py-8">

        <!-- Error -->
        <div
          v-if="error"
          class="mb-5 rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400"
        >
          {{ error }}
        </div>

        <!-- Email -->
        <div class="mb-4 flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
            class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
          />
        </div>

        <!-- Password -->
        <div class="mb-4 flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Password</label>
          <input
            v-model="password"
            type="password"
            placeholder="At least 6 characters"
            autocomplete="new-password"
            class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
          />
        </div>

        <!-- Confirm -->
        <div class="mb-6 flex flex-col gap-1">
          <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Confirm Password</label>
          <input
            v-model="confirm"
            type="password"
            placeholder="••••••••"
            autocomplete="new-password"
            class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-blue-500"
            @keyup.enter="submit"
          />
        </div>

        <!-- Submit -->
        <button
          class="w-full rounded-xl bg-blue-600 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-95 disabled:opacity-50"
          :disabled="loading"
          @click="submit"
        >
          {{ loading ? 'Creating account...' : 'Create Account' }}
        </button>

        <!-- Login link -->
        <p class="mt-5 text-center text-sm text-zinc-500">
          Already have an account?
          <RouterLink to="/login" class="text-blue-400 transition hover:text-blue-300">
            Sign in
          </RouterLink>
        </p>
      </div>

    </div>
  </main>
</template>
