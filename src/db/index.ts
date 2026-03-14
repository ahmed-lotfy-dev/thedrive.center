import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

const getSslConfig = () => {
  return { rejectUnauthorized: false };
};

const sslConfig = getSslConfig();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: sslConfig,
})

export const db = drizzle(pool as any, { schema })
