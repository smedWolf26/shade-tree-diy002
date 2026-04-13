<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="min-h-screen bg-black px-6 py-10 text-white">
    <header class="mb-12 flex items-center justify-center gap-3">
      <div class="text-center">
        <h1 class="text-3xl font-black tracking-tight text-white">SHADE TREE DIY</h1>
        <p class="text-lg text-zinc-400">Personal vehicle maintenance tracker</p>
      </div>
      <span class="text-5xl">🔧</span>
    </header>

    <div class="mx-auto flex max-w-md flex-col gap-4">
      <button
        type="button"
        class="flex items-center justify-between rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5 text-left transition hover:bg-zinc-700 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95"
        @click="router.push('/garage')"
      >
        <div>
          <h2 class="text-2xl font-bold text-white">My Garage</h2>
          <p class="text-sm text-zinc-400">View and manage your vehicles</p>
        </div>
        <span class="text-3xl">🚗</span>
      </button>
    </div>
  </main>
</template>
