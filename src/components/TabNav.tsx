"use client";
// Runs in the browser because it needs to know which page is open right
// now, in order to highlight the matching tab.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections" className="max-w-full overflow-x-auto">
      <ul className="glass inline-flex gap-1 rounded-full p-1.5">
        {siteConfig.tabs.map((tab) => (
          <li key={tab.href}>
            <Link
              href={tab.href}
              aria-current={pathname === tab.href ? "page" : undefined}
              className="glass-button"
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
