<script setup>
const linkClass =
  'hover:underline hover:underline-offset-4 [&.router-link-active]:underline [&.router-link-active]:underline-offset-4'
</script>

<template>
  <nav class="flex justify-center gap-4 bg-zinc-900 text-3xl font-black tracking-tight text-white">
    <RouterLink
      to="/"
      :class="linkClass"
    >
      Home Page
    </RouterLink>
  </nav>
</template>
