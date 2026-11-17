// Reading and writing the site's stored data.
//
// Every function here treats the database as optional, the same way the site
// treats every outside source: if the database is missing or fails, the
// problem is logged, nothing is returned, and the caller falls back to the
// live source.

// Server only: this file reads private settings or the database. The line
// below makes the build fail if it is ever pulled into code that runs in
// the visitor's browser.
import "server-only";
import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { announcements, filingDetails } from "@/db/schema";
import type { FilingDetails } from "@/lib/documents";
import type { Announcement } from "@/lib/feed";

// ---------- Filing details ----------

// What was found inside a filing earlier, or null if it was never read.
export async function loadFilingDetails(accession: string): Promise<FilingDetails | null> {
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(filingDetails)
      .where(eq(filingDetails.accession, accession))
      .limit(1);
    if (rows.length === 0) return null;
    return { subject: rows[0].subject, attachments: rows[0].attachments };
  } catch (error) {
    console.error("Could not read a filing from the database:", error);
    return null;
  }
}

export async function saveFilingDetails(
  accession: string,
  cik: string,
  details: FilingDetails,
): Promise<void> {
  if (!db) return;
  try {
    await db
      .insert(filingDetails)
      .values({ accession, cik, ...details })
      // Two page loads can read the same filing at once. Keep the first copy.
      .onConflictDoNothing();
  } catch (error) {
    console.error("Could not store a filing in the database:", error);
  }
}

// ---------- Newsroom history ----------

// Add new feed items, and refresh ones seen before in case the company
// edited a title or summary.
export async function saveAnnouncements(cik: string, items: Announcement[]): Promise<void> {
  if (!db || items.length === 0) return;
  try {
    await db
      .insert(announcements)
      .values(
        items.map((item) => ({
          url: item.url,
          cik,
          kind: item.kind,
          title: item.title,
          summary: item.summary,
          publishedAt: new Date(item.publishedAt),
        })),
      )
      .onConflictDoUpdate({
        target: announcements.url,
        set: {
          kind: sqlExcluded("kind"),
          title: sqlExcluded("title"),
          summary: sqlExcluded("summary"),
        },
      });
  } catch (error) {
    console.error("Could not store announcements in the database:", error);
  }
}

// The latest stored items for one company, newest first. Returns null if
// the database is missing or fails.
export async function loadAnnouncements(
  cik: string,
  limit: number,
): Promise<Announcement[] | null> {
  if (!db) return null;
  try {
    const rows = await db
      .select()
      .from(announcements)
      .where(eq(announcements.cik, cik))
      .orderBy(desc(announcements.publishedAt))
      .limit(limit);
    return rows.map((row) => ({
      id: row.url,
      kind: row.kind as Announcement["kind"],
      title: row.title,
      url: row.url,
      publishedAt: row.publishedAt.toISOString(),
      publishedOn: row.publishedAt.toISOString().slice(0, 10),
      summary: row.summary,
    }));
  } catch (error) {
    console.error("Could not read announcements from the database:", error);
    return null;
  }
}

// In an "insert, or update if it already exists" statement, Postgres calls
// the row that was about to be inserted "excluded". This picks one of its
// columns.
function sqlExcluded(column: string) {
  return sql.raw(`excluded.${column}`);
}
