import { ref } from 'vue'

const vehicles = ref([
  {
    id: 1,
    year: '2018',
    make: 'Toyota',
    model: 'Tacoma',
    plate: 'TXK-4821',
    mileage: '74,200',
    color: 'Cement Gray',
    notes: 'Daily driver. Needs alignment check.',
  },
  {
    id: 2,
    year: '2005',
    make: 'Ford',
    model: 'Mustang GT',
    plate: 'TXM-0042',
    mileage: '112,500',
    color: 'Torch Red',
    notes: 'Weekend project car.',
  },
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

let nextVehicleId = 3
let nextLogId = 4

export function useGarage() {
  function addVehicle(vehicle) {
    const id = nextVehicleId++
    vehicles.value.push({ ...vehicle, id })
    maintenanceLogs.value[id] = []
  }

  function removeVehicle(id) {
    vehicles.value = vehicles.value.filter((v) => v.id !== id)
    delete maintenanceLogs.value[id]
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

  return {
    vehicles,
    addVehicle,
    removeVehicle,
    getVehicleById,
    getLogsForVehicle,
    addLog,
    removeLog,
  }
}
