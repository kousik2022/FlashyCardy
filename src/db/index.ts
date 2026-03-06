import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is not set. Add it to .env (see .env.example)."
  );
}

const neonClient = neon(databaseUrl);

/** Wraps the Neon client to turn generic "Failed to fetch" into a clearer error. */
const wrappedNeon = (...args: Parameters<typeof neonClient>) =>
  neonClient(...args).catch((err: unknown) => {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("Failed to fetch") ||
      message.includes("fetch failed") ||
      message.includes("ECONNREFUSED") ||
      message.includes("ENOTFOUND")
    ) {
      throw new Error(
        `Database connection failed: ${message}. ` +
          "Check: 1) Neon project is not suspended (dashboard.neon.tech), 2) DATABASE_URL in .env is correct, 3) Your network allows outbound HTTPS."
      );
    }
    throw err;
  });

// Preserve NeonQueryFunction methods like `.query`, `.unsafe`, `.transaction`
const sql = Object.assign(wrappedNeon, neonClient) as typeof neonClient;

export const db = drizzle({ client: sql, schema });
