import Link from "next/link";
import { siteConfig } from "@/config/site";
import { TabNav } from "@/components/TabNav";
import { ThemeToggle } from "@/components/ThemeToggle";

// The bar across the top of every page. It stays in place while the page
// scrolls. It holds the site name, the tabs and the theme switch.
//
// On a phone the tabs drop to their own row under the site name.
export function SiteHeader() {
  return (
    <header className="glass-bar sticky top-0 z-20">
      <div className="shell flex flex-wrap items-center gap-x-8">
        <Link href="/" className="flex h-14 items-center gap-2.5">
          {/* The site's mark: a rising line in a one-color square. It takes
              the text color, so it turns light in the dark theme. */}
          <span
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-lg bg-ink text-canvas"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.25}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="4,16 9,11 13,14 20,7" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </span>
        </Link>

        {/* On a phone the tabs can scroll sideways. Never up and down: the
            line under the open tab reaches 1px past the row, which Windows
            would otherwise answer with a scrollbar. */}
        <div className="order-last h-11 w-full overflow-x-auto overflow-y-hidden md:order-none md:h-14 md:w-auto md:overflow-visible">
          <TabNav />
        </div>

        <div className="ml-auto flex items-center">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
