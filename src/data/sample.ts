// SAMPLE DATA for Phase 1. None of this is real.
//
// It exists so the design can be built and judged before any data source is
// connected. In Phase 2 this file is replaced by real data, and the pages
// keep working because they only care about the shapes defined below.
//
// The numbers are made up on purpose, and the news items are obvious
// placeholders, so nothing here can be mistaken for real information.

import { stockConfig } from "@/config/stock";

// ---------- Shapes (what each piece of data looks like) ----------

export type PricePoint = {
  time: string; // a day, written as YYYY-MM-DD
  value: number; // closing price that day
};

export type Stat = {
  label: string;
  value: string;
  hint?: string;
};

export type StatGroup = {
  title: string;
  stats: Stat[];
};

export type NewsCategory = "Company" | "Industry" | "Market";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  source: string;
  age: string;
};

// ---------- Price history ----------

// A tiny random number generator that always produces the same sequence.
// Math.random() would give different prices on every page load.
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// The last day of the sample history. A fixed date, not "today", because
// sample data should not pretend to be current.
const LAST_DAY = Date.UTC(2026, 10, 13); // 13 November 2026
const ONE_DAY = 24 * 60 * 60 * 1000;

function buildPriceHistory(tradingDays: number): PricePoint[] {
  // Collect weekdays, walking backwards from the last day.
  const days: string[] = [];
  for (let t = LAST_DAY; days.length < tradingDays; t -= ONE_DAY) {
    const weekday = new Date(t).getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      days.unshift(new Date(t).toISOString().slice(0, 10));
    }
  }

  // A "random walk": each day moves a little from the day before.
  const random = createRandom(42);
  let price = 100;
  return days.map((time) => {
    const dailyMove = (random() - 0.47) * 0.045;
    price = Math.max(20, price * (1 + dailyMove));
    return { time, value: Math.round(price * 100) / 100 };
  });
}

// About one year of trading days.
export const samplePrices: PricePoint[] = buildPriceHistory(252);

// ---------- Quote (the headline price), worked out from the history ----------

const lastPoint = samplePrices[samplePrices.length - 1];
const previousPoint = samplePrices[samplePrices.length - 2];
const allValues = samplePrices.map((point) => point.value);

export const sampleQuote = {
  price: lastPoint.value,
  previousClose: previousPoint.value,
  change: lastPoint.value - previousPoint.value,
  changePercent:
    ((lastPoint.value - previousPoint.value) / previousPoint.value) * 100,
  asOf: lastPoint.time,
  yearHigh: Math.max(...allValues),
  yearLow: Math.min(...allValues),
};

// ---------- Metrics ----------

export const sampleKeyStats: Stat[] = [
  { label: "Market cap", value: "$1.20T" },
  { label: "P/E ratio", value: "32.4" },
  { label: "EPS (12 months)", value: "$4.15" },
  { label: "Volume", value: "48.2M" },
  { label: "Dividend yield", value: "0.03%" },
];

export const sampleStatGroups: StatGroup[] = [
  {
    title: "Valuation",
    stats: [
      { label: "Market cap", value: "$1.20T", hint: "Total value of all shares" },
      { label: "P/E ratio", value: "32.4", hint: "Price divided by yearly earnings per share" },
      { label: "Forward P/E", value: "26.8", hint: "Same, using next year's expected earnings" },
      { label: "Price to sales", value: "18.1", hint: "Market cap divided by yearly revenue" },
    ],
  },
  {
    title: "Profitability",
    stats: [
      { label: "Revenue (12 months)", value: "$66.3B", hint: "Total sales over the last year" },
      { label: "Net income (12 months)", value: "$31.0B", hint: "Profit left after all costs and taxes" },
      { label: "Gross margin", value: "72.5%", hint: "Share of revenue left after the cost of making the product" },
      { label: "EPS (12 months)", value: "$4.15", hint: "Earnings per share" },
    ],
  },
  {
    title: "Trading",
    stats: [
      { label: "Volume", value: "48.2M", hint: "Shares traded today" },
      { label: "Average volume", value: "52.7M", hint: "Typical daily volume over 3 months" },
      { label: "Beta", value: "1.68", hint: "How much it swings compared with the market. 1 is the same as the market" },
      { label: "Dividend yield", value: "0.03%", hint: "Yearly dividend as a share of the price" },
    ],
  },
];

// ---------- News ----------

export const sampleNews: NewsItem[] = [
  {
    id: "company-1",
    category: "Company",
    title: `Placeholder headline about ${stockConfig.shortName}'s latest quarterly results`,
    summary:
      "A short summary of the story will sit here: what happened, and why it matters for the stock.",
    source: "Sample source",
    age: "2h ago",
  },
  {
    id: "industry-1",
    category: "Industry",
    title: `Placeholder headline about the ${stockConfig.industry} industry`,
    summary:
      "Industry stories give context: competitors, supply, demand and regulation in the stock's field.",
    source: "Sample source",
    age: "4h ago",
  },
  {
    id: "market-1",
    category: "Market",
    title: "Placeholder headline about today's top market story",
    summary:
      "The biggest market news of the day, even when it is not about this company.",
    source: "Sample source",
    age: "5h ago",
  },
  {
    id: "company-2",
    category: "Company",
    title: `Placeholder headline about a new ${stockConfig.shortName} product`,
    summary:
      "Product launches, partnerships and leadership changes will show up as company news.",
    source: "Sample source",
    age: "Yesterday",
  },
  {
    id: "industry-2",
    category: "Industry",
    title: "Placeholder headline about a competitor's announcement",
    summary:
      "What rivals do often moves the stock too, so those stories belong here.",
    source: "Sample source",
    age: "Yesterday",
  },
  {
    id: "market-2",
    category: "Market",
    title: "Placeholder headline about interest rates and the wider economy",
    summary:
      "Economy-wide news that tends to move every large stock at once.",
    source: "Sample source",
    age: "2 days ago",
  },
];
