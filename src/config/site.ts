// Site-wide settings live here, in one place.
// Pages import from this file instead of typing the name out themselves,
// so renaming the project later is a one-line change.
//
// The tracked stock (ticker, company name, keywords) will get its own
// config file in Phase 1. Nothing about a specific stock belongs in the pages.

export const siteConfig = {
  name: "AI Stock Researcher",
  description:
    "Charts, fundamentals, filings, news and AI research for a stock, all in one place.",
  status: "Under construction. The first version is on its way.",
} as const;
