import type { Metadata } from "next";
import { IndustrySection } from "@/components/NewsSections";

export const metadata: Metadata = { title: "Industry news" };

// News > Industry: newsworthy filings from the rivals and suppliers listed
// in the stock config.
export default function IndustryPage() {
  return <IndustrySection />;
}
