// Fetches data from the SEC, the US regulator that every listed company
// must file its accounts and announcements with.
//
// This code only ever runs on the server, never in the visitor's browser.
// Four rules are applied here:
// 1. Secrets stay on the server. The contact details the SEC asks for are
//    read from a private setting (an "environment variable"), not written
//    in the code.
// 2. Every outside source is cached, so the SEC is not asked again on every
//    page view.
// 3. Every outside source has a fallback. If the SEC is slow or down, these
//    functions return null and the page shows a friendly message.
// 4. The SEC's limit of 10 requests a second is respected (see waitTurn).

import { cacheLife } from "next/cache";
import { stockConfig } from "@/config/stock";
import {
  buildFundamentals,
  type CompanyFacts,
  type Fundamentals,
} from "@/lib/financials";
import {
  buildFilings,
  filingFolder,
  type Filing,
  type SecSubmissions,
} from "@/lib/filings";
import {
  parseAttachmentTable,
  subjectFromForeignReport,
  titleFromAttachment,
  UNTITLED_ATTACHMENT,
  type FilingDetails,
} from "@/lib/documents";
import { loadFilingDetails, saveFilingDetails } from "@/db/store";

export type { FilingDetails };

// ---------- Talking to the SEC ----------

// The SEC asks automated tools to stay under 10 requests a second. Requests
// here wait in a queue: each one leaves 125 milliseconds after the one
// before it, so at most 8 go out in any second, however many are waiting.
// (An earlier version gave each request a time slot in advance. When the
// program was busy, a late request and the next one could leave almost
// together.)
//
// The queue lives inside one running program. Next.js builds a site of
// fewer than 25 pages in a single worker, so builds share one queue. With
// more stocks (Phase 9) that needs another look.
const GAP_MS = 125;
let queue: Promise<void> = Promise.resolve();

// Set SEC_LOG_REQUESTS=1 to print every request the site makes to the SEC,
// with the time it was sent. Useful for checking how many requests a page
// costs, and that they stay under the limit.
function logRequest(url: string): void {
  if (process.env.SEC_LOG_REQUESTS) {
    console.info(`SEC request: ${new Date().toISOString()} ${url}`);
  }
}

function waitTurn(): Promise<void> {
  const turn = queue.then(() => new Promise<void>((resolve) => setTimeout(resolve, GAP_MS)));
  queue = turn;
  return turn;
}

// The SEC requires automated tools to say who they are. See README.md for
// how to set this.
function secHeaders(): Record<string, string> {
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent) {
    throw new Error("The SEC_USER_AGENT setting is missing");
  }
  return { "User-Agent": userAgent };
}

// Ask the SEC for a web address that answers with data (JSON).
async function secFetch<T>(url: string): Promise<T> {
  const headers = { ...secHeaders(), Accept: "application/json" };
  await waitTurn();
  logRequest(url);
  const response = await fetch(url, {
    headers,
    // Give up after 15 seconds so a slow answer cannot hang the page.
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`The SEC answered with status ${response.status}`);
  }
  return (await response.json()) as T;
}

// Ask the SEC for a web page or document, and read only its first maxBytes.
// Titles sit at the top of a document, and some attachments are several
// megabytes long, so there is no point downloading the rest.
async function secFetchText(url: string, maxBytes: number): Promise<string> {
  const headers = {
    ...secHeaders(),
    // Ask for the plain file, not a compressed one, so it can be cut short.
    "Accept-Encoding": "identity",
    Range: `bytes=0-${maxBytes - 1}`,
  };
  await waitTurn();
  logRequest(url);
  const response = await fetch(url, {
    headers,
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok || !response.body) {
    throw new Error(`The SEC answered with status ${response.status}`);
  }

  // Read piece by piece and stop once there is enough, even if the server
  // ignored the request for only part of the file.
  const reader = response.body.getReader();
  const pieces: Uint8Array[] = [];
  let total = 0;
  while (total < maxBytes) {
    const { done, value } = await reader.read();
    if (done) break;
    pieces.push(value);
    total += value.length;
  }
  await reader.cancel();
  return new TextDecoder().decode(Buffer.concat(pieces).subarray(0, maxBytes));
}

// ---------- The tracked company ----------

// The most filings the site shows for the tracked company, on the Filings
// page. Other pages show the newest few of the same list, so one request to
// the SEC covers every page.
const FILINGS_LIMIT = 40;

// The reported financials for the tracked stock, already worked out into the
// figures the site shows. Returns null if they could not be loaded.
export async function getFundamentals(): Promise<Fundamentals | null> {
  // "use cache" tells Next.js to remember the result and reuse it, so this
  // function does not call the SEC again on every page view.
  "use cache";

  try {
    const facts = await secFetch<CompanyFacts>(
      `https://data.sec.gov/api/xbrl/companyfacts/CIK${stockConfig.cik}.json`,
    );
    const fundamentals = buildFundamentals(facts);
    // Companies file new numbers a few times a year. Checking hourly is plenty.
    cacheLife("hours");
    return fundamentals;
  } catch (error) {
    console.error("Could not load financials from the SEC:", error);
    // Remember a failure only briefly, so the site recovers within minutes.
    cacheLife("minutes");
    return null;
  }
}

// The tracked company's most recent filings, newest first. Returns null if
// they could not be loaded.
export async function getFilings(): Promise<Filing[] | null> {
  "use cache";

  try {
    const submissions = await secFetch<SecSubmissions>(
      `https://data.sec.gov/submissions/CIK${stockConfig.cik}.json`,
    );
    const filings = buildFilings(submissions, stockConfig.cik, FILINGS_LIMIT);
    // A new filing can appear at any time, so check every 15 minutes.
    // stale, revalidate and expire are in seconds.
    cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
    return filings;
  } catch (error) {
    console.error("Could not load filings from the SEC:", error);
    cacheLife("minutes");
    return null;
  }
}

// The web page on sec.gov that lists every filing by the tracked company.
export function secCompanyUrl(): string {
  return `https://www.sec.gov/edgar/browse/?CIK=${Number(stockConfig.cik)}`;
}

// ---------- Other companies in the industry ----------

export type Peer = (typeof stockConfig.peers)[number];

export type IndustryFiling = Filing & {
  company: string;
  relationship: string;
};

// The most filings the site shows from other companies, on the Industry
// page. Other pages show the newest few of the same list.
const INDUSTRY_LIMIT = 30;

// Recent newsworthy filings from the peer companies listed in the stock
// config, newest first. Companies that could not be loaded are skipped.
// Returns null only if none could be loaded.
export async function getIndustryFilings(): Promise<IndustryFiling[] | null> {
  "use cache";

  const perCompany = await Promise.all(
    stockConfig.peers.map(async (peer) => {
      try {
        const submissions = await secFetch<SecSubmissions>(
          `https://data.sec.gov/submissions/CIK${peer.cik}.json`,
        );
        return buildFilings(submissions, peer.cik, INDUSTRY_LIMIT, { newsOnly: true }).map(
          (filing) => ({ ...filing, company: peer.name, relationship: peer.relationship }),
        );
      } catch (error) {
        console.error(`Could not load filings for ${peer.name}:`, error);
        return null;
      }
    }),
  );

  const loaded = perCompany.filter((list) => list !== null);
  if (loaded.length === 0) {
    cacheLife("minutes");
    return null;
  }
  cacheLife({ stale: 300, revalidate: 900, expire: 86_400 });
  return loaded
    .flat()
    // Newest first. Filings from the same day keep their order.
    .sort((a, b) => b.filedOn.localeCompare(a.filedOn))
    .slice(0, INDUSTRY_LIMIT);
}

// ---------- What is inside a filing ----------

// Look inside one filing for its attachments and, for foreign company
// reports, its subject. A filing never changes once published, so the
// answer is read from the SEC once, then kept in the database.
export async function getFilingDetails(filing: {
  cik: string;
  id: string;
  primaryDocument: string;
  titleFromDocument: boolean;
}): Promise<FilingDetails> {
  "use cache";

  const stored = await loadFilingDetails(filing.id);
  if (stored) {
    cacheLife("max");
    return stored;
  }

  const folder = filingFolder(filing.cik, filing.id);
  try {
    const index = await secFetchText(`${folder}/${filing.id}-index.htm`, 200_000);
    // At most two attachments per filing keeps the page short.
    const refs = parseAttachmentTable(index).slice(0, 2);
    const attachments = await Promise.all(
      refs.map(async (ref) => {
        const url = `${folder}/${ref.document}`;
        const head = await secFetchText(url, 32_000);
        return { title: titleFromAttachment(head) ?? UNTITLED_ATTACHMENT, url };
      }),
    );

    let subject: string | null = null;
    if (filing.titleFromDocument) {
      const head = await secFetchText(`${folder}/${filing.primaryDocument}`, 48_000);
      const firstTitle = attachments[0]?.title;
      subject =
        subjectFromForeignReport(head) ??
        (firstTitle && firstTitle !== UNTITLED_ATTACHMENT ? firstTitle : null);
    }

    const details = { subject, attachments };
    await saveFilingDetails(filing.id, filing.cik, details);
    cacheLife("max");
    return details;
  } catch (error) {
    console.error(`Could not read filing ${filing.id}:`, error);
    // The filing still shows, just without its attachments. Try again soon.
    cacheLife("minutes");
    return { subject: null, attachments: [] };
  }
}
