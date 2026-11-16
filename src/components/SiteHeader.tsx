import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TabNav } from "@/components/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";

// The bar across the top of every page. It stays in place while the page
// scrolls. It holds the site name, the tabs, a badge that is honest about
// the data being fake for now, and the theme switch.
//
// On a phone the tabs drop to their own row under the site name.
export function SiteHeader() {
  return (
    <header className="glass-bar sticky top-0 z-20">
      <div className="shell flex flex-wrap items-center gap-x-8">
        <Link href="/" className="flex h-14 items-center gap-2.5">
          <span
            aria-hidden="true"
            className="brand-fill flex size-7 items-center justify-center rounded-lg text-[0.6875rem] font-bold"
          >
            {siteConfig.mark}
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </span>
        </Link>

        <div className="order-last h-11 w-full overflow-x-auto md:order-none md:h-14 md:w-auto">
          <TabNav />
        </div>

        <div className="ml-auto flex items-center gap-3">
          <p className="hidden rounded-full border border-line px-3 py-1 text-xs text-ink-soft sm:block">
            Sample data. Live data is coming.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
