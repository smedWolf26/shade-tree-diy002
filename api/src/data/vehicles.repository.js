import { and, desc, eq } from 'drizzle-orm'
import { nowIso } from './db.js'
import { vehicles } from './schema.js'

export async function listVehicles(db, userId) {
  return db.select().from(vehicles).where(eq(vehicles.userId, userId)).orderBy(desc(vehicles.id))
}

export async function getVehicleById(db, id, userId) {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
  return vehicle || null
}

export async function createVehicle(db, userId, input) {
  const timestamp = nowIso()
  const [created] = await db
    .insert(vehicles)
    .values({
      userId,
      year:      input.year.trim(),
      make:      input.make.trim(),
      model:     input.model.trim(),
      plate:     input.plate?.trim() || '',
      mileage:   input.mileage?.trim() || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()
  return created
}

export async function deleteVehicle(db, id, userId) {
  const deleted = await db
    .delete(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, userId)))
    .returning({ id: vehicles.id })
  return deleted.length > 0
}
