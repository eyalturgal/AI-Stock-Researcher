import type { ReactNode } from "react";

// A glass panel. Glass is used for things that float above the page, like
// the chart. Most other content sits straight on the page with no box.
// "children" is whatever you put between <GlassCard> and </GlassCard>.
// "className" lets a page add extra classes, for example to make it wider.
export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass rounded-3xl p-5 sm:p-7 ${className}`}>
      {children}
    </section>
  );
}

// The title row of a section, with room for a link on the right side.
export function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex items-baseline justify-between gap-4">
      <h2 className="text-lg font-semibold tracking-tight text-ink">{title}</h2>
      {action}
    </div>
  );
}
