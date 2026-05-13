CREATE TABLE `users` (
  `id`            integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `email`         text NOT NULL UNIQUE,
  `password_hash` text NOT NULL,
  `created_at`    text NOT NULL,
  `updated_at`    text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_users_email` ON `users` (`email`);
--> statement-breakpoint

CREATE TABLE `sessions` (
  `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id`    integer NOT NULL REFERENCES `users`(`id`) ON DELETE cascade,
  `token_hash` text NOT NULL UNIQUE,
  `expires_at` text NOT NULL,
  `created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_sessions_token_hash` ON `sessions` (`token_hash`);
--> statement-breakpoint
CREATE INDEX `idx_sessions_user_id` ON `sessions` (`user_id`);
--> statement-breakpoint

CREATE TABLE `vehicles` (
  `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `user_id`    integer NOT NULL REFERENCES `users`(`id`) ON DELETE cascade,
  `year`       text NOT NULL,
  `make`       text NOT NULL,
  `model`      text NOT NULL,
  `plate`      text DEFAULT '' NOT NULL,
  `mileage`    text DEFAULT '' NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_vehicles_user_id` ON `vehicles` (`user_id`);
--> statement-breakpoint

CREATE TABLE `maintenance_logs` (
  `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `vehicle_id` integer NOT NULL REFERENCES `vehicles`(`id`) ON DELETE cascade,
  `type`       text NOT NULL,
  `mileage`    text NOT NULL,
  `date`       text NOT NULL,
  `notes`      text DEFAULT '' NOT NULL,
  `created_at` text NOT NULL,
  `updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_logs_vehicle_id` ON `maintenance_logs` (`vehicle_id`);
--> statement-breakpoint

CREATE TABLE `reminders` (
  `id`          integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `vehicle_id`  integer NOT NULL REFERENCES `vehicles`(`id`) ON DELETE cascade,
  `type`        text NOT NULL,
  `due_mileage` text NOT NULL,
  `notes`       text DEFAULT '' NOT NULL,
  `created_at`  text NOT NULL,
  `updated_at`  text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_reminders_vehicle_id` ON `reminders` (`vehicle_id`);
