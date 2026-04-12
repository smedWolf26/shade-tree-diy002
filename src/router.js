import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/views/HomePage.vue'
import GaragePage from '@/views/GaragePage.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/garage',
    name: 'garage',
    component: GaragePage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
