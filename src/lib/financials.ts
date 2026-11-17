// Turns the raw numbers a company reports to the SEC into the figures the
// site shows: last-12-month totals, margins, growth, and balance sheet items.
//
// This file is pure math. It never talks to the internet, so it can be
// tested with a saved copy of the data. Fetching lives in sec.ts.
//
// Nothing here is specific to one company. The names below ("Revenues",
// "NetIncomeLoss" ...) are the standard labels every US company uses when it
// files its accounts.

// ---------- The shape of the SEC's "company facts" data ----------

// One reported number: a value for a period, and the filing it came from.
type FactRow = {
  start?: string; // first day of the period. Missing for point-in-time values
  end: string; // last day of the period
  val: number;
  filed: string; // the day the filing was published
};

type Concept = { units: Record<string, FactRow[]> };

export type CompanyFacts = {
  entityName?: string;
  facts: Record<string, Record<string, Concept>>;
};

// ---------- What this file produces ----------

export type QuarterValue = { end: string; value: number };

export type Fundamentals = {
  // The last day of the most recent quarter the company has reported.
  latestQuarterEnd: string;
  // The day that quarter's numbers were filed.
  latestFiled: string;

  // Totals over the last four quarters ("trailing twelve months").
  revenueTTM: number | null;
  netIncomeTTM: number | null;
  epsDilutedTTM: number | null;
  grossMarginTTM: number | null; // percent
  operatingMarginTTM: number | null; // percent
  netMarginTTM: number | null; // percent

  // The most recent quarter on its own.
  revenueLatestQuarter: number | null;
  revenueGrowthYoY: number | null; // percent, against the same quarter a year before
  netIncomeLatestQuarter: number | null;

  // Balance sheet: what the company had on the last day of the quarter.
  cash: number | null;
  totalAssets: number | null;
  totalLiabilities: number | null;
  equity: number | null;

  sharesOutstanding: number | null;
  sharesAsOf: string | null;

  // Revenue for each of the last 12 quarters, oldest first. For charts later.
  revenueByQuarter: QuarterValue[];
};

// ---------- Helpers ----------

const ONE_DAY = 24 * 60 * 60 * 1000;

function daysBetween(start: string, end: string): number {
  return Math.round((Date.parse(end) - Date.parse(start)) / ONE_DAY) + 1;
}

// Companies sometimes report the same thing under different labels over the
// years. Given a list of possible labels, use whichever has the newest data.
function pickRows(
  facts: CompanyFacts,
  taxonomy: string,
  names: string[],
  unit: string,
): FactRow[] {
  let best: FactRow[] = [];
  let bestEnd = "";
  for (const name of names) {
    const rows = facts.facts[taxonomy]?.[name]?.units?.[unit] ?? [];
    const newest = rows.reduce((max, row) => (row.end > max ? row.end : max), "");
    if (newest > bestEnd) {
      best = rows;
      bestEnd = newest;
    }
  }
  return best;
}

type Period = { start: string; end: string; value: number };

// The same period often appears in several filings (a quarter is repeated a
// year later for comparison). Keep one value per period: the newest filing's.
function uniquePeriods(rows: FactRow[]): Period[] {
  const latest = new Map<string, FactRow>();
  for (const row of rows) {
    if (!row.start) continue;
    const key = `${row.start}|${row.end}`;
    const seen = latest.get(key);
    if (!seen || row.filed > seen.filed) latest.set(key, row);
  }
  return [...latest.values()].map((row) => ({
    start: row.start as string,
    end: row.end,
    value: row.val,
  }));
}

// Build a clean list of single quarters, oldest first.
//
// Companies report quarters 1 to 3 on their own, but the fourth quarter only
// as part of the full year. So quarter 4 is worked out here:
// full year minus the three quarters inside it.
export function toQuarters(rows: FactRow[]): QuarterValue[] {
  const periods = uniquePeriods(rows);
  const quarters = periods.filter((p) => {
    const days = daysBetween(p.start, p.end);
    return days >= 80 && days <= 100;
  });
  const years = periods.filter((p) => {
    const days = daysBetween(p.start, p.end);
    return days >= 350 && days <= 380;
  });

  const byEnd = new Map<string, number>();
  for (const q of quarters) byEnd.set(q.end, q.value);

  for (const year of years) {
    if (byEnd.has(year.end)) continue; // quarter 4 was reported directly
    const inside = quarters.filter((q) => q.start >= year.start && q.end < year.end);
    if (inside.length === 3) {
      const firstThree = inside.reduce((sum, q) => sum + q.value, 0);
      byEnd.set(year.end, year.value - firstThree);
    }
  }

  return [...byEnd.entries()]
    .map(([end, value]) => ({ end, value }))
    .sort((a, b) => (a.end < b.end ? -1 : 1));
}

// Add up the last four quarters, but only if they really are four quarters in
// a row. If one is missing, return null rather than a wrong total.
function trailingTwelveMonths(quarters: QuarterValue[]): number | null {
  if (quarters.length < 4) return null;
  const lastFour = quarters.slice(-4);
  const span = daysBetween(lastFour[0].end, lastFour[3].end);
  if (span < 260 || span > 290) return null; // about nine months between ends
  return lastFour.reduce((sum, q) => sum + q.value, 0);
}

// The value for the quarter that ended about a year before the given one.
function sameQuarterLastYear(quarters: QuarterValue[], end: string): number | null {
  const match = quarters.find((q) => {
    const gap = daysBetween(q.end, end);
    return gap >= 355 && gap <= 375;
  });
  return match ? match.value : null;
}

// The newest point-in-time value (balance sheet items have no start date).
function latestInstant(rows: FactRow[]): { value: number; end: string } | null {
  let best: FactRow | null = null;
  for (const row of rows) {
    if (!best || row.end > best.end || (row.end === best.end && row.filed > best.filed)) {
      best = row;
    }
  }
  return best ? { value: best.val, end: best.end } : null;
}

function percent(part: number | null, whole: number | null): number | null {
  if (part === null || whole === null || whole === 0) return null;
  return (part / whole) * 100;
}

// ---------- The main function ----------

export function buildFundamentals(facts: CompanyFacts): Fundamentals | null {
  const gaap = (names: string[], unit = "USD") => pickRows(facts, "us-gaap", names, unit);

  const revenueRows = gaap([
    "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "SalesRevenueNet",
  ]);
  const revenue = toQuarters(revenueRows);
  if (revenue.length === 0) return null;

  const netIncome = toQuarters(gaap(["NetIncomeLoss"]));
  const grossProfit = toQuarters(gaap(["GrossProfit"]));
  const operatingIncome = toQuarters(gaap(["OperatingIncomeLoss"]));
  const eps = toQuarters(gaap(["EarningsPerShareDiluted"], "USD/shares"));

  const latest = revenue[revenue.length - 1];
  const latestRow = revenueRows
    .filter((row) => row.end === latest.end)
    .sort((a, b) => (a.filed < b.filed ? -1 : 1))[0];

  const revenueTTM = trailingTwelveMonths(revenue);
  const netIncomeTTM = trailingTwelveMonths(netIncome);
  const grossProfitTTM = trailingTwelveMonths(grossProfit);
  const operatingIncomeTTM = trailingTwelveMonths(operatingIncome);
  const epsTTM = trailingTwelveMonths(eps);

  const yearAgoRevenue = sameQuarterLastYear(revenue, latest.end);
  const latestNetIncome = netIncome.find((q) => q.end === latest.end);

  const shares = latestInstant(
    pickRows(facts, "dei", ["EntityCommonStockSharesOutstanding"], "shares"),
  );

  return {
    latestQuarterEnd: latest.end,
    latestFiled: latestRow?.filed ?? latest.end,

    revenueTTM,
    netIncomeTTM,
    epsDilutedTTM: epsTTM === null ? null : Math.round(epsTTM * 100) / 100,
    grossMarginTTM: percent(grossProfitTTM, revenueTTM),
    operatingMarginTTM: percent(operatingIncomeTTM, revenueTTM),
    netMarginTTM: percent(netIncomeTTM, revenueTTM),

    revenueLatestQuarter: latest.value,
    revenueGrowthYoY:
      yearAgoRevenue === null || yearAgoRevenue === 0
        ? null
        : ((latest.value - yearAgoRevenue) / yearAgoRevenue) * 100,
    netIncomeLatestQuarter: latestNetIncome ? latestNetIncome.value : null,

    cash: latestInstant(gaap(["CashAndCashEquivalentsAtCarryingValue"]))?.value ?? null,
    totalAssets: latestInstant(gaap(["Assets"]))?.value ?? null,
    totalLiabilities: latestInstant(gaap(["Liabilities"]))?.value ?? null,
    equity: latestInstant(gaap(["StockholdersEquity"]))?.value ?? null,

    sharesOutstanding: shares?.value ?? null,
    sharesAsOf: shares?.end ?? null,

    revenueByQuarter: revenue.slice(-12),
  };
}
