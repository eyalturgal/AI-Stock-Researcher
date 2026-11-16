import { stockConfig } from "@/config/stock";
import { sampleQuote } from "@/data/sample";
import { formatDate, formatPrice } from "@/lib/format";
import { ChangePill } from "@/components/ui/ChangePill";

// The big panel that says which stock this is and what it costs.
// It sits above the tabs on every page.
export function StockHeader() {
  return (
    <section className="glass rounded-3xl p-5 sm:p-7">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          {/* A plain tile with the ticker, in place of a company logo. */}
          <div
            aria-hidden="true"
            className="glass flex size-14 shrink-0 items-center justify-center rounded-2xl text-sm font-semibold tracking-wide text-ink"
          >
            {stockConfig.ticker}
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              {stockConfig.name}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {stockConfig.ticker}
              <span className="mx-2 text-ink-faint" aria-hidden="true">
                ·
              </span>
              {stockConfig.exchange}
              <span className="mx-2 text-ink-faint" aria-hidden="true">
                ·
              </span>
              {stockConfig.industry}
            </p>
          </div>
        </div>

        <div className="sm:text-right">
          <div className="flex flex-wrap items-center gap-3 sm:justify-end">
            <p className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              {formatPrice(sampleQuote.price, stockConfig.currency)}
            </p>
            <ChangePill
              change={sampleQuote.change}
              changePercent={sampleQuote.changePercent}
            />
          </div>
          <p className="mt-2 text-xs text-ink-faint">
            Sample close on {formatDate(sampleQuote.asOf)}
          </p>
        </div>
      </div>
    </section>
  );
}
