import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAuthStore } from './useAuthStore'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8787'

export const SERVICE_TYPES = [
  { label: 'Oil Change',    icon: '🛢️' },
  { label: 'Tire Rotation', icon: '🔄' },
  { label: 'Air Filter',    icon: '💨' },
  { label: 'Other',         icon: '🔧' },
]

export const typeIcon = (type) =>
  SERVICE_TYPES.find((s) => s.label === type)?.icon ?? '🔧'

export const useGarageStore = defineStore('garage', () => {
  const auth = useAuthStore()

  const vehicles  = ref([])
  const logs      = ref({})
  const reminders = ref([])
  const loading   = ref(false)
  const error     = ref(null)

  // ── Shared fetch wrapper — handles 401 token refresh ─────────
  async function apiFetch(path, options = {}) {
    let res = await fetch(`${API}${path}`, { ...options, headers: auth.authHeaders() })
    if (res.status === 401) {
      const refreshed = await auth.refresh()
      if (!refreshed) throw new Error('Session expired. Please log in again.')
      res = await fetch(`${API}${path}`, { ...options, headers: auth.authHeaders() })
    }
    return res
  }

  // ── Vehicles ──────────────────────────────────────────────────
  async function fetchVehicles() {
    loading.value = true
    error.value   = null
    try {
      const res  = await apiFetch('/api/vehicles')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error?.message || 'Failed to load vehicles.')
      vehicles.value = json.data
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function addVehicle(vehicle) {
    const res  = await apiFetch('/api/vehicles', { method: 'POST', body: JSON.stringify(vehicle) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Failed to add vehicle.')
    vehicles.value.unshift(json.data)
    logs.value[json.data.id] = []
  }

  async function removeVehicle(id) {
    const res = await apiFetch(`/api/vehicles/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error?.message || 'Failed to delete vehicle.')
    }
    vehicles.value  = vehicles.value.filter((v) => v.id !== id)
    delete logs.value[id]
    reminders.value = reminders.value.filter((r) => r.vehicleId !== id)
  }

  function getVehicleById(id) {
    return vehicles.value.find((v) => v.id === Number(id)) ?? null
  }

  // ── Maintenance logs ───────────────────────────────────────────
  async function fetchLogs(vehicleId) {
    const id   = Number(vehicleId)
    const res  = await apiFetch(`/api/vehicles/${id}/logs`)
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Failed to load logs.')
    logs.value[id] = json.data
  }

  function getLogsForVehicle(vehicleId) {
    return logs.value[Number(vehicleId)] ?? []
  }

  async function addLog(vehicleId, entry) {
    const id   = Number(vehicleId)
    const res  = await apiFetch(`/api/vehicles/${id}/logs`, { method: 'POST', body: JSON.stringify(entry) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Failed to add log.')
    if (!logs.value[id]) logs.value[id] = []
    logs.value[id].unshift(json.data)
  }

  async function removeLog(vehicleId, logId) {
    const res = await apiFetch(`/api/logs/${logId}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error?.message || 'Failed to delete log.')
    }
    const id = Number(vehicleId)
    if (logs.value[id]) logs.value[id] = logs.value[id].filter((l) => l.id !== logId)
  }

  // ── Reminders ──────────────────────────────────────────────────
  async function fetchReminders() {
    const res  = await apiFetch('/api/reminders')
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Failed to load reminders.')
    reminders.value = json.data
  }

  async function addReminder(reminder) {
    const res  = await apiFetch('/api/reminders', { method: 'POST', body: JSON.stringify(reminder) })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error?.message || 'Failed to add reminder.')
    reminders.value.unshift(json.data)
  }

  async function removeReminder(id) {
    const res = await apiFetch(`/api/reminders/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const json = await res.json()
      throw new Error(json.error?.message || 'Failed to delete reminder.')
    }
    reminders.value = reminders.value.filter((r) => r.id !== id)
  }

  // ── Reset on logout ────────────────────────────────────────────
  function $reset() {
    vehicles.value  = []
    logs.value      = {}
    reminders.value = []
    error.value     = null
  }

  return {
    vehicles, logs, reminders, loading, error,
    fetchVehicles, addVehicle, removeVehicle, getVehicleById,
    fetchLogs, getLogsForVehicle, addLog, removeLog,
    fetchReminders, addReminder, removeReminder,
    $reset,
  }
})
