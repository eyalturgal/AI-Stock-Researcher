import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/config/site";
import { stockConfig } from "@/config/stock";
import { SiteHeader } from "@/components/SiteHeader";
import { StockHeader } from "@/components/StockHeader";
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

// A tiny script that runs before anything is drawn. If the visitor picked a
// theme on an earlier visit, it applies that theme straight away, so the page
// never flashes in the wrong colors. It lives here as plain text because it
// has to run before React starts.
const applySavedTheme = `(function(){try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

// The layout wraps every page on the site. Everything here (header, stock
// panel, tabs, footer) stays on screen while "children", the page for the
// current tab, swaps underneath. The tabs themselves live in the header.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme="light" is the default for a first visit. suppressHydrationWarning tells React
    // it is fine that the script above may already have changed it.
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: applySavedTheme }} />
      </head>
      <body>
        <div className="backdrop" aria-hidden="true" />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <StockHeader />
          <main className="shell flex-1 pb-20">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
