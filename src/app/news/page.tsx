import { Suspense } from "react";
import type { Metadata } from "next";
import { stockConfig } from "@/config/stock";
import { SectionHeader } from "@/components/ui/GlassCard";
import { FilingList, FilingListLoading } from "@/components/Filings";
import { TradingViewWidget } from "@/components/TradingViewWidget";

export const metadata: Metadata = { title: "News" };

// The News tab. News is sorted by who is speaking:
// - Official filings: what the company has told the regulator. Ours, from the SEC.
// - News coverage: what the media reports. From TradingView's news feed.
// Company announcements and industry news are still to come.
export default function NewsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section>
        <SectionHeader title="Official filings" />
        <p className="-mt-2 mb-6 max-w-2xl text-sm leading-6 text-ink-soft">
          What {stockConfig.shortName} has reported to the regulator, newest
          first. This is the primary source: the company is legally
          responsible for what these documents say.
        </p>
        <Suspense fallback={<FilingListLoading count={6} />}>
          <FilingList limit={12} />
        </Suspense>
      </section>

      <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">
        <section>
          <SectionHeader title={`${stockConfig.shortName} in the news`} />
          <p className="-mt-2 mb-4 text-sm leading-6 text-ink-soft">
            Media coverage of the company, from TradingView&apos;s news feed.
          </p>
          <TradingViewWidget
            widget="stock-news"
            className="h-[38rem]"
            loadingText="Loading news from TradingView."
          />
        </section>

        <section>
          <SectionHeader title="Market news" />
          <p className="-mt-2 mb-4 text-sm leading-6 text-ink-soft">
            The top stories across the stock market, from TradingView&apos;s
            news feed.
          </p>
          <TradingViewWidget
            widget="market-news"
            className="h-[38rem]"
            loadingText="Loading news from TradingView."
          />
        </section>
      </div>
    </div>
  );
}
