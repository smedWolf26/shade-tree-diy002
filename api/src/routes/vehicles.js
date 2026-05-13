import { Hono } from 'hono'
import { getDb } from '../data/db.js'
import { createVehicle, deleteVehicle, getVehicleById, listVehicles } from '../data/vehicles.repository.js'
import { createLog, deleteLog, getLogById, listLogs } from '../data/logs.repository.js'
import { parseJsonBody } from '../utils/body.js'
import { ApiError } from '../utils/errors.js'
import { sendCollection, sendResource } from '../utils/response.js'
import { parseIdParam, validateVehicleCreate, validateLogCreate } from '../utils/validation.js'

const vehicles = new Hono()

// ── GET /vehicles ─────────────────────────────────────────────
vehicles.get('/', async (c) => {
  const userId = c.get('user').sub
  const db     = getDb(c.env.DB)
  const data   = await listVehicles(db, userId)
  return sendCollection(c, data)
})

// ── POST /vehicles ────────────────────────────────────────────
vehicles.post('/', async (c) => {
  const userId  = c.get('user').sub
  const payload = await parseJsonBody(c)
  const details = validateVehicleCreate(payload)
  if (details.length > 0) throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details)

  const db      = getDb(c.env.DB)
  const vehicle = await createVehicle(db, userId, payload)
  c.header('Location', `/api/vehicles/${vehicle.id}`)
  return sendResource(c, vehicle, 201)
})

// ── GET /vehicles/:id ─────────────────────────────────────────
vehicles.get('/:id', async (c) => {
  const userId  = c.get('user').sub
  const id      = parseIdParam(c.req.param('id'))
  const db      = getDb(c.env.DB)
  const vehicle = await getVehicleById(db, id, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found.')
  return sendResource(c, vehicle)
})

// ── DELETE /vehicles/:id ──────────────────────────────────────
vehicles.delete('/:id', async (c) => {
  const userId  = c.get('user').sub
  const id      = parseIdParam(c.req.param('id'))
  const db      = getDb(c.env.DB)
  const deleted = await deleteVehicle(db, id, userId)
  if (!deleted) throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found.')
  return c.body(null, 204)
})

// ── GET /vehicles/:id/logs ────────────────────────────────────
vehicles.get('/:id/logs', async (c) => {
  const userId  = c.get('user').sub
  const id      = parseIdParam(c.req.param('id'))
  const db      = getDb(c.env.DB)
  const vehicle = await getVehicleById(db, id, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found.')
  const data = await listLogs(db, id)
  return sendCollection(c, data)
})

// ── POST /vehicles/:id/logs ───────────────────────────────────
vehicles.post('/:id/logs', async (c) => {
  const userId  = c.get('user').sub
  const id      = parseIdParam(c.req.param('id'))
  const db      = getDb(c.env.DB)
  const vehicle = await getVehicleById(db, id, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found.')

  const payload = await parseJsonBody(c)
  const details = validateLogCreate(payload)
  if (details.length > 0) throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details)

  const log = await createLog(db, id, payload)
  c.header('Location', `/api/logs/${log.id}`)
  return sendResource(c, log, 201)
})

export default vehicles
