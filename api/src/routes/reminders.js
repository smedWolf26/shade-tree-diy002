import { Hono } from 'hono'
import { getDb } from '../data/db.js'
import { createReminder, deleteReminder, getReminderById, listReminders } from '../data/reminders.repository.js'
import { getVehicleById } from '../data/vehicles.repository.js'
import { parseJsonBody } from '../utils/body.js'
import { ApiError } from '../utils/errors.js'
import { sendCollection, sendResource } from '../utils/response.js'
import { parseIdParam, validateReminderCreate } from '../utils/validation.js'

const reminders = new Hono()

// ── GET /reminders ────────────────────────────────────────────
reminders.get('/', async (c) => {
  const userId = c.get('user').sub
  const db     = getDb(c.env.DB)
  const data   = await listReminders(db, userId)
  return sendCollection(c, data)
})

// ── POST /reminders ───────────────────────────────────────────
reminders.post('/', async (c) => {
  const userId  = c.get('user').sub
  const payload = await parseJsonBody(c)
  const details = validateReminderCreate(payload)
  if (details.length > 0) throw new ApiError(422, 'VALIDATION_ERROR', 'Some fields are invalid.', details)

  const db      = getDb(c.env.DB)
  const vehicle = await getVehicleById(db, payload.vehicleId, userId)
  if (!vehicle) throw new ApiError(404, 'NOT_FOUND', 'Vehicle not found.')

  const reminder = await createReminder(db, payload)
  c.header('Location', `/api/reminders/${reminder.id}`)
  return sendResource(c, reminder, 201)
})

// ── DELETE /reminders/:id ─────────────────────────────────────
reminders.delete('/:id', async (c) => {
  const userId   = c.get('user').sub
  const id       = parseIdParam(c.req.param('id'))
  const db       = getDb(c.env.DB)
  const reminder = await getReminderById(db, id, userId)
  if (!reminder) throw new ApiError(404, 'NOT_FOUND', 'Reminder not found.')

  await deleteReminder(db, id)
  return c.body(null, 204)
})

export default reminders
