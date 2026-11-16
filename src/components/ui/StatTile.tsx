import type { Stat } from "@/data/sample";

// One number with its label, in its own small glass tile.
// Used on the Metrics tab.
export function StatTile({ stat }: { stat: Stat }) {
  return (
    <div className="glass rounded-2xl p-4">
      <dt className="text-sm text-ink-faint">{stat.label}</dt>
      <dd className="mt-1 text-2xl font-semibold tracking-tight text-ink">
        {stat.value}
      </dd>
      {stat.hint ? (
        <p className="mt-2 text-xs leading-5 text-ink-faint">{stat.hint}</p>
      ) : null}
    </div>
  );
}

// A plain label and value on one line. Used for the short stats list on
// the Overview tab.
export function StatRow({ stat }: { stat: Stat }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-sm text-ink-soft">{stat.label}</dt>
      <dd className="text-sm font-medium tabular-nums text-ink">{stat.value}</dd>
    </div>
  );
}
