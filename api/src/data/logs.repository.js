import { desc, eq } from 'drizzle-orm'
import { nowIso } from './db.js'
import { maintenanceLogs } from './schema.js'

export async function listLogs(db, vehicleId) {
  return db
    .select()
    .from(maintenanceLogs)
    .where(eq(maintenanceLogs.vehicleId, vehicleId))
    .orderBy(desc(maintenanceLogs.id))
}

export async function createLog(db, vehicleId, input) {
  const timestamp = nowIso()
  const [created] = await db
    .insert(maintenanceLogs)
    .values({
      vehicleId,
      type:      input.type.trim(),
      mileage:   input.mileage.trim(),
      date:      input.date.trim(),
      notes:     input.notes?.trim() || '',
      createdAt: timestamp,
      updatedAt: timestamp,
    })
    .returning()
  return created
}

export async function getLogById(db, id) {
  const [log] = await db.select().from(maintenanceLogs).where(eq(maintenanceLogs.id, id))
  return log || null
}

export async function deleteLog(db, id) {
  const deleted = await db
    .delete(maintenanceLogs)
    .where(eq(maintenanceLogs.id, id))
    .returning({ id: maintenanceLogs.id })
  return deleted.length > 0
}
