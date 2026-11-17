import { Suspense } from "react";
import Link from "next/link";
import { stockConfig } from "@/config/stock";
import { GlassCard, SectionHeader } from "@/components/ui/GlassCard";
import { KeyStats, KeyStatsLoading } from "@/components/Fundamentals";
import { FilingList, FilingListLoading } from "@/components/Filings";
import { AnnouncementList } from "@/components/Announcements";
import { TradingViewWidget } from "@/components/TradingViewWidget";

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
          <TradingViewWidget
            widget="advanced-chart"
            className="h-[26rem] sm:h-[30rem]"
            loadingText="Loading the price chart from TradingView."
          />
        </GlassCard>

        <aside className="flex flex-col gap-12 lg:col-span-4">
          <section>
            <SectionHeader
              title="Key figures"
              action={
                <Link href="/metrics" className={linkStyle}>
                  All metrics
                </Link>
              }
            />
            <Suspense fallback={<KeyStatsLoading />}>
              <KeyStats />
            </Suspense>
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

      <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">
        <section>
          <SectionHeader
            title="Latest filings"
            action={
              <Link href="/news" className={linkStyle}>
                All news
              </Link>
            }
          />
          <Suspense fallback={<FilingListLoading count={3} layout="single" />}>
            <FilingList limit={3} layout="single" />
          </Suspense>
        </section>

        {stockConfig.newsroom.feedUrl ? (
          <section>
            <SectionHeader
              title="Latest announcements"
              action={
                <Link href="/news" className={linkStyle}>
                  All news
                </Link>
              }
            />
            <Suspense fallback={<FilingListLoading count={3} layout="single" />}>
              <AnnouncementList limit={3} layout="single" />
            </Suspense>
          </section>
        ) : null}
      </div>
    </div>
  );
}
