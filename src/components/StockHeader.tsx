import { Suspense } from "react";
import { stockConfig } from "@/config/stock";
import { HeadlineStats, HeadlineStatsLoading } from "@/components/Fundamentals";
import { TradingViewWidget } from "@/components/TradingViewWidget";

// The opening of every page: which stock this is, what it costs, and four
// headline figures from its accounts.
//
// Left: TradingView's price panel. It already shows the logo, ticker,
// company name, exchange, price, market cap and P/E, so we do not repeat
// any of those ourselves.
// Right: figures from the SEC that the panel does not show. <Suspense>
// shows gray placeholder bars until they arrive.
export function StockHeader() {
  return (
    <section className="shell pb-10 pt-8 sm:pb-12 sm:pt-10">
      {/* The page title. Hidden from view because the price panel shows the
          name, but still there for screen readers and search engines. */}
      <h1 className="sr-only">
        {stockConfig.name} ({stockConfig.ticker})
      </h1>

      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
        <TradingViewWidget
          widget="symbol-info"
          className="lg:col-span-7"
          loadingText="Loading the latest price from TradingView."
        />

        <div className="lg:col-span-5">
          <Suspense fallback={<HeadlineStatsLoading />}>
            <HeadlineStats />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
