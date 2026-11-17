// The connection to the site's database (Postgres, hosted by Neon).
//
// The address and password come from the DATABASE_URL setting, which Vercel
// fills in from the Neon connection. It is never written in the code.
//
// The database is optional. Without DATABASE_URL, db is null and the site
// still works: it reads everything from its sources each time, as before.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "@/db/schema";

const url = process.env.DATABASE_URL;

export const db = url
  ? drizzle({
      // A "pool" keeps a few connections open and reuses them, which is much
      // faster than opening a new connection for every question.
      client: new Pool({
        connectionString: url,
        max: 3,
        idleTimeoutMillis: 10_000,
        connectionTimeoutMillis: 5_000,
      }),
      schema,
    })
  : null;
