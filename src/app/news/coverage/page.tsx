import type { Metadata } from "next";
import { CoverageSection } from "@/components/NewsSections";

export const metadata: Metadata = { title: "Media coverage" };

// News > Coverage: TradingView's company and market news feeds, in taller
// boxes than on the "All news" page.
export default function CoveragePage() {
  return <CoverageSection tall />;
}
