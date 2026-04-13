import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/views/HomePage.vue'
import GaragePage from '@/views/GaragePage.vue'
import MaintenancePage from './views/MaintenancePage.vue'
import UpcomingPage from './views/UpcomingPage.vue'

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
  {
    path: '/maintenance/:id',
    name: 'maintenance',
    component: MaintenancePage,
  },
  {
    path: '/upcoming',
    name: 'upcoming',
    component: UpcomingPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
