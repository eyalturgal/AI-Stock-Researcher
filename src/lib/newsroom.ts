// Reads the tracked company's own newsroom feed: its press releases and
// blog posts. In the site's news plan this is category B, "Company
// announcements": first-hand, but written by the company to look good.

import { cacheLife } from "next/cache";
import { stockConfig } from "@/config/stock";
import { parseNewsroomFeed, type Announcement } from "@/lib/feed";

export type { Announcement };

// The latest announcements from the company's newsroom feed. Returns null
// if the feed could not be loaded, and an empty list if the stock config has
// no feed for this company.
export async function getAnnouncements(limit: number): Promise<Announcement[] | null> {
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
    const announcements = parseNewsroomFeed(await response.text(), limit);
    // Companies post a few times a day at most. Check every 15 minutes.
    cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
    return announcements;
  } catch (error) {
    console.error("Could not load the newsroom feed:", error);
    cacheLife("minutes");
    return null;
  }
}
