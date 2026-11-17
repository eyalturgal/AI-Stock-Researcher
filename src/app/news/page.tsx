import { Suspense } from "react";
import type { Metadata } from "next";
import { stockConfig } from "@/config/stock";
import { SectionHeader } from "@/components/ui/GlassCard";
import { FilingList, FilingListLoading, IndustryList } from "@/components/Filings";
import { AnnouncementList } from "@/components/Announcements";
import { TradingViewWidget } from "@/components/TradingViewWidget";

export const metadata: Metadata = { title: "News" };

// A short line under each section title saying what it holds.
function Intro({ children }: { children: React.ReactNode }) {
  return <p className="-mt-2 mb-6 max-w-2xl text-sm leading-6 text-ink-soft">{children}</p>;
}

// The News tab. News is sorted by who is speaking, most reliable first:
// - Official filings: what the company has told the regulator
// - Company announcements: what the company says about itself
// - Industry: filings from rivals and suppliers
// - Media coverage and market news, from TradingView's news feed
export default function NewsPage() {
  return (
    <div className="flex flex-col gap-16">
      <section>
        <SectionHeader title="Official filings" />
        <Intro>
          What {stockConfig.shortName} has reported to the regulator, newest
          first. This is the primary source: the company is legally responsible
          for what these documents say.
        </Intro>
        <Suspense fallback={<FilingListLoading count={6} />}>
          <FilingList limit={12} />
        </Suspense>
      </section>

      {stockConfig.newsroom.feedUrl ? (
        <section>
          <SectionHeader title="Company announcements" />
          <Intro>
            Press releases and blog posts from {stockConfig.shortName}&apos;s
            newsroom. First-hand, but written by the company about itself.
          </Intro>
          <Suspense fallback={<FilingListLoading count={4} />}>
            <AnnouncementList limit={10} />
          </Suspense>
        </section>
      ) : null}

      <section>
        <SectionHeader title="Industry" />
        <Intro>
          What rivals and suppliers have reported to the regulator. Their
          results and deals often move this stock too.
        </Intro>
        <Suspense fallback={<FilingListLoading count={4} />}>
          <IndustryList limit={10} />
        </Suspense>
      </section>

      <div className="grid gap-x-14 gap-y-16 lg:grid-cols-2">
        <section>
          <SectionHeader title={`${stockConfig.shortName} in the news`} />
          <Intro>Media coverage of the company, from TradingView&apos;s news feed.</Intro>
          <TradingViewWidget
            widget="stock-news"
            className="h-[38rem]"
            loadingText="Loading news from TradingView."
          />
        </section>

        <section>
          <SectionHeader title="Market news" />
          <Intro>
            The top stories across the stock market, from TradingView&apos;s
            news feed.
          </Intro>
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
