"use client";
// Runs in the browser because it needs to know which page is open right
// now, in order to mark the matching tab.

import Link from "next/link";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/config/site";

export function TabNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Sections" className="h-full">
      <ul className="flex h-full gap-6">
        {siteConfig.tabs.map((tab) => (
          <li key={tab.href} className="h-full">
            <Link
              href={tab.href}
              aria-current={pathname === tab.href ? "page" : undefined}
              className="tab-link"
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
