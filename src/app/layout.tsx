import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { stockConfig } from "@/config/stock";
import { SiteHeader } from "@/components/SiteHeader";
import { StockHeader } from "@/components/StockHeader";
import { TabNav } from "@/components/TabNav";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// What shows in the browser tab and in search results.
// A page can set its own title, and "template" adds the rest around it.
export const metadata: Metadata = {
  title: {
    default: `${stockConfig.ticker} | ${siteConfig.name}`,
    template: `%s | ${stockConfig.ticker} | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

// The layout wraps every page on the site. Everything here (header, stock
// panel, tabs, footer) stays on screen while "children", the page for the
// current tab, swaps underneath.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <div className="backdrop" aria-hidden="true" />
        <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-5 px-4 py-5 sm:gap-6 sm:px-6 sm:py-8">
          <SiteHeader />
          <StockHeader />
          <TabNav />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
