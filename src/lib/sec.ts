// Fetches a company's reported numbers from the SEC, the US regulator that
// every listed company must file its accounts with.
//
// This code only ever runs on the server, never in the visitor's browser.
// Three project rules are applied here:
// 1. Secrets stay on the server. The contact details the SEC asks for are
//    read from a private setting (an "environment variable"), not written
//    in the code.
// 2. Every outside source is cached. The SEC is asked at most about once an
//    hour, however many people visit.
// 3. Every outside source has a fallback. If the SEC is slow or down, this
//    returns null and the page shows a friendly message, not a crash.

import { cacheLife } from "next/cache";
import { stockConfig } from "@/config/stock";
import {
  buildFundamentals,
  type CompanyFacts,
  type Fundamentals,
} from "@/lib/financials";

// Ask the SEC for a web address and return the data it sends back.
async function secFetch<T>(url: string): Promise<T> {
  // The SEC requires automated tools to say who they are. See README.md
  // for how to set this.
  const userAgent = process.env.SEC_USER_AGENT;
  if (!userAgent) {
    throw new Error("The SEC_USER_AGENT setting is missing");
  }

  const response = await fetch(url, {
    headers: { "User-Agent": userAgent, Accept: "application/json" },
    // Give up after 15 seconds so a slow answer cannot hang the page.
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) {
    throw new Error(`The SEC answered with status ${response.status}`);
  }
  return (await response.json()) as T;
}

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

// The web page on sec.gov that lists every filing by the tracked company.
export function secCompanyUrl(): string {
  return `https://www.sec.gov/edgar/browse/?CIK=${Number(stockConfig.cik)}`;
}
