import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle<typeof schema>(pool, { schema })
