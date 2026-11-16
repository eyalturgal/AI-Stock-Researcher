import { formatPercent, formatSigned } from "@/lib/format";

// Shows how much the price moved: an arrow, the amount and the percent.
// The direction is carried by the arrow and the plus or minus sign as well
// as the color, so it still reads for people who can't tell red from green.
export function ChangePill({
  change,
  changePercent,
}: {
  change: number;
  changePercent: number;
}) {
  const direction = change > 0 ? "up" : change < 0 ? "down" : "flat";

  const style = {
    up: { arrow: "▲", arrowColor: "text-up", background: "bg-up/15", word: "Up" },
    down: { arrow: "▼", arrowColor: "text-down", background: "bg-down/20", word: "Down" },
    flat: { arrow: "■", arrowColor: "text-ink-faint", background: "bg-white/10", word: "Unchanged" },
  }[direction];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-ink ${style.background}`}
    >
      <span aria-hidden="true" className={`text-[0.65rem] ${style.arrowColor}`}>
        {style.arrow}
      </span>
      {/* Read out by screen readers in place of the arrow. */}
      <span className="sr-only">{style.word}</span>
      <span>{formatSigned(change)}</span>
      <span className="text-ink-soft">({formatPercent(changePercent)})</span>
    </span>
  );
}
