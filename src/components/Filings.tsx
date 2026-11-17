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
import { friendlyTitle, UNTITLED_ATTACHMENT } from "@/lib/documents";

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

// Company names and tickers written in capitals, like AMD or TSMC, taken
// from the stock config. They stay in capitals when a title written all in
// capitals is made easier to read.
const COMPANY_CAPITALS = [stockConfig, ...stockConfig.peers]
  .flatMap((company) => [company.ticker, company.name])
  .filter((word) => word === word.toUpperCase());

const tidy = (text: string) => friendlyTitle(text, COMPANY_CAPITALS);

// What visitors see when the SEC could not be reached.
function Unavailable({ what }: { what: string }) {
  return (
    <p className="border-t border-line pt-3 text-sm leading-6 text-ink-soft">
      {what} could not be loaded right now. This usually fixes itself within a
      few minutes.
    </p>
  );
}

// One filing: a line of labels, the headline, then any other attachments.
//
// The headline is the company's own title when there is one: the first
// attached document (usually the press release), or for foreign company
// reports the subject read from the report. Our plain-language label then
// moves to a small line under it, still linking to the official filing.
function FilingItem({
  filing,
  details,
  labels,
}: {
  filing: Filing;
  details: FilingDetails | null;
  labels: string[];
}) {
  const all = details?.attachments ?? [];
  // The first attachment can only be the headline if its title could be read.
  const lead = all.length > 0 && all[0].title !== UNTITLED_ATTACHMENT ? all[0] : null;
  let headline = filing.title;
  let headlineUrl = filing.url;
  let showFilingLabel = false;

  if (filing.titleFromDocument && details?.subject) {
    headline = details.subject;
    if (lead && lead.title === details.subject) headlineUrl = lead.url;
  } else if (lead) {
    headline = lead.title;
    headlineUrl = lead.url;
    showFilingLabel = true;
  }

  const title = tidy(headline);
  // Do not list the headline's own document again.
  const attachments = all
    .map((item) => ({ ...item, title: tidy(item.title) }))
    .filter((item) => item.url !== headlineUrl && item.title !== title);

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
          href={headlineUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline-offset-4 hover:underline"
        >
          {title}
        </a>
      </h3>
      {showFilingLabel ? (
        <p className="mt-1 text-sm leading-6">
          <span className="text-ink-faint">SEC filing: </span>
          <a href={filing.url} target="_blank" rel="noopener noreferrer" className={linkStyle}>
            {filing.title}
          </a>
        </p>
      ) : null}
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
        are the company&apos;s own titles when a filing has one, otherwise our
        plain-language label. Each link opens the original document.{" "}
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
