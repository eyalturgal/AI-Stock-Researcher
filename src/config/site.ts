// Site-wide settings live here, in one place.
// Pages import from this file instead of typing the name out themselves,
// so renaming the project later is a one-line change.
//
// Anything about the tracked stock lives in stock.ts, not here.

export const siteConfig = {
  name: "AI Stock Researcher",
  // The two letters in the small square next to the site name.
  mark: "AI",
  description:
    "Charts, fundamentals, filings, news and AI research for a stock, all in one place.",
  // The tabs under the stock header. Each one is a page in src/app.
  tabs: [
    { label: "Overview", href: "/" },
    { label: "Chart", href: "/chart" },
    { label: "Metrics", href: "/metrics" },
    { label: "News", href: "/news" },
  ],
  // The sub-tabs under News. Each one is a page in src/app/news. The first
  // is the News tab's own page, with a short version of every section.
  newsTabs: [
    { label: "All news", href: "/news" },
    { label: "Filings", href: "/news/filings" },
    { label: "Announcements", href: "/news/announcements" },
    { label: "Industry", href: "/news/industry" },
    { label: "Coverage", href: "/news/coverage" },
  ],
} as const;
