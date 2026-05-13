import { index, integer, sqliteTable, text, uniqueIndex } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable(
  'users',
  {
    id:           integer('id').primaryKey({ autoIncrement: true }),
    email:        text('email').notNull().unique(),
    passwordHash: text('password_hash').notNull(),
    createdAt:    text('created_at').notNull(),
    updatedAt:    text('updated_at').notNull(),
  },
  (table) => [uniqueIndex('idx_users_email').on(table.email)],
)

export const sessions = sqliteTable(
  'sessions',
  {
    id:        integer('id').primaryKey({ autoIncrement: true }),
    userId:    integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    tokenHash: text('token_hash').notNull().unique(),
    expiresAt: text('expires_at').notNull(),
    createdAt: text('created_at').notNull(),
  },
  (table) => [
    uniqueIndex('idx_sessions_token_hash').on(table.tokenHash),
    index('idx_sessions_user_id').on(table.userId),
  ],
)

export const vehicles = sqliteTable(
  'vehicles',
  {
    id:        integer('id').primaryKey({ autoIncrement: true }),
    userId:    integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    year:      text('year').notNull(),
    make:      text('make').notNull(),
    model:     text('model').notNull(),
    plate:     text('plate').notNull().default(''),
    mileage:   text('mileage').notNull().default(''),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('idx_vehicles_user_id').on(table.userId)],
)

export const maintenanceLogs = sqliteTable(
  'maintenance_logs',
  {
    id:        integer('id').primaryKey({ autoIncrement: true }),
    vehicleId: integer('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
    type:      text('type').notNull(),
    mileage:   text('mileage').notNull(),
    date:      text('date').notNull(),
    notes:     text('notes').notNull().default(''),
    createdAt: text('created_at').notNull(),
    updatedAt: text('updated_at').notNull(),
  },
  (table) => [index('idx_logs_vehicle_id').on(table.vehicleId)],
)

export const reminders = sqliteTable(
  'reminders',
  {
    id:         integer('id').primaryKey({ autoIncrement: true }),
    vehicleId:  integer('vehicle_id').notNull().references(() => vehicles.id, { onDelete: 'cascade' }),
    type:       text('type').notNull(),
    dueMileage: text('due_mileage').notNull(),
    notes:      text('notes').notNull().default(''),
    createdAt:  text('created_at').notNull(),
    updatedAt:  text('updated_at').notNull(),
  },
  (table) => [index('idx_reminders_vehicle_id').on(table.vehicleId)],
)
