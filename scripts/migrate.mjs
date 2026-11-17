// Applies table changes ("migrations") to the database. Runs at the start of
// every build, so the database always matches the code that is about to go
// live. On Vercel, test versions of the site have their own copy of the
// database, so their changes never touch the live one.
//
// Each migration is a SQL file in the drizzle folder. Drizzle remembers which
// ones have already been applied, so running this again does nothing new.

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// On your own computer, settings live in .env.local. On Vercel they come
// from the project's Environment Variables, and there is no such file.
try {
  process.loadEnvFile(".env.local");
} catch {
  // No local settings file. That is normal on Vercel.
}

// Neon recommends the direct ("unpooled") connection for table changes.
const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.log("No DATABASE_URL set, so there is no database to update. Skipping.");
  process.exit(0);
}

const pool = new Pool({ connectionString: url, max: 1 });
try {
  await migrate(drizzle({ client: pool }), { migrationsFolder: "./drizzle" });
  console.log("Database tables are up to date.");
} catch (error) {
  // The site works without the database, so a failure here should not stop
  // the site from going live. It is written loudly to the build log instead.
  console.error("DATABASE UPDATE FAILED. The site will run without stored data until this is fixed.");
  console.error(error);
} finally {
  await pool.end();
}
