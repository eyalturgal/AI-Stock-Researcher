import Link from "next/link";
import { siteConfig } from "@/config/site";

// The strip at the very top: the site name, and a badge that is honest
// about the data being fake for now.
export function SiteHeader() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <Link href="/" className="flex items-center gap-2.5 rounded-lg">
        <span
          aria-hidden="true"
          className="glass flex size-8 items-center justify-center rounded-xl text-xs font-semibold text-ink"
        >
          {siteConfig.mark}
        </span>
        <span className="text-sm font-semibold tracking-tight text-ink">
          {siteConfig.name}
        </span>
      </Link>

      <p className="rounded-full border border-line px-3 py-1 text-xs text-ink-soft">
        Sample data. Live data is coming.
      </p>
    </header>
  );
}
