import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()

  const accessToken  = ref(localStorage.getItem('accessToken') || null)
  const refreshToken = ref(localStorage.getItem('refreshToken') || null)
  const user         = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isLoggedIn = computed(() => !!accessToken.value)

  function setSession(data) {
    accessToken.value  = data.accessToken
    refreshToken.value = data.refreshToken
    localStorage.setItem('accessToken',  data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    if (data.user) {
      user.value = data.user
      localStorage.setItem('user', JSON.stringify(data.user))
    }
  }

  function clearSession() {
    accessToken.value  = null
    refreshToken.value = null
    user.value         = null
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
  }

  async function register(email, password) {
    const res  = await fetch(`${API}/api/auth/register`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Registration failed.')
    setSession(json.data)
    router.push('/')
  }

  async function login(email, password) {
    const res  = await fetch(`${API}/api/auth/login`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Login failed.')
    setSession(json.data)
    router.push('/')
  }

  async function refresh() {
    if (!refreshToken.value) { logout(); return false }
    const res  = await fetch(`${API}/api/auth/refresh`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ refresh_token: refreshToken.value }),
    })
    const json = await res.json()
    if (!res.ok) { logout(); return false }
    accessToken.value = json.data.accessToken
    localStorage.setItem('accessToken', json.data.accessToken)
    return true
  }

  async function logout() {
    if (refreshToken.value) {
      try {
        await fetch(`${API}/api/auth/logout`, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ refresh_token: refreshToken.value }),
        })
      } catch { /* best effort */ }
    }
    clearSession()
    router.push('/login')
  }

  function authHeaders() {
    return {
      Authorization:  `Bearer ${accessToken.value}`,
      'Content-Type': 'application/json',
    }
  }

  return { accessToken, refreshToken, user, isLoggedIn, register, login, refresh, logout, authHeaders }
})
