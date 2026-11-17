import { defineConfig } from "drizzle-kit";

// Settings for drizzle-kit, the tool that writes the SQL for table changes.
// After editing src/db/schema.ts, run "npm run db:generate". It compares the
// tables with the last saved version and writes the SQL for the difference
// into the drizzle folder.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
});
