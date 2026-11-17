import type { NextConfig } from "next";

// Security headers, sent with every page. ROADMAP.md (Phase 4) lists what
// each one protects against and how it was tested.
//
// The Content Security Policy tells the browser where this site may load
// scripts, frames and other files from. Everything else is blocked. A new
// outside script, frame or connection (another widget, analytics, an AI
// chat service) has to be added here, or the browser will refuse it.
const isDev = process.env.NODE_ENV === "development";

const contentSecurityPolicy = [
  "default-src 'self'",
  // Next.js and the theme script need inline scripts. TradingView's widget
  // scripts come from s3. The development server also needs eval, and
  // Vercel Web Analytics loads a debug script from its own site there. On
  // the live site its script comes from this site.
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""} https://s3.tradingview.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // The TradingView widgets draw inside frames from their own site.
  "frame-src https://www.tradingview-widget.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  // No other site may show this one inside a frame.
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  // The older way of saying "no frames", for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  // Browsers must trust the file type the server states, not guess it.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // A link to another site tells it only which site the visitor came from,
  // not the full page address.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Switch off browser features the site never uses.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), browsing-topics=()",
  },
  // Not needed here: Strict-Transport-Security (always use HTTPS), because
  // Vercel already sends it.
];

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
