import type { Metadata } from "next";
import { stockConfig } from "@/config/stock";
import { samplePrices } from "@/data/sample";
import { GlassCard, SectionHeader } from "@/components/ui/GlassCard";
import { PriceChart } from "@/components/PriceChart";

export const metadata: Metadata = { title: "Chart" };

// The Chart tab: the same chart as the Overview, bigger, with range stats
// and a table of the numbers. Chart types and drawing tools come later.
export default function ChartPage() {
  return (
    <GlassCard>
      <SectionHeader title="Price chart" />
      <PriceChart
        data={samplePrices}
        currency={stockConfig.currency}
        heightClass="h-80 sm:h-[34rem]"
        detailed
      />
    </GlassCard>
  );
}
