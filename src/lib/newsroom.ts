// Reads the tracked company's own newsroom feed: its press releases and
// blog posts. In the site's news plan this is category B, "Company
// announcements": first-hand, but written by the company to look good.

// Server only: this file reads private settings or the database. The line
// below makes the build fail if it is ever pulled into code that runs in
// the visitor's browser.
import "server-only";
import { cacheLife } from "next/cache";
import { stockConfig } from "@/config/stock";
import { parseNewsroomFeed, type Announcement } from "@/lib/feed";
import { loadAnnouncements, saveAnnouncements } from "@/db/store";

export type { Announcement };

// The most announcements the site shows, on the Announcements page. Other
// pages show the newest few of the same list, so the feed is read once per
// refresh however many pages show it.
const ANNOUNCEMENTS_LIMIT = 50;

// The latest announcements from the company's newsroom feed. New items are
// added to the database each time, so the site keeps a history that goes
// back further than the feed's own last 20 items. Returns null if neither
// the feed nor the database could be read, and an empty list if the stock
// config has no feed for this company.
export async function getAnnouncements(): Promise<Announcement[] | null> {
  "use cache";

  const { feedUrl } = stockConfig.newsroom;
  if (!feedUrl) {
    cacheLife("max");
    return [];
  }

  try {
    const response = await fetch(feedUrl, {
      headers: { "User-Agent": "AI Stock Researcher (non-commercial research site)" },
      signal: AbortSignal.timeout(15_000),
    });
    if (!response.ok) {
      throw new Error(`The feed answered with status ${response.status}`);
    }
    const fresh = parseNewsroomFeed(await response.text(), 100);
    await saveAnnouncements(stockConfig.cik, fresh);
    const stored = await loadAnnouncements(stockConfig.cik, ANNOUNCEMENTS_LIMIT);
    // Companies post a few times a day at most. Check every 15 minutes.
    cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
    return stored && stored.length > 0 ? stored : fresh.slice(0, ANNOUNCEMENTS_LIMIT);
  } catch (error) {
    console.error("Could not load the newsroom feed:", error);
    // The feed is down: show what was stored earlier, if anything.
    const stored = await loadAnnouncements(stockConfig.cik, ANNOUNCEMENTS_LIMIT);
    cacheLife("minutes");
    return stored && stored.length > 0 ? stored : null;
  }
}
