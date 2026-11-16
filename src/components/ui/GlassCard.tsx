import type { ReactNode } from "react";

// The basic building block of the site: a glass panel with rounded corners.
// "children" is whatever you put between <GlassCard> and </GlassCard>.
// "className" lets a page add extra classes, for example to make one card wider.
export function GlassCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`glass rounded-3xl p-5 sm:p-6 ${className}`}>
      {children}
    </section>
  );
}

// The small title row at the top of a card, with room for a link or button
// on the right side.
export function CardHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {action}
    </div>
  );
}
