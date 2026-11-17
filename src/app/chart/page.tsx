import type { Metadata } from "next";
import { GlassCard, SectionHeader } from "@/components/ui/GlassCard";
import { TradingViewWidget } from "@/components/TradingViewWidget";

export const metadata: Metadata = { title: "Chart" };

// The Chart tab: the full TradingView chart, with its timeframes, chart
// types, indicators and drawing tools.
export default function ChartPage() {
  return (
    <GlassCard>
      <SectionHeader title="Price chart" />
      <TradingViewWidget
        widget="advanced-chart"
        className="h-[32rem] sm:h-[44rem]"
        loadingText="Loading the price chart from TradingView."
      />
    </GlassCard>
  );
}
