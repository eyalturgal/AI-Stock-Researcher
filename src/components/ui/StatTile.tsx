import type { Stat } from "@/data/sample";

// One number with its label and a short explanation. No box around it:
// a thin line on top is enough to set it apart. Used on the Metrics tab
// and next to the price at the top of the page.
export function StatTile({
  stat,
  size = "large",
}: {
  stat: Stat;
  size?: "large" | "small";
}) {
  return (
    <div className="border-t border-line pt-3">
      <dt className="text-sm text-ink-faint">{stat.label}</dt>
      <dd
        className={`mt-1 font-semibold tracking-tight text-ink ${
          size === "large" ? "text-3xl" : "text-xl"
        }`}
      >
        {stat.value}
      </dd>
      {stat.hint ? (
        <p className="mt-2 max-w-xs text-sm leading-6 text-ink-faint">
          {stat.hint}
        </p>
      ) : null}
    </div>
  );
}

// A plain label and value on one line. Used for the short stats list on
// the Overview tab.
export function StatRow({ stat }: { stat: Stat }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-3">
      <dt className="text-sm text-ink-soft">{stat.label}</dt>
      <dd className="text-sm font-medium tabular-nums text-ink">{stat.value}</dd>
    </div>
  );
}
