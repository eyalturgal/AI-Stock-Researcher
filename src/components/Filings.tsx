import { getFilings, secCompanyUrl } from "@/lib/sec";
import { formatDate } from "@/lib/format";

// The company's official filings with the SEC, newest first.
//
// This is "category A" news: the official record. It comes straight from
// the company and the regulator, so it is the most reliable news there is.
//
// layout "stack" puts the filings under each other.
// layout "columns" puts them side by side on wide screens.

export async function FilingList({
  limit,
  layout = "stack",
}: {
  limit: number;
  layout?: "stack" | "columns";
}) {
  const filings = await getFilings();

  if (!filings) {
    return (
      <p className="border-t border-line pt-3 text-sm leading-6 text-ink-soft">
        The company&apos;s filings could not be loaded right now. This usually
        fixes itself within a few minutes.
      </p>
    );
  }

  return (
    <div>
      <ul
        className={
          layout === "columns"
            ? "grid gap-x-12 gap-y-8 md:grid-cols-3"
            : "grid gap-x-14 gap-y-8 lg:grid-cols-2"
        }
      >
        {filings.slice(0, limit).map((filing) => (
          <li key={filing.id} className="border-t border-line pt-4">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
              <span className="font-semibold text-ink-soft">{filing.topic}</span>
              <span aria-hidden="true">·</span>
              <span>
                {filing.kind} ({filing.form})
              </span>
              <span aria-hidden="true">·</span>
              <span>{formatDate(filing.filedOn)}</span>
            </div>
            <h3 className="mt-2 text-lg font-medium leading-7 text-ink">
              <a
                href={filing.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline-offset-4 hover:underline"
              >
                {filing.title}
              </a>
            </h3>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-ink-faint">
        Source: the SEC, the US regulator companies must report to. Titles are
        our plain-language labels. Each one opens the original document.{" "}
        <a
          href={secCompanyUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          All filings
        </a>
      </p>
    </div>
  );
}

// Gray bars shown while the filings load.
export function FilingListLoading({ count }: { count: number }) {
  return (
    <div className="grid gap-x-12 gap-y-8 md:grid-cols-3" aria-hidden="true">
      {Array.from({ length: count }, (_, item) => (
        <div key={item} className="border-t border-line pt-4">
          <div className="h-3 w-40 animate-pulse rounded-md bg-ink/10" />
          <div className="mt-3 h-5 w-full animate-pulse rounded-md bg-ink/10" />
          <div className="mt-2 h-5 w-2/3 animate-pulse rounded-md bg-ink/10" />
        </div>
      ))}
    </div>
  );
}
