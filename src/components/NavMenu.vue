<script setup>
const links = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/garage', label: 'My Garage', icon: '🚗' },
  { to: '/upcoming', label: 'Upcoming Services', icon: '📋' },
]
</script>

<template>
  <nav class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-900 px-4">
    <div class="mx-auto flex max-w-md items-center justify-between py-3">
      <span class="text-sm font-black tracking-tight text-white">SHADE TREE DIY 🔧</span>

      <div class="flex gap-1">
        <RouterLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="text-md flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-semibold transition"
          :class="
            ({ isActive }) =>
              isActive
                ? 'bg-zinc-700 text-white shadow-sm shadow-blue-500/30'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
          "
        >
          <span>{{ link.icon }}</span>
          <span class="hidden sm:inline">{{ link.label }}</span>
        </RouterLink>
      </div>
    </div>
  </nav>
</template>
