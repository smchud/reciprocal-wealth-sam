import { Pool, type QueryResultRow } from "pg";
import { attachDatabasePool } from "@vercel/functions";

declare global {
  var __rwPgPool: Pool | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString, max: 5 });
  attachDatabasePool(pool);
  return pool;
}

// Reused across requests on the same warm instance (Vercel Fluid compute).
export const pool = globalThis.__rwPgPool ?? createPool();
if (process.env.NODE_ENV !== "production") {
  globalThis.__rwPgPool = pool;
}

export function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params?: unknown[]
) {
  return pool.query<T>(text, params);
}
