import { stockConfig } from "@/config/stock";
import {
  getFilingDetails,
  getFilings,
  getIndustryFilings,
  secCompanyUrl,
  type FilingDetails,
} from "@/lib/sec";
import type { Filing } from "@/lib/filings";
import { formatDate } from "@/lib/format";

// Filings with the SEC, newest first.
//
// FilingList shows the tracked company's own filings: "category A" news,
// the official record. IndustryList shows filings from the peer companies
// listed in the stock config: "category D", industry news.
//
// Under each filing, its attachments are listed with their own titles,
// for example the press release a company filed along with its earnings.

type Layout = "grid" | "columns" | "single";

const LAYOUTS: Record<Layout, string> = {
  grid: "grid gap-x-14 gap-y-8 lg:grid-cols-2",
  columns: "grid gap-x-12 gap-y-8 md:grid-cols-3",
  single: "flex flex-col gap-8",
};

const linkStyle = "text-ink-soft underline underline-offset-2 hover:text-ink";

// What visitors see when the SEC could not be reached.
function Unavailable({ what }: { what: string }) {
  return (
    <p className="border-t border-line pt-3 text-sm leading-6 text-ink-soft">
      {what} could not be loaded right now. This usually fixes itself within a
      few minutes.
    </p>
  );
}

// One filing: a line of labels, the title, then any attachments.
function FilingItem({
  filing,
  details,
  labels,
}: {
  filing: Filing;
  details: FilingDetails | null;
  labels: string[];
}) {
  // Foreign company reports get their title from the document itself.
  const title = (filing.titleFromDocument && details?.subject) || filing.title;
  // When that title came from the only attachment, listing it again would
  // just repeat it.
  const attachments = (details?.attachments ?? []).filter((item) => item.title !== title);

  return (
    <li className="border-t border-line pt-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint">
        {labels.map((label, index) => (
          <span key={label} className="flex items-center gap-x-2">
            {index > 0 ? <span aria-hidden="true">·</span> : null}
            <span className={index === 0 ? "font-semibold text-ink-soft" : undefined}>
              {label}
            </span>
          </span>
        ))}
      </div>
      <h3 className="mt-2 text-lg font-medium leading-7 text-ink">
        <a
          href={filing.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          {title}
        </a>
      </h3>
      {attachments.length > 0 ? (
        <ul className="mt-2 flex flex-col gap-1 text-sm leading-6">
          {attachments.map((attachment) => (
            <li key={attachment.url}>
              <span className="text-ink-faint">Attached: </span>
              <a href={attachment.url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
                {attachment.title}
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

// Look inside each filing that can carry attachments. The SEC pacing in
// sec.ts spaces these requests out.
async function detailsFor(filings: Filing[]): Promise<(FilingDetails | null)[]> {
  return Promise.all(
    filings.map((filing) => (filing.hasAttachments ? getFilingDetails(filing) : null)),
  );
}

// ---------- The tracked company ----------

export async function FilingList({
  limit,
  layout = "grid",
}: {
  limit: number;
  layout?: Layout;
}) {
  const all = await getFilings();
  if (!all) return <Unavailable what="The company's filings" />;

  const filings = all.slice(0, limit);
  const details = await detailsFor(filings);

  return (
    <div>
      <ul className={LAYOUTS[layout]}>
        {filings.map((filing, index) => (
          <FilingItem
            key={filing.id}
            filing={filing}
            details={details[index]}
            labels={[filing.topic, `${filing.kind} (${filing.form})`, formatDate(filing.filedOn)]}
          />
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-ink-faint">
        Source: the SEC, the US regulator companies must report to. Headlines
        are our plain-language labels, and attachment titles are the
        company&apos;s own. Each one opens the original document.{" "}
        <a href={secCompanyUrl()} target="_blank" rel="noopener noreferrer" className={linkStyle}>
          All filings
        </a>
      </p>
    </div>
  );
}

// ---------- Other companies in the industry ----------

export async function IndustryList({ limit }: { limit: number }) {
  const filings = await getIndustryFilings(limit);
  if (!filings) return <Unavailable what="Filings from other companies" />;

  const details = await detailsFor(filings);

  return (
    <div>
      <ul className={LAYOUTS.grid}>
        {filings.map((filing, index) => (
          <FilingItem
            key={filing.id}
            filing={filing}
            details={details[index]}
            labels={[
              filing.company,
              filing.relationship,
              filing.topic,
              formatDate(filing.filedOn),
            ]}
          />
        ))}
      </ul>
      <p className="mt-6 text-xs leading-5 text-ink-faint">
        Source: the SEC. Companies followed:{" "}
        {stockConfig.peers.map((peer) => `${peer.name} (${peer.relationship.toLowerCase()})`).join(", ")}.
        Only filings that count as news are shown, such as earnings, deals and
        leadership changes.
      </p>
    </div>
  );
}

// ---------- While loading ----------

// Gray bars shown while filings load.
export function FilingListLoading({
  count,
  layout = "grid",
}: {
  count: number;
  layout?: Layout;
}) {
  return (
    <div className={LAYOUTS[layout]} aria-hidden="true">
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
