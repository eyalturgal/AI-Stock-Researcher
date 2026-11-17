import { Suspense } from "react";
import type { Metadata } from "next";
import { MetricGroups, MetricGroupsLoading } from "@/components/Fundamentals";

export const metadata: Metadata = { title: "Metrics" };

// The Metrics tab: the company's reported numbers in groups, each with a
// plain explanation. The data comes from the SEC.
export default function MetricsPage() {
  return (
    <Suspense fallback={<MetricGroupsLoading />}>
      <MetricGroups />
    </Suspense>
  );
}
