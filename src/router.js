import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'

import HomePage        from '@/views/HomePage.vue'
import GaragePage      from '@/views/GaragePage.vue'
import MaintenancePage from '@/views/MaintenancePage.vue'
import UpcomingPage    from '@/views/UpcomingPage.vue'
import LoginPage       from '@/views/LoginPage.vue'
import RegisterPage    from '@/views/RegisterPage.vue'

const routes = [
  { path: '/login',    name: 'login',    component: LoginPage,    meta: { guest: true } },
  { path: '/register', name: 'register', component: RegisterPage, meta: { guest: true } },

  { path: '/',                  name: 'home',        component: HomePage,        meta: { requiresAuth: true } },
  { path: '/garage',            name: 'garage',      component: GaragePage,      meta: { requiresAuth: true } },
  { path: '/maintenance/:id',   name: 'maintenance', component: MaintenancePage, meta: { requiresAuth: true } },
  { path: '/upcoming',          name: 'upcoming',    component: UpcomingPage,    meta: { requiresAuth: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  // Redirect unauthenticated users to login
  if (to.meta.requiresAuth && !auth.isLoggedIn) return { name: 'login' }

  // Redirect logged-in users away from guest-only pages
  if (to.meta.guest && auth.isLoggedIn) return { name: 'home' }
})

export default router
