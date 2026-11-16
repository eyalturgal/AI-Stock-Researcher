import type { Metadata } from "next";
import { sampleStatGroups } from "@/data/sample";
import { SectionTitle } from "@/components/ui/GlassCard";
import { StatTile } from "@/components/ui/StatTile";

export const metadata: Metadata = { title: "Metrics" };

// The Metrics tab: key numbers in groups, each with a plain explanation.
export default function MetricsPage() {
  return (
    <div className="flex flex-col gap-8">
      {sampleStatGroups.map((group) => (
        <section key={group.title}>
          <div className="mb-3">
            <SectionTitle>{group.title}</SectionTitle>
          </div>
          <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {group.stats.map((stat) => (
              <StatTile key={stat.label} stat={stat} />
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
