import { desc, eq } from 'drizzle-orm'
import { nowIso } from './db.js'
import { reminders, vehicles } from './schema.js'

export async function listReminders(db, userId) {
  return db
    .select({ reminders })
    .from(reminders)
    .innerJoin(vehicles, eq(reminders.vehicleId, vehicles.id))
    .where(eq(vehicles.userId, userId))
    .orderBy(desc(reminders.id))
    .then((rows) => rows.map((r) => r.reminders))
}

export async function getReminderById(db, id, userId) {
  const [row] = await db
    .select({ reminders })
    .from(reminders)
    .innerJoin(vehicles, eq(reminders.vehicleId, vehicles.id))
    .where(eq(reminders.id, id))
  const reminder = row?.reminders || null
  if (!reminder) return null
  // Verify it belongs to this user via the joined vehicle
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, reminder.vehicleId))
  return vehicle?.userId === userId ? reminder : null
}

export async function createReminder(db, input) {
  const timestamp = nowIso()
  const [created] = await db
    .insert(reminders)
    .values({
      vehicleId:  input.vehicleId,
      type:       input.type.trim(),
      dueMileage: input.dueMileage.trim(),
      notes:      input.notes?.trim() || '',
      createdAt:  timestamp,
      updatedAt:  timestamp,
    })
    .returning()
  return created
}

export async function deleteReminder(db, id) {
  const deleted = await db
    .delete(reminders)
    .where(eq(reminders.id, id))
    .returning({ id: reminders.id })
  return deleted.length > 0
}
