// The tables in the site's database (Postgres, hosted by Neon).
//
// Each table is written in TypeScript with Drizzle, which turns it into SQL.
// To change a table: edit it here, run "npm run db:generate" to write the
// SQL for the change into the drizzle folder, and commit both. The change is
// applied to the database automatically at the start of the next build.

import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

// What the site found inside a filing at the SEC: its attached documents and,
// for foreign company reports, its subject. A filing never changes once it
// is published, so each one is read from the SEC once and kept here.
export const filingDetails = pgTable("filing_details", {
  // The filing's number at the SEC (its "accession number").
  accession: text("accession").primaryKey(),
  // The SEC number of the company that filed it.
  cik: text("cik").notNull(),
  subject: text("subject"),
  // A list of { title, url }, stored as JSON.
  attachments: jsonb("attachments").$type<{ title: string; url: string }[]>().notNull(),
  readAt: timestamp("read_at", { withTimezone: true }).notNull().defaultNow(),
});

// Every item seen in a company's newsroom feed. The feed itself only holds
// its latest 20 items, so this table is what keeps the history.
export const announcements = pgTable(
  "announcements",
  {
    url: text("url").primaryKey(),
    // The SEC number of the company whose newsroom it came from.
    cik: text("cik").notNull(),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }).notNull(),
    firstSeenAt: timestamp("first_seen_at", { withTimezone: true }).notNull().defaultNow(),
  },
  // Pages ask for "one company's latest items", so the database keeps an
  // index (a sorted lookup list) for exactly that question.
  (table) => [index("announcements_by_company_and_date").on(table.cik, table.publishedAt)],
);
