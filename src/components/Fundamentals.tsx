import { stockConfig } from "@/config/stock";
import { getFundamentals, secCompanyUrl } from "@/lib/sec";
import { headlineStats, keyStats, statGroups } from "@/lib/stats";
import { formatDate } from "@/lib/format";
import { SectionHeader } from "@/components/ui/GlassCard";
import { StatRow, StatTile } from "@/components/ui/StatTile";

// The pieces of the site that show the company's reported numbers.
//
// Each one is "async": it waits for the data from the SEC before drawing.
// While it waits, the page shows the matching "...Loading" placeholder
// below (a page wraps the component in <Suspense> to say which one).
// If the data cannot be loaded, it shows a short message instead.

const { currency } = stockConfig;

// ---------- Shared small pieces ----------

// What visitors see when the SEC could not be reached.
function DataUnavailable() {
  return (
    <p className="border-t border-line pt-3 text-sm leading-6 text-ink-soft">
      The company&apos;s reported figures could not be loaded right now. This
      usually fixes itself within a few minutes.
    </p>
  );
}

// Says where the numbers come from, as the project rules require.
function SourceNote({ quarterEnd, filed }: { quarterEnd: string; filed: string }) {
  return (
    <p className="mt-4 text-xs leading-5 text-ink-faint">
      Source: the company&apos;s filings with the SEC. Latest quarter ended{" "}
      {formatDate(quarterEnd)}, filed {formatDate(filed)}.{" "}
      <a
        href={secCompanyUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink-soft underline underline-offset-2 hover:text-ink"
      >
        View filings
      </a>
    </p>
  );
}

// A gray bar that stands in for text while data loads.
function Bar({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-ink/10 ${className}`} />;
}

// ---------- Top of the page: four headline figures ----------

export async function HeadlineStats() {
  const fundamentals = await getFundamentals();
  if (!fundamentals) return <DataUnavailable />;

  return (
    <div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
        {headlineStats(fundamentals, currency).map((stat) => (
          <StatTile key={stat.label} stat={stat} size="small" />
        ))}
      </dl>
      <SourceNote
        quarterEnd={fundamentals.latestQuarterEnd}
        filed={fundamentals.latestFiled}
      />
    </div>
  );
}

export function HeadlineStatsLoading() {
  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6" aria-hidden="true">
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="border-t border-line pt-3">
          <Bar className="h-4 w-28" />
          <Bar className="mt-2 h-6 w-20" />
        </div>
      ))}
    </div>
  );
}

// ---------- Overview tab: the short list ----------

export async function KeyStats() {
  const fundamentals = await getFundamentals();
  if (!fundamentals) return <DataUnavailable />;

  return (
    <dl className="border-b border-line">
      {keyStats(fundamentals, currency).map((stat) => (
        <StatRow key={stat.label} stat={stat} />
      ))}
    </dl>
  );
}

export function KeyStatsLoading() {
  return (
    <div className="border-b border-line" aria-hidden="true">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex justify-between border-t border-line py-3">
          <Bar className="h-4 w-36" />
          <Bar className="h-4 w-14" />
        </div>
      ))}
    </div>
  );
}

// ---------- Metrics tab: everything, in groups ----------

export async function MetricGroups() {
  const fundamentals = await getFundamentals();
  if (!fundamentals) return <DataUnavailable />;

  return (
    <div className="flex flex-col gap-16">
      {statGroups(fundamentals, currency).map((group) => (
        <section key={group.title}>
          <SectionHeader title={group.title} />
          <dl className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {group.stats.map((stat) => (
              <StatTile key={stat.label} stat={stat} />
            ))}
          </dl>
        </section>
      ))}
      <SourceNote
        quarterEnd={fundamentals.latestQuarterEnd}
        filed={fundamentals.latestFiled}
      />
    </div>
  );
}

export function MetricGroupsLoading() {
  return (
    <div className="flex flex-col gap-16" aria-hidden="true">
      {[0, 1].map((group) => (
        <div key={group}>
          <Bar className="mb-5 h-6 w-40" />
          <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="border-t border-line pt-3">
                <Bar className="h-4 w-28" />
                <Bar className="mt-2 h-8 w-24" />
                <Bar className="mt-3 h-4 w-40" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
