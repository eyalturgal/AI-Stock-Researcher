// Small helpers that turn raw numbers and dates into text for the screen.
// They use Intl, the formatting tools built into JavaScript, so there is
// nothing to install.

export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

// 1.234 becomes "+1.23%", -0.5 becomes "-0.50%".
export function formatPercent(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value / 100);
}

// 2.5 becomes "+2.50", -1 becomes "-1.00".
export function formatSigned(value: number): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "exceptZero",
  }).format(value);
}

// "2026-11-13" becomes "Nov 13, 2026". The time zone is fixed so the server
// and the browser always print the same thing.
export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${isoDate}T00:00:00Z`));
}
