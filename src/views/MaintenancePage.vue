<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGarageStore, SERVICE_TYPES, typeIcon } from '@/stores/useGarageStore'

const route  = useRoute()
const router = useRouter()
const store  = useGarageStore()

const vehicleId = route.params.id
const vehicle   = computed(() => store.getVehicleById(vehicleId))
const logs      = computed(() => store.getLogsForVehicle(vehicleId))

const showForm        = ref(false)
const confirmDeleteId = ref(null)
const submitError     = ref('')

const emptyForm = () => ({ type: '', mileage: '', date: '', notes: '' })
const form   = ref(emptyForm())
const errors = ref({})

onMounted(async () => {
  if (!store.vehicles.length) await store.fetchVehicles()
  await store.fetchLogs(vehicleId)
})

function selectType(label) {
  form.value.type  = label
  errors.value.type = ''
}

function validate() {
  errors.value = {}
  if (!form.value.type)           errors.value.type    = 'Select a service type.'
  if (!form.value.mileage.trim()) errors.value.mileage = 'Mileage is required.'
  if (!form.value.date.trim())    errors.value.date    = 'Date is required.'
  if (form.value.type === 'Other' && !form.value.notes.trim())
    errors.value.notes = 'Please describe the repair.'
  return Object.keys(errors.value).length === 0
}

async function submitLog() {
  if (!validate()) return
  submitError.value = ''
  try {
    await store.addLog(vehicleId, { ...form.value })
    form.value = emptyForm()
    showForm.value = false
  } catch (e) {
    submitError.value = e.message
  }
}

async function removeLog(logId) {
  try {
    await store.removeLog(vehicleId, logId)
    confirmDeleteId.value = null
  } catch (e) {
    submitError.value = e.message
  }
}

function cancelForm() {
  form.value = emptyForm()
  errors.value = {}
  submitError.value = ''
  showForm.value = false
}
</script>

<template>
  <main class="min-h-screen bg-black px-6 py-10 text-white">

    <!-- Not Found -->
    <div v-if="!vehicle" class="flex flex-col items-center justify-center py-32 text-zinc-500">
      <p class="text-5xl">🔧</p>
      <p class="mt-4 text-xl font-bold">Vehicle not found</p>
      <button class="mt-4 text-sm text-blue-400 hover:underline" @click="router.push('/garage')">
        ← Back to Garage
      </button>
    </div>

    <template v-else>

      <!-- Header -->
      <header class="mb-12 flex items-center justify-center gap-3">
        <div class="text-center">
          <h1 class="text-3xl font-black tracking-tight text-white">SHADE TREE DIY</h1>
          <h1 class="text-3xl font-black tracking-tight text-white">
            {{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}
          </h1>
          <p class="text-lg text-zinc-400">Maintenance Log</p>
        </div>
        <span class="text-5xl">🔧</span>
      </header>

      <div class="mx-auto flex max-w-md flex-col gap-4">

        <!-- Back -->
        <button
          class="-mt-4 mb-2 self-start text-sm text-zinc-500 transition hover:text-zinc-300"
          @click="router.push('/garage')"
        >
          ← Back to Garage
        </button>

        <!-- Error -->
        <div
          v-if="submitError"
          class="rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-400"
        >
          {{ submitError }}
        </div>

        <!-- Log Entries -->
        <div
          v-for="log in logs"
          :key="log.id"
          class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5 transition hover:bg-zinc-700 hover:shadow-lg hover:shadow-blue-500/40"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ typeIcon(log.type) }}</span>
              <div>
                <h2 class="text-xl font-bold text-white">{{ log.type }}</h2>
                <div class="mt-1 flex gap-4 text-sm text-zinc-400">
                  <span>📍 {{ log.mileage }} mi</span>
                  <span>📅 {{ log.date }}</span>
                </div>
                <p v-if="log.notes" class="mt-1 text-sm italic text-zinc-500">"{{ log.notes }}"</p>
              </div>
            </div>

            <!-- Idle -->
            <button
              v-if="confirmDeleteId !== log.id"
              class="rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-zinc-400 transition hover:border-red-600 hover:text-red-400 active:scale-95"
              @click="confirmDeleteId = log.id"
            >
              ✕
            </button>

            <!-- Confirm -->
            <div v-else class="flex gap-1">
              <button
                class="rounded-xl border border-red-600 bg-red-600/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-600 hover:text-white active:scale-95"
                @click="removeLog(log.id)"
              >
                Yes
              </button>
              <button
                class="rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2 text-xs font-semibold text-zinc-400 transition hover:text-white active:scale-95"
                @click="confirmDeleteId = null"
              >
                No
              </button>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="logs.length === 0"
          class="rounded-2xl border border-dashed border-zinc-700 py-16 text-center text-zinc-500"
        >
          <p class="text-4xl">📋</p>
          <p class="mt-3 text-lg font-semibold">No maintenance logged yet</p>
          <p class="text-sm">Log your first service below.</p>
        </div>

        <!-- Add Entry Toggle -->
        <button
          v-if="!showForm"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-600 py-5 text-zinc-400 transition hover:border-blue-500 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          @click="showForm = true"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Log a Service</span>
        </button>

        <!-- Inline Form -->
        <div
          v-if="showForm"
          class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5"
        >
          <h3 class="mb-5 text-lg font-bold tracking-tight text-white">New Service Entry</h3>

          <div>
            <label class="mb-2 block text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Service Type *
            </label>
            <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                v-for="svc in SERVICE_TYPES"
                :key="svc.label"
                type="button"
                class="flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-sm font-semibold transition active:scale-95"
                :class="
                  form.type === svc.label
                    ? 'border-blue-500 bg-blue-600/20 text-blue-300 shadow-md shadow-blue-500/30'
                    : 'border-zinc-600 bg-zinc-700 text-zinc-400 hover:bg-zinc-600 hover:text-white'
                "
                @click="selectType(svc.label)"
              >
                <span class="text-2xl">{{ svc.icon }}</span>
                {{ svc.label }}
              </button>
            </div>
            <span v-if="errors.type" class="mt-1 block text-xs text-red-400">{{ errors.type }}</span>
          </div>

          <div class="mt-4 grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Mileage *</label>
              <input
                v-model="form.mileage"
                placeholder="74,500"
                class="rounded-xl border px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600"
                :class="errors.mileage ? 'border-red-500 bg-red-950/20' : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'"
              />
              <span v-if="errors.mileage" class="text-xs text-red-400">{{ errors.mileage }}</span>
            </div>
            <div class="flex flex-col gap-1">
              <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">Date *</label>
              <input
                v-model="form.date"
                placeholder="MM/DD/YYYY"
                class="rounded-xl border px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600"
                :class="errors.date ? 'border-red-500 bg-red-950/20' : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'"
              />
              <span v-if="errors.date" class="text-xs text-red-400">{{ errors.date }}</span>
            </div>
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <label class="text-xs font-semibold uppercase tracking-widest text-zinc-400">
              Notes
              <span v-if="form.type === 'Other'" class="normal-case text-red-400"> — required for Other</span>
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Describe the repair or any details..."
              class="resize-none rounded-xl border px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-zinc-600"
              :class="errors.notes ? 'border-red-500 bg-red-950/20' : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'"
            />
            <span v-if="errors.notes" class="text-xs text-red-400">{{ errors.notes }}</span>
          </div>

          <div class="mt-5 flex gap-3">
            <button
              class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-95"
              @click="submitLog"
            >
              Save Entry
            </button>
            <button
              class="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-500 hover:text-white"
              @click="cancelForm"
            >
              Cancel
            </button>
          </div>
        </div>

      </div>
    </template>
  </main>
</template>
