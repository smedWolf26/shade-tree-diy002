<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGarage } from '@/composables/useGarage'

const router = useRouter()
const { vehicles, addVehicle, removeVehicle } = useGarage()

const showForm = ref(false)
const confirmDeleteId = ref(null)

const emptyForm = () => ({ year: '', make: '', model: '', plate: '', mileage: '' })
const form = ref(emptyForm())
const errors = ref({})

function validate() {
  errors.value = {}
  if (!form.value.year || !/^\d{4}$/.test(form.value.year))
    errors.value.year = 'Enter a valid 4-digit year.'
  if (!form.value.make.trim()) errors.value.make = 'Make is required.'
  if (!form.value.model.trim()) errors.value.model = 'Model is required.'
  return Object.keys(errors.value).length === 0
}

function submitVehicle() {
  if (!validate()) return
  addVehicle({ ...form.value })
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
        <h1 class="text-3xl font-black tracking-tight text-white">MY GARAGE</h1>
        <p class="text-lg text-zinc-400">
          {{ vehicles.length }} vehicle{{ vehicles.length !== 1 ? 's' : '' }} tracked
        </p>
      </div>
      <span class="text-5xl">🚗</span>
    </header>

    <div class="mx-auto flex max-w-md flex-col gap-4">
      <div
        v-for="vehicle in vehicles"
        :key="vehicle.id"
        class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5 transition hover:bg-zinc-700 hover:shadow-lg hover:shadow-blue-500/40"
      >
        <h2 class="text-2xl font-bold text-white">
          {{ vehicle.year }} {{ vehicle.make }} {{ vehicle.model }}
        </h2>
        <div class="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-zinc-400">
          <span v-if="vehicle.plate">🪪 {{ vehicle.plate }}</span>
          <span v-if="vehicle.mileage">📍 {{ vehicle.mileage }} mi</span>
        </div>

        <div class="mt-4 flex gap-2">
          <button
            class="flex-1 rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-600 hover:shadow-md hover:shadow-blue-500/30 active:scale-95"
            @click="router.push(`/maintenance/${vehicle.id}`)"
          >
            Maintenance →
          </button>

          <button
            v-if="confirmDeleteId !== vehicle.id"
            class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-400 transition hover:border-red-600 hover:text-red-400 active:scale-95"
            @click="confirmDeleteId = vehicle.id"
          >
            ✕
          </button>

          <div
            v-else
            class="flex gap-1"
          >
            <button
              class="rounded-xl border border-red-600 bg-red-600/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-600 hover:text-white active:scale-95"
              @click="(removeVehicle(vehicle.id), (confirmDeleteId = null))"
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
        v-if="vehicles.length === 0"
        class="rounded-2xl border border-dashed border-zinc-700 py-16 text-center text-zinc-500"
      >
        <p class="text-4xl">🚗</p>
        <p class="mt-3 text-lg font-semibold">No vehicles yet</p>
        <p class="text-sm">Add your first ride below.</p>
      </div>

      <button
        v-if="!showForm"
        class="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-zinc-600 py-5 text-zinc-400 transition hover:border-blue-500 hover:text-blue-400 hover:shadow-lg hover:shadow-blue-500/20"
        @click="showForm = true"
      >
        <span class="text-xl font-bold">+</span>
        <span class="font-semibold">Add a Vehicle</span>
      </button>

      <div
        v-if="showForm"
        class="rounded-2xl border border-zinc-700 bg-zinc-800 px-6 py-5"
      >
        <h3 class="mb-5 text-lg font-bold tracking-tight text-white">New Vehicle</h3>

        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Year *</label
            >
            <input
              v-model="form.year"
              maxlength="4"
              placeholder="2024"
              class="rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600"
              :class="
                errors.year
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            />
            <span
              v-if="errors.year"
              class="text-xs text-red-400"
              >{{ errors.year }}</span
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Make *</label
            >
            <input
              v-model="form.make"
              placeholder="Toyota"
              class="rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600"
              :class="
                errors.make
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            />
            <span
              v-if="errors.make"
              class="text-xs text-red-400"
              >{{ errors.make }}</span
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Model *</label
            >
            <input
              v-model="form.model"
              placeholder="Tacoma"
              class="rounded-xl border px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600"
              :class="
                errors.model
                  ? 'border-red-500 bg-red-950/20'
                  : 'border-zinc-600 bg-zinc-700 focus:border-blue-500'
              "
            />
            <span
              v-if="errors.model"
              class="text-xs text-red-400"
              >{{ errors.model }}</span
            >
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >License Plate</label
            >
            <input
              v-model="form.plate"
              placeholder="TXK-0000"
              class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-blue-500"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="text-xs font-semibold tracking-widest text-zinc-400 uppercase"
              >Mileage</label
            >
            <input
              v-model="form.mileage"
              placeholder="45,000"
              class="rounded-xl border border-zinc-600 bg-zinc-700 px-4 py-2.5 text-sm text-white transition outline-none placeholder:text-zinc-600 focus:border-blue-500"
            />
          </div>
        </div>

        <div class="mt-5 flex gap-3">
          <button
            class="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-blue-500 active:scale-95"
            @click="submitVehicle"
          >
            Add Vehicle
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
  </main>
</template>
