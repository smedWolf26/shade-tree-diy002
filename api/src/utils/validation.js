import { z } from 'zod'
import { ApiError } from './errors.js'
import { SERVICE_TYPES } from './constants.js'

const serviceTypeMessage = `Type must be one of: ${SERVICE_TYPES.join(', ')}.`

// ── ID param ──────────────────────────────────────────────────
const idParamSchema = z
  .string()
  .regex(/^\d+$/, { error: 'ID must be a positive integer.' })
  .transform((v) => Number(v))
  .refine((v) => Number.isSafeInteger(v) && v > 0, { error: 'ID must be a positive integer.' })

export function parseIdParam(rawValue, fieldName = 'id') {
  const result = idParamSchema.safeParse(rawValue)
  if (!result.success) {
    throw new ApiError(400, 'BAD_REQUEST', 'Malformed request.', [
      { field: fieldName, issue: result.error.issues[0]?.message || 'ID must be a positive integer.' },
    ])
  }
  return result.data
}

// ── Auth ──────────────────────────────────────────────────────
const registerSchema = z.strictObject({
  email:    z.email({ error: 'Email must be a valid email address.' }),
  password: z.string({ error: 'Password is required.' }).min(8, { error: 'Password must be at least 8 characters.' }),
})

const loginSchema = z.strictObject({
  email:    z.email({ error: 'Email must be a valid email address.' }),
  password: z.string({ error: 'Password is required.' }).min(1, { error: 'Password is required.' }),
})

const refreshSchema = z.strictObject({
  refresh_token: z.string({ error: 'Refresh token is required.' }).min(1, { error: 'Refresh token is required.' }),
})

const logoutSchema = z.strictObject({
  refresh_token: z.string({ error: 'Refresh token is required.' }).min(1, { error: 'Refresh token is required.' }),
})

// ── Vehicles ──────────────────────────────────────────────────
const vehicleCreateSchema = z.strictObject({
  year:    z.string({ error: 'Year is required.' }).trim().regex(/^\d{4}$/, { error: 'Year must be a 4-digit number.' }),
  make:    z.string({ error: 'Make is required.' }).trim().min(1, { error: 'Make is required.' }),
  model:   z.string({ error: 'Model is required.' }).trim().min(1, { error: 'Model is required.' }),
  plate:   z.string().trim().optional(),
  mileage: z.string().trim().optional(),
})

// ── Maintenance logs ──────────────────────────────────────────
const logCreateSchema = z.strictObject({
  type:    z.string({ error: serviceTypeMessage }).refine((v) => SERVICE_TYPES.includes(v), { error: serviceTypeMessage }),
  mileage: z.string({ error: 'Mileage is required.' }).trim().min(1, { error: 'Mileage is required.' }),
  date:    z.string({ error: 'Date is required.' }).trim().min(1, { error: 'Date is required.' }),
  notes:   z.string().trim().optional(),
})

// ── Reminders ─────────────────────────────────────────────────
const reminderCreateSchema = z.strictObject({
  vehicleId:  z.number({ error: 'Vehicle ID is required.' }).int().positive({ error: 'Vehicle ID must be a positive integer.' }),
  type:       z.string({ error: serviceTypeMessage }).refine((v) => SERVICE_TYPES.includes(v), { error: serviceTypeMessage }),
  dueMileage: z.string({ error: 'Due mileage is required.' }).trim().min(1, { error: 'Due mileage is required.' }),
  notes:      z.string().trim().optional(),
})

// ── Shared validator helper ───────────────────────────────────
function mapZodIssuesToDetails(issues) {
  return issues.flatMap((issue) => {
    if (issue.code === 'unrecognized_keys') {
      return issue.keys.map((key) => ({ field: key, issue: 'Field is not allowed.' }))
    }
    if (issue.code === 'invalid_type' && issue.path.length === 0) {
      return [{ field: 'body', issue: 'Request body must be a JSON object.' }]
    }
    return [{ field: issue.path.length > 0 ? issue.path.join('.') : 'body', issue: issue.message }]
  })
}

function validateWithSchema(payload, schema) {
  const result = schema.safeParse(payload)
  return result.success ? [] : mapZodIssuesToDetails(result.error.issues)
}

export const validateRegister      = (p) => validateWithSchema(p, registerSchema)
export const validateLogin         = (p) => validateWithSchema(p, loginSchema)
export const validateRefresh       = (p) => validateWithSchema(p, refreshSchema)
export const validateLogout        = (p) => validateWithSchema(p, logoutSchema)
export const validateVehicleCreate = (p) => validateWithSchema(p, vehicleCreateSchema)
export const validateLogCreate     = (p) => validateWithSchema(p, logCreateSchema)
export const validateReminderCreate = (p) => validateWithSchema(p, reminderCreateSchema)
