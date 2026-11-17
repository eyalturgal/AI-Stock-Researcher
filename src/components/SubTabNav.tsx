"use client";
// A row of smaller tabs at the top of a tab's page, such as Filings and
// Industry under News. Like TabNav, it runs in the browser so it can mark
// the page that is open.

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type SubTab = { label: string; href: string };

export function SubTabNav({ label, tabs }: { label: string; tabs: readonly SubTab[] }) {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);

  // On a phone the row scrolls sideways when the tabs do not fit, and the
  // open sub-tab can sit past the right edge. Scroll the row (not the page)
  // so it shows.
  useEffect(() => {
    const nav = navRef.current;
    const open = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !open) return;
    const right = open.offsetLeft + open.offsetWidth;
    if (right > nav.scrollLeft + nav.clientWidth) nav.scrollLeft = right - nav.clientWidth;
  }, [pathname]);

  return (
    <nav ref={navRef} aria-label={label} className="relative mb-10 overflow-x-auto">
      <ul className="flex h-10 w-max min-w-full gap-6 border-b border-line">
        {tabs.map((tab) => (
          <li key={tab.href} className="h-full">
            <Link
              href={tab.href}
              aria-current={pathname === tab.href ? "page" : undefined}
              className="subtab-link"
            >
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
