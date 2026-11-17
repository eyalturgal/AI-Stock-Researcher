import { stockConfig } from "@/config/stock";
import { sampleHeadlineStats, sampleQuote } from "@/data/sample";
import { formatDate, formatPrice } from "@/lib/format";
import { ChangePill } from "@/components/ui/ChangePill";
import { StatTile } from "@/components/ui/StatTile";

// The opening of every page: which stock this is and what it costs.
// It sits straight on the page, with no box around it, so the first thing
// you see is the name and the price.
export function StockHeader() {
  const { currency } = stockConfig;

  // The four numbers shown next to the price.
  const headlineStats = [
    {
      label: "Previous close",
      value: formatPrice(sampleQuote.previousClose, currency),
    },
    {
      label: "52-week range",
      value: `${formatPrice(sampleQuote.yearLow, currency)} to ${formatPrice(sampleQuote.yearHigh, currency)}`,
    },
    ...sampleHeadlineStats,
  ];

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

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
            <p className="text-6xl font-semibold tracking-tighter text-ink sm:text-7xl">
              {formatPrice(sampleQuote.price, currency)}
            </p>
            <ChangePill
              change={sampleQuote.change}
              changePercent={sampleQuote.changePercent}
            />
          </div>

          <p className="mt-3 text-sm text-ink-faint">
            Sample data, not real prices. Close on {formatDate(sampleQuote.asOf)}.
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-6 lg:col-span-5">
          {headlineStats.map((stat) => (
            <StatTile key={stat.label} stat={stat} size="small" />
          ))}
        </dl>
      </div>
    </section>
  );
}
