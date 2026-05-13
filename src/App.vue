<script setup>
import NavMenu from '@/components/NavMenu.vue'
import { useAuthStore } from '@/stores/useAuthStore'

const auth = useAuthStore()
</script>

<template>
  <div>
    <NavMenu v-if="auth.isLoggedIn" />
    <RouterView />
  </div>
</template>
