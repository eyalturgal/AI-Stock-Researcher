// Turns the fundamentals into labeled, formatted figures ready to show.
// Pages pick the list they need: a short one for the top of the page,
// a medium one for the Overview, and the full set for the Metrics tab.

import type { Fundamentals } from "@/lib/financials";
import {
  formatCompactMoney,
  formatCompactNumber,
  formatPercent,
  formatPrice,
  formatShare,
} from "@/lib/format";

export type Stat = {
  label: string;
  value: string;
  hint?: string;
};

export type StatGroup = {
  title: string;
  stats: Stat[];
};

// What to print when the company has not reported a figure.
const MISSING = "n/a";

function money(value: number | null, currency: string): string {
  return value === null ? MISSING : formatCompactMoney(value, currency);
}

function share(value: number | null): string {
  return value === null ? MISSING : formatShare(value);
}

// The four figures next to the price at the top of every page.
export function headlineStats(f: Fundamentals, currency: string): Stat[] {
  return [
    { label: "Revenue (12 months)", value: money(f.revenueTTM, currency) },
    { label: "Net income (12 months)", value: money(f.netIncomeTTM, currency) },
    {
      label: "EPS (12 months)",
      value: f.epsDilutedTTM === null ? MISSING : formatPrice(f.epsDilutedTTM, currency),
    },
    { label: "Gross margin", value: share(f.grossMarginTTM) },
  ];
}

// The short list on the Overview tab.
export function keyStats(f: Fundamentals, currency: string): Stat[] {
  return [
    { label: "Revenue, latest quarter", value: money(f.revenueLatestQuarter, currency) },
    {
      label: "Revenue growth, year on year",
      value: f.revenueGrowthYoY === null ? MISSING : formatPercent(f.revenueGrowthYoY),
    },
    { label: "Operating margin", value: share(f.operatingMarginTTM) },
    { label: "Net margin", value: share(f.netMarginTTM) },
    { label: "Cash", value: money(f.cash, currency) },
    {
      label: "Shares outstanding",
      value: f.sharesOutstanding === null ? MISSING : formatCompactNumber(f.sharesOutstanding),
    },
  ];
}

// Everything, grouped, for the Metrics tab.
export function statGroups(f: Fundamentals, currency: string): StatGroup[] {
  return [
    {
      title: "Last 12 months",
      stats: [
        {
          label: "Revenue",
          value: money(f.revenueTTM, currency),
          hint: "Total sales over the last four quarters",
        },
        {
          label: "Net income",
          value: money(f.netIncomeTTM, currency),
          hint: "Profit left after all costs and taxes",
        },
        {
          label: "EPS (diluted)",
          value: f.epsDilutedTTM === null ? MISSING : formatPrice(f.epsDilutedTTM, currency),
          hint: "Earnings per share: profit divided by the number of shares",
        },
      ],
    },
    {
      title: "Margins, last 12 months",
      stats: [
        {
          label: "Gross margin",
          value: share(f.grossMarginTTM),
          hint: "Share of revenue left after the cost of making the product",
        },
        {
          label: "Operating margin",
          value: share(f.operatingMarginTTM),
          hint: "Share of revenue left after running costs like research and staff",
        },
        {
          label: "Net margin",
          value: share(f.netMarginTTM),
          hint: "Share of revenue that ends up as profit",
        },
      ],
    },
    {
      title: "Latest quarter",
      stats: [
        { label: "Revenue", value: money(f.revenueLatestQuarter, currency) },
        {
          label: "Revenue growth",
          value: f.revenueGrowthYoY === null ? MISSING : formatPercent(f.revenueGrowthYoY),
          hint: "Compared with the same quarter a year earlier",
        },
        { label: "Net income", value: money(f.netIncomeLatestQuarter, currency) },
      ],
    },
    {
      title: "Balance sheet",
      stats: [
        { label: "Cash", value: money(f.cash, currency), hint: "Cash and close equivalents" },
        {
          label: "Total assets",
          value: money(f.totalAssets, currency),
          hint: "Everything the company owns",
        },
        {
          label: "Total liabilities",
          value: money(f.totalLiabilities, currency),
          hint: "Everything the company owes",
        },
        {
          label: "Shareholders' equity",
          value: money(f.equity, currency),
          hint: "Assets minus liabilities",
        },
        {
          label: "Shares outstanding",
          value: f.sharesOutstanding === null ? MISSING : formatCompactNumber(f.sharesOutstanding),
          hint: "How many shares exist",
        },
      ],
    },
  ];
}
