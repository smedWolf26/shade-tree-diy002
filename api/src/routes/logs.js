import { Hono } from 'hono'
import { getDb } from '../data/db.js'
import { deleteLog, getLogById } from '../data/logs.repository.js'
import { getVehicleById } from '../data/vehicles.repository.js'
import { ApiError } from '../utils/errors.js'
import { sendResource } from '../utils/response.js'
import { parseIdParam } from '../utils/validation.js'

const logs = new Hono()

// ── GET /logs/:id ─────────────────────────────────────────────
logs.get('/:id', async (c) => {
  const userId = c.get('user').sub
  const id     = parseIdParam(c.req.param('id'))
  const db     = getDb(c.env.DB)
  const log    = await getLogById(db, id)
  if (!log) throw new ApiError(404, 'NOT_FOUND', 'Log not found.')

  // Verify ownership via vehicle
  const vehicle = await getVehicleById(db, log.vehicleId, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Log not found.')

  return sendResource(c, log)
})

// ── DELETE /logs/:id ──────────────────────────────────────────
logs.delete('/:id', async (c) => {
  const userId = c.get('user').sub
  const id     = parseIdParam(c.req.param('id'))
  const db     = getDb(c.env.DB)
  const log    = await getLogById(db, id)
  if (!log) throw new ApiError(404, 'NOT_FOUND', 'Log not found.')

  const vehicle = await getVehicleById(db, log.vehicleId, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Log not found.')

  await deleteLog(db, id)
  return c.body(null, 204)
})

export default logs
