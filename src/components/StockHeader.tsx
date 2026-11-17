import { Suspense } from "react";
import { stockConfig } from "@/config/stock";
import { HeadlineStats, HeadlineStatsLoading } from "@/components/Fundamentals";
import { TradingViewWidget } from "@/components/TradingViewWidget";

// The opening of every page: which stock this is, what it costs, and four
// headline figures from its accounts.
//
// The price comes from a TradingView widget. The figures on the right come
// from the SEC. <Suspense> shows gray placeholder bars until they arrive.
export function StockHeader() {
  return (
    <section className="shell pb-10 pt-10 sm:pb-12 sm:pt-14">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
        <div className="lg:col-span-7">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-soft">
            {/* The ticker, in a small gold tag. */}
            <span className="rounded-md border border-gold/40 bg-gold/15 px-2 py-0.5 text-xs font-semibold tracking-wide text-ink">
              {stockConfig.ticker}
            </span>
            <span>{stockConfig.exchange}</span>
            <span className="text-ink-faint" aria-hidden="true">
              ·
            </span>
            <span>{stockConfig.industry}</span>
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            {stockConfig.name}
          </h1>

          <TradingViewWidget
            widget="single-ticker"
            className="mt-5 max-w-md"
            loadingText="Loading the latest price from TradingView."
          />
        </div>

        <div className="lg:col-span-5">
          <Suspense fallback={<HeadlineStatsLoading />}>
            <HeadlineStats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
