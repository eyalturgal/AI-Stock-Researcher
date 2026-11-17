// Turns an RSS news feed into announcements the site can show.
//
// RSS is a standard format for news feeds, written in XML. The
// fast-xml-parser library turns the XML into plain JavaScript objects.
//
// This file is pure logic. It never talks to the internet, so it can be
// tested with a saved copy of a feed. Fetching lives in newsroom.ts.

import { XMLParser } from "fast-xml-parser";
import { decodeHTML } from "entities";

export type Announcement = {
  id: string;
  kind: "Announcement" | "Blog post";
  title: string;
  url: string;
  publishedOn: string; // YYYY-MM-DD
  summary: string;
};

// One item in an RSS feed, as the parser hands it over.
type FeedItem = {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
};

// Strip HTML tags and codes like &amp; from feed text, and tidy the spaces.
function plainText(html: string): string {
  return decodeHTML(html.replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  // Cut at a space and drop trailing punctuation, so it never ends in ".…".
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[\s.,;:]+$/, "")}…`;
}

// Turn the feed's XML into announcements, newest first. Pure logic, so it
// can be tested with a saved copy of the feed.
export function parseNewsroomFeed(xml: string, limit: number): Announcement[] {
  const parser = new XMLParser({
    ignoreAttributes: true,
    // Keep every value as text (a title like "2026" must not become a number).
    parseTagValue: false,
    // Always give a list of items, even when the feed has only one.
    isArray: (tagName) => tagName === "item",
  });
  const feed = parser.parse(xml);
  const items: FeedItem[] = feed?.rss?.channel?.item ?? [];

  const announcements: Announcement[] = [];
  for (const item of items) {
    if (!item.title || !item.link || !item.pubDate) continue;
    const published = new Date(item.pubDate);
    if (Number.isNaN(published.getTime())) continue;

    const url = item.link.trim();
    announcements.push({
      id: url,
      // Company blogs live on an address with "blog" in it. Everything else
      // in the feed is a formal announcement.
      kind: new URL(url).hostname.includes("blog") ? "Blog post" : "Announcement",
      title: plainText(item.title),
      url,
      publishedOn: published.toISOString().slice(0, 10),
      // Feeds often end a summary with "[…]". It is cut off, then shortened.
      summary: shorten(plainText(item.description ?? "").replace(/\[…\]$|\[\.\.\.\]$/, "").trim(), 220),
    });
  }

  // Newest first. Items from the same day keep the feed's own order.
  return announcements
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, limit);
}
