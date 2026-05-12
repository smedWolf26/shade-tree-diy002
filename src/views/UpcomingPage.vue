<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useGarage, SERVICE_TYPES, typeIcon } from '@/composables/useGarage'

const router = useRouter()
const { vehicles, reminders, addReminder, removeReminder } = useGarage()

const enrichedReminders = computed(() =>
  reminders.value.map((r) => ({
    ...r,
    vehicle: vehicles.value.find((v) => v.id === r.vehicleId) ?? null,
  })),
)

const showForm = ref(false)
const confirmDeleteId = ref(null)

const emptyForm = () => ({ vehicleId: '', type: '', dueMileage: '', notes: '' })
const form = ref(emptyForm())
const errors = ref({})

function selectType(label) {
  form.value.type = label
  errors.value.type = ''
}

function validate() {
  errors.value = {}
  if (!form.value.vehicleId) errors.value.vehicleId = 'Select a vehicle.'
  if (!form.value.type) errors.value.type = 'Select a service type.'
  if (!form.value.dueMileage.trim()) errors.value.dueMileage = 'Due mileage is required.'
  if (form.value.type === 'Other' && !form.value.notes.trim())
    errors.value.notes = 'Please describe the service.'
  return Object.keys(errors.value).length === 0
}

function submitReminder() {
  if (!validate()) return
  addReminder({ ...form.value, vehicleId: Number(form.value.vehicleId) })
  form.value = emptyForm()
  showForm.value = false
}

function cancelForm() {
  form.value = emptyForm()
  errors.value = {}
  showForm.value = false
}
</script>

<template>
  <main class="min-h-screen bg-black px-6 py-10 text-white">
    <header class="mb-12 flex items-center justify-center gap-3">
      <div class="text-center">
        <h1 class="text-3xl font-black tracking-tight text-white">SHADE TREE DIY</h1>
        <h1 class="text-3xl font-black tracking-tight text-white">UPCOMING SERVICES</h1>
        <p class="text-lg text-zinc-400">
          {{ reminders.length }} reminder{{ reminders.length !== 1 ? 's' : '' }} across all vehicles
        </p>
      </div>
      <span class="text-5xl">📋</span>
    </header>

    <div class="mx-auto flex max-w-md flex-col gap-4">
      <div
        v-if="vehicles.length === 0"
        class="rounded-2xl border border-dashed border-zinc-700 py-12 text-center text-zinc-500"
      >
        <p class="text-4xl">🚗</p>
        <p class="mt-3 text-lg font-semibold">No vehicles in your garage</p>
        <button
          class="mt-3 text-sm text-blue-400 transition hover:underline"
          @click="router.push('/garage')"
        >
          Add a vehicle first →
        </button>
      </div>

      <template v-else>
        <div
          v-for="reminder in enrichedReminders"
          :key="reminder.id"
          class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5 transition hover:bg-zinc-700 hover:shadow-lg hover:shadow-blue-500/40"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex items-center gap-3">
              <span class="text-3xl">{{ typeIcon(reminder.type) }}</span>
              <div>
                <h2 class="text-xl font-bold text-white">{{ reminder.type }}</h2>
                <p class="mt-0.5 text-sm text-zinc-400">
                  🚗
                  <span v-if="reminder.vehicle">
                    {{ reminder.vehicle.year }} {{ reminder.vehicle.make }}
                    {{ reminder.vehicle.model }}
                    <span
                      v-if="reminder.vehicle.plate"
                      class="text-zinc-600"
                    >
                      · {{ reminder.vehicle.plate }}</span
                    >
                  </span>
                  <span
                    v-else
                    class="text-zinc-600 italic"
                    >Unknown vehicle</span
                  >
                </p>
                <p class="mt-1 text-sm text-zinc-400">📍 Due at {{ reminder.dueMileage }} mi</p>
                <p
                  v-if="reminder.notes"
                  class="mt-1 text-sm text-zinc-500 italic"
                >
                  "{{ reminder.notes }}"
                </p>
              </div>
            </div>

            <button
              v-if="confirmDeleteId !== reminder.id"
              class="rounded-xl border border-zinc-600 bg-zinc-700 px-3 py-2 text-sm text-zinc-400 transition hover:border-red-600 hover:text-red-400 active:scale-95"
              @click="confirmDeleteId = reminder.id"
            >
              ✕
            </button>

            <div
              v-else
              class="flex gap-1"
            >
              <button
                class="rounded-xl border border-red-600 bg-red-600/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-600 hover:text-white active:scale-95"
                @click="(removeReminder(reminder.id), (confirmDeleteId = null))"
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

        <div
          v-if="reminders.length === 0"
          class="rounded-2xl border border-dashed border-zinc-700 py-16 text-center text-zinc-500"
        >
          <p class="text-4xl">📋</p>
          <p class="mt-3 text-lg font-semibold">No upcoming services</p>
          <p class="text-sm">Add a reminder below.</p>
        </div>

        <button
          v-if="!showForm"
          class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-600 py-5 text-zinc-400 transition hover:border-blue-500 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
          @click="showForm = true"
        >
          <span class="text-xl font-bold">+</span>
          <span class="font-semibold">Add a Reminder</span>
        </button>

        <div
          v-if="showForm"
          class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5"
        >
          <h3 class="mb-5 text-lg font-bold tracking-tight text-white">New Reminder</h3>

          <!-- Vehicle select -->
          <div class="mb-4 flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Vehicle *</label
            >
            <select
              v-model="form.vehicleId"
              class="rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none"
              :class="
                errors.vehicleId
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            >
              <option
                value=""
                disabled
              >
                Select a vehicle...
              </option>
              <option
                v-for="v in vehicles"
                :key="v.id"
                :value="v.id"
              >
                {{ v.year }} {{ v.make }} {{ v.model }}{{ v.plate ? ' · ' + v.plate : '' }}
              </option>
            </select>
            <span
              v-if="errors.vehicleId"
              class="text-xs text-red-400"
              >{{ errors.vehicleId }}</span
            >
          </div>

          <div>
            <label class="mb-2 block text-xs font-semibold tracking-widest text-zinc-400 uppercase">
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
            <span
              v-if="errors.type"
              class="mt-1 block text-xs text-red-400"
              >{{ errors.type }}</span
            >
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Due at Mileage *</label
            >
            <input
              v-model="form.dueMileage"
              placeholder="80,000"
              class="rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600"
              :class="
                errors.dueMileage
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            />
            <span
              v-if="errors.dueMileage"
              class="text-xs text-red-400"
              >{{ errors.dueMileage }}</span
            >
          </div>

          <div class="mt-4 flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase">
              Notes
              <span
                v-if="form.type === 'Other'"
                class="text-red-400 normal-case"
              >
                — required for Other</span
              >
            </label>
            <textarea
              v-model="form.notes"
              rows="2"
              placeholder="Any details about this service..."
              class="resize-none rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600"
              :class="
                errors.notes
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            />
            <span
              v-if="errors.notes"
              class="text-xs text-red-400"
              >{{ errors.notes }}</span
            >
          </div>

          <div class="mt-5 flex gap-3">
            <button
              class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-95"
              @click="submitReminder"
            >
              Save Reminder
            </button>
            <button
              class="rounded-xl border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-400 transition hover:border-zinc-500 hover:text-white"
              @click="cancelForm"
            >
              Cancel
            </button>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
