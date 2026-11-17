import type { Metadata } from "next";
import { FilingsSection } from "@/components/NewsSections";

export const metadata: Metadata = { title: "Filings" };

// News > Filings: every recent filing the site keeps for the tracked company.
export default function FilingsPage() {
  return <FilingsSection />;
}
