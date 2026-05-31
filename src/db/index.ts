import { drizzle } from "drizzle-orm/node-postgres"
import { sql } from "drizzle-orm";
import * as schema from "./schema"

const getSslConfig = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return false;

  try {
    const parsed = new URL(connectionString);
    const sslMode = parsed.searchParams.get("sslmode")?.toLowerCase();
    const hostname = parsed.hostname.toLowerCase();
    const isLocalhost =
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "::1";

    if (isLocalhost || sslMode === "disable" || sslMode === "allow" || sslMode === "prefer") {
      return false;
    }

    if (sslMode === "require" || sslMode === "verify-ca" || sslMode === "verify-full" || sslMode === "no-verify") {
      return { rejectUnauthorized: false };
    }
  } catch {
    return false;
  }

  return false;
};

const sslConfig = getSslConfig();
const connection = process.env.DATABASE_URL

export const db = drizzle<typeof schema>({
  connection: {
    connectionString: connection,
    ssl: sslConfig,
  },
  schema,
})

// Ensure critical tables that may be missing from unapplied migrations exist.
// This is a safety net — proper migrations should be applied via drizzle-kit push.
let _migrated = false;
export async function ensureMigrations() {
  if (_migrated) return;
  _migrated = true;
  try {
    // 0004: rate_limit_buckets table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS "rate_limit_buckets" (
        "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
        "action" text NOT NULL,
        "key" text NOT NULL,
        "count" integer DEFAULT 1 NOT NULL,
        "window_started_at" timestamp DEFAULT now() NOT NULL,
        "blocked_until" timestamp,
        "created_at" timestamp DEFAULT now() NOT NULL,
        "updated_at" timestamp DEFAULT now() NOT NULL
      )
    `);
    await db.execute(sql`CREATE UNIQUE INDEX IF NOT EXISTS "rate_limit_buckets_action_key_idx" ON "rate_limit_buckets" ("action", "key")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "rate_limit_buckets_action_updated_at_idx" ON "rate_limit_buckets" ("action", "updated_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "rate_limit_buckets_blocked_until_idx" ON "rate_limit_buckets" ("blocked_until")`);
    // 0003: core indexes
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "appointments_date_idx" ON "appointments" ("date")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "appointments_status_idx" ON "appointments" ("status")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "appointments_created_at_idx" ON "appointments" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "customer_cars_user_id_idx" ON "customer_cars" ("user_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "customer_cars_status_idx" ON "customer_cars" ("status")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "customer_cars_created_at_idx" ON "customer_cars" ("created_at")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "service_records_car_id_idx" ON "service_records" ("car_id")`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS "service_records_service_date_idx" ON "service_records" ("service_date")`);
  } catch {
    // Best-effort — ignore errors
  }
}
