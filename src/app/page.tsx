import Link from "next/link";
import { stockConfig } from "@/config/stock";
import { sampleKeyStats, sampleNews, samplePrices } from "@/data/sample";
import { GlassCard, SectionHeader } from "@/components/ui/GlassCard";
import { StatRow } from "@/components/ui/StatTile";
import { NewsList } from "@/components/NewsList";
import { PriceChart } from "@/components/PriceChart";

const linkStyle = "text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline";

// The Overview tab: a little of everything, with links to the full tabs.
// The chart is the one glass panel. Everything else sits on the open page.
export default function OverviewPage() {
  return (
    <div className="flex flex-col gap-16">
      <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
        <GlassCard className="lg:col-span-8 lg:self-start">
          <SectionHeader
            title="Price"
            action={
              <Link href="/chart" className={linkStyle}>
                Full chart
              </Link>
            }
          />
          <PriceChart
            data={samplePrices}
            currency={stockConfig.currency}
            heightClass="h-72 sm:h-96"
          />
        </GlassCard>

        <aside className="flex flex-col gap-12 lg:col-span-4">
          <section>
            <SectionHeader
              title="Key stats"
              action={
                <Link href="/metrics" className={linkStyle}>
                  All metrics
                </Link>
              }
            />
            <dl className="border-b border-line">
              {sampleKeyStats.map((stat) => (
                <StatRow key={stat.label} stat={stat} />
              ))}
            </dl>
          </section>

          <section>
            <SectionHeader title={`About ${stockConfig.shortName}`} />
            <p className="leading-7 text-ink-soft">{stockConfig.about}</p>
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
          </section>
        </aside>
      </div>

      <section>
        <SectionHeader
          title="Latest news"
          action={
            <Link href="/news" className={linkStyle}>
              All news
            </Link>
          }
        />
        <NewsList items={sampleNews.slice(0, 3)} layout="columns" />
      </section>
    </div>
  );
}
