import { stockConfig } from "@/config/stock";
import { TradingViewWidget } from "@/components/TradingViewWidget";

// The opening of every page: which stock this is and what it costs.
//
// TradingView's price panel, across the full width. It shows the logo,
// ticker, company name, exchange, price and the day's change, and as space
// allows the next earnings date, EPS, market cap, dividend yield and P/E.
// Our own figures from the SEC are on the Overview and Metrics tabs, the way
// finance sites keep the price on every page and the details on a summary
// page.
export function StockHeader() {
  return (
    <section className="shell pb-10 pt-8 sm:pb-12 sm:pt-10">
      {/* The page title. Hidden from view because the price panel shows the
          name, but still there for screen readers and search engines. */}
      <h1 className="sr-only">
        {stockConfig.name} ({stockConfig.ticker})
      </h1>

      <TradingViewWidget
        widget="symbol-info"
        className="price-panel"
        loadingText="Loading the latest price from TradingView."
      />
    </section>
  );
}
