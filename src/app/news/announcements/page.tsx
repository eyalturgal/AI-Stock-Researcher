import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { stockConfig } from "@/config/stock";
import { AnnouncementsSection } from "@/components/NewsSections";

export const metadata: Metadata = { title: "Announcements" };

// News > Announcements: the company's newsroom, as far back as the site has
// saved it.
export default function AnnouncementsPage() {
  // A stock with no newsroom feed in the stock config has no such page.
  if (!stockConfig.newsroom.feedUrl) notFound();
  return <AnnouncementsSection />;
}
