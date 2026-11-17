import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { stockConfig } from "@/config/stock";
import { SectionHeader } from "@/components/ui/GlassCard";
import { FilingList, FilingListLoading, IndustryList } from "@/components/Filings";
import { AnnouncementList } from "@/components/Announcements";
import { TradingViewWidget } from "@/components/TradingViewWidget";

// The sections of the News tab, sorted by who is speaking, most reliable
// first:
// - Official filings: what the company has told the regulator
// - Company announcements: what the company says about itself
// - Industry: filings from rivals and suppliers
// - Media coverage: company and market news, from TradingView's news feed
//
// The "All news" page shows each section in short form, with a link to the
// section's own page under the News sub-tabs, where it shows in full.

const linkStyle = "text-sm text-ink-soft underline-offset-4 hover:text-ink hover:underline";

type SectionProps = {
  // How many items to show. Leave it out to show all of them.
  limit?: number;
  // The section's own page, linked from its title row. Leave it out on
  // that page itself.
  moreHref?: string;
};

// A short line under each section title saying what it holds.
function Intro({ children }: { children: ReactNode }) {
  return <p className="-mt-2 mb-6 max-w-2xl text-sm leading-6 text-ink-soft">{children}</p>;
}

// The link from a short section to its own page.
function More({ href, children }: { href?: string; children: ReactNode }) {
  if (!href) return null;
  return (
    <Link href={href} className={linkStyle}>
      {children}
    </Link>
  );
}

export function FilingsSection({ limit, moreHref }: SectionProps) {
  return (
    <section>
      <SectionHeader title="Official filings" action={<More href={moreHref}>More filings</More>} />
      <Intro>
        What {stockConfig.shortName} has reported to the regulator, newest
        first. This is the primary source: the company is legally responsible
        for what these documents say.
      </Intro>
      <Suspense fallback={<FilingListLoading count={6} />}>
        <FilingList limit={limit} />
      </Suspense>
    </section>
  );
}

export function AnnouncementsSection({ limit, moreHref }: SectionProps) {
  return (
    <section>
      <SectionHeader
        title="Company announcements"
        action={<More href={moreHref}>More announcements</More>}
      />
      <Intro>
        Press releases and blog posts from {stockConfig.shortName}&apos;s
        newsroom. First-hand, but written by the company about itself.
        {moreHref
          ? null
          : " The newsroom's feed only lists its latest items, so the site saves each one it sees, and this list grows over time."}
      </Intro>
      <Suspense fallback={<FilingListLoading count={4} />}>
        <AnnouncementList limit={limit} />
      </Suspense>
    </section>
  );
}

export function IndustrySection({ limit, moreHref }: SectionProps) {
  return (
    <section>
      <SectionHeader title="Industry" action={<More href={moreHref}>More industry news</More>} />
      <Intro>
        What rivals and suppliers have reported to the regulator. Their
        results and deals often move this stock too.
      </Intro>
      <Suspense fallback={<FilingListLoading count={4} />}>
        <IndustryList limit={limit} />
      </Suspense>
    </section>
  );
}

// TradingView's two news feeds, side by side. Each one scrolls inside its
// own box, so showing more of them means a taller box.
export function CoverageSection({ moreHref, tall = false }: { moreHref?: string; tall?: boolean }) {
  const height = tall ? "h-[48rem]" : "h-[30rem]";
  return (
    <section>
      <SectionHeader title="Media coverage" action={<More href={moreHref}>More coverage</More>} />
      <Intro>
        Media coverage of {stockConfig.shortName} and the wider stock market,
        from TradingView&apos;s news feed.
      </Intro>
      <div className="grid gap-x-14 gap-y-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">
            {stockConfig.shortName} in the news
          </h3>
          <TradingViewWidget
            widget="stock-news"
            className={height}
            loadingText="Loading news from TradingView."
          />
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-ink">Market news</h3>
          <TradingViewWidget
            widget="market-news"
            className={height}
            loadingText="Loading news from TradingView."
          />
        </div>
      </div>
    </section>
  );
}
