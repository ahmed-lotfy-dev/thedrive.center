CREATE INDEX IF NOT EXISTS "appointments_date_idx" ON "appointments" ("date");
CREATE INDEX IF NOT EXISTS "appointments_status_idx" ON "appointments" ("status");
CREATE INDEX IF NOT EXISTS "appointments_created_at_idx" ON "appointments" ("created_at");

CREATE INDEX IF NOT EXISTS "customer_cars_user_id_idx" ON "customer_cars" ("user_id");
CREATE INDEX IF NOT EXISTS "customer_cars_status_idx" ON "customer_cars" ("status");
CREATE INDEX IF NOT EXISTS "customer_cars_created_at_idx" ON "customer_cars" ("created_at");

CREATE INDEX IF NOT EXISTS "service_records_car_id_idx" ON "service_records" ("car_id");
CREATE INDEX IF NOT EXISTS "service_records_service_date_idx" ON "service_records" ("service_date");
