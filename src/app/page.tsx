import Link from "next/link";
import { stockConfig } from "@/config/stock";
import {
  sampleKeyStats,
  sampleNews,
  samplePrices,
  sampleQuote,
} from "@/data/sample";
import { formatPrice } from "@/lib/format";
import { CardHeader, GlassCard } from "@/components/ui/GlassCard";
import { StatRow } from "@/components/ui/StatTile";
import { NewsList } from "@/components/NewsList";
import { PriceChart } from "@/components/PriceChart";

// The Overview tab: a little of everything, with links to the full tabs.
export default function OverviewPage() {
  const { currency } = stockConfig;

  // Two stats worked out from the price history, then the rest.
  const keyStats = [
    {
      label: "Previous close",
      value: formatPrice(sampleQuote.previousClose, currency),
    },
    {
      label: "52-week range",
      value: `${formatPrice(sampleQuote.yearLow, currency)} to ${formatPrice(sampleQuote.yearHigh, currency)}`,
    },
    ...sampleKeyStats,
  ];

  return (
    <div className="grid gap-5 sm:gap-6 lg:grid-cols-3">
      <GlassCard className="lg:col-span-2">
        <CardHeader
          title="Price"
          action={
            <Link href="/chart" className="text-sm text-ink-soft hover:text-ink">
              Full chart
            </Link>
          }
        />
        <PriceChart data={samplePrices} currency={currency} />
      </GlassCard>

      <GlassCard>
        <CardHeader
          title="Key stats"
          action={
            <Link href="/metrics" className="text-sm text-ink-soft hover:text-ink">
              All metrics
            </Link>
          }
        />
        <dl>
          {keyStats.map((stat) => (
            <StatRow key={stat.label} stat={stat} />
          ))}
        </dl>
      </GlassCard>

      <GlassCard className="lg:col-span-2">
        <CardHeader
          title="Latest news"
          action={
            <Link href="/news" className="text-sm text-ink-soft hover:text-ink">
              All news
            </Link>
          }
        />
        <NewsList items={sampleNews.slice(0, 3)} />
      </GlassCard>

      <GlassCard>
        <CardHeader title={`About ${stockConfig.shortName}`} />
        <p className="text-sm leading-6 text-ink-soft">{stockConfig.about}</p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stockConfig.keywords.map((keyword) => (
            <li
              key={keyword}
              className="rounded-full border border-line px-2.5 py-1 text-xs text-ink-soft"
            >
              {keyword}
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}
