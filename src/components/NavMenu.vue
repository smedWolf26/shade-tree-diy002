<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useGarageStore } from '@/stores/useGarageStore'

const auth = useAuthStore()
const garage = useGarageStore()

const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/garage', label: 'My Garage', icon: '🚗' },
  { to: '/upcoming', label: 'Upcoming Services', icon: '📋' },
]

function logout() {
  garage.$reset()
  auth.logout()
}
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900 px-4">
    <div class="mx-auto flex max-w-md items-center justify-between py-3">
      <div class="flex gap-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          active-class="bg-zinc-700 text-white shadow-sm shadow-blue-500/30"
          class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold transition"
        >
          <span>{{ link.icon }}</span>
          <span class="hidden sm:inline">{{ link.label }}</span>
        </RouterLink>

        <button
          class="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-sm font-semibold text-zinc-400 transition hover:bg-zinc-800 hover:text-red-400"
          title="Sign out"
          @click="logout"
        >
          <span>🚪</span>
          <span class="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </div>
  </nav>
</template>
