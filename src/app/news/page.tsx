import type { Metadata } from "next";
import { stockConfig } from "@/config/stock";
import {
  AnnouncementsSection,
  CoverageSection,
  FilingsSection,
  IndustrySection,
} from "@/components/NewsSections";

export const metadata: Metadata = { title: "News" };

// The News tab's own page, "All news": a short version of every section,
// each with a link to its own page under the sub-tabs.
export default function NewsPage() {
  return (
    <div className="flex flex-col gap-16">
      <FilingsSection limit={6} moreHref="/news/filings" />
      {stockConfig.newsroom.feedUrl ? (
        <AnnouncementsSection limit={6} moreHref="/news/announcements" />
      ) : null}
      <IndustrySection limit={6} moreHref="/news/industry" />
      <CoverageSection moreHref="/news/coverage" />
    </div>
  );
}
