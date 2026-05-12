import { ref } from 'vue'

export const SERVICE_TYPES = [
  { label: 'Oil Change', icon: '🛢️' },
  { label: 'Tire Rotation', icon: '🔄' },
  { label: 'Air Filter', icon: '💨' },
  { label: 'Other', icon: '🔧' },
]

export const typeIcon = (type) => SERVICE_TYPES.find((s) => s.label === type)?.icon ?? '🔧'

const vehicles = ref([
  { id: 1, year: '2018', make: 'Toyota', model: 'Tacoma', plate: 'TXK-4821', mileage: '74,200' },
  { id: 2, year: '2005', make: 'Ford', model: 'Mustang GT', plate: 'TXM-0042', mileage: '112,500' },
])

const maintenanceLogs = ref({
  1: [
    { id: 1, type: 'Oil Change', mileage: '72,000', date: '01/15/2024', notes: '' },
    { id: 2, type: 'Tire Rotation', mileage: '70,000', date: '11/03/2023', notes: '' },
  ],
  2: [
    {
      id: 3,
      type: 'Other',
      mileage: '110,000',
      date: '06/20/2023',
      notes: 'Replaced clutch and flywheel.',
    },
  ],
})

const reminders = ref([
  { id: 1, vehicleId: 1, type: 'Oil Change', dueMileage: '77,000', notes: '' },
  { id: 2, vehicleId: 1, type: 'Tire Rotation', dueMileage: '80,000', notes: '' },
  { id: 3, vehicleId: 2, type: 'Other', dueMileage: '115,000', notes: 'Check brake pads.' },
])

let nextVehicleId = 3
let nextLogId = 4
let nextReminderId = 4

export function useGarage() {
  function addVehicle(vehicle) {
    const id = nextVehicleId++
    vehicles.value.push({ ...vehicle, id })
    maintenanceLogs.value[id] = []
  }

  function removeVehicle(id) {
    vehicles.value = vehicles.value.filter((v) => v.id !== id)
    delete maintenanceLogs.value[id]
    reminders.value = reminders.value.filter((r) => r.vehicleId !== id)
  }

  function getVehicleById(id) {
    return vehicles.value.find((v) => v.id === Number(id)) ?? null
  }

  function getLogsForVehicle(vehicleId) {
    return maintenanceLogs.value[Number(vehicleId)] ?? []
  }

  function addLog(vehicleId, entry) {
    const id = Number(vehicleId)
    if (!maintenanceLogs.value[id]) maintenanceLogs.value[id] = []
    maintenanceLogs.value[id].unshift({ ...entry, id: nextLogId++ })
  }

  function removeLog(vehicleId, logId) {
    const id = Number(vehicleId)
    if (!maintenanceLogs.value[id]) return
    maintenanceLogs.value[id] = maintenanceLogs.value[id].filter((l) => l.id !== logId)
  }

  function addReminder(reminder) {
    reminders.value.push({ ...reminder, id: nextReminderId++ })
  }

  function removeReminder(id) {
    reminders.value = reminders.value.filter((r) => r.id !== id)
  }

  return {
    vehicles,
    addVehicle,
    removeVehicle,
    getVehicleById,
    getLogsForVehicle,
    addLog,
    removeLog,
    reminders,
    addReminder,
    removeReminder,
  }
}
