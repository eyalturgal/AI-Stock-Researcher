// Loads every page in a real browser, in both themes and at phone size, and
// reports what a visitor would run into: pages that fail, anything the
// Content Security Policy blocks, page errors, console errors, requests
// that fail, widget frames that do not appear, and sideways scrolling.
//
// Usage, in Claude's workspace (Playwright is installed there), from the
// project folder after a build:
//   node .claude/skills/security-and-error-check/scripts/check-pages.js http://localhost:3000
//   node .claude/skills/security-and-error-check/scripts/check-pages.js https://ai-stock-researcher-ten.vercel.app
// The pages come from the last build (.next/app-path-routes-manifest.json).
// Exits with 1 if a page fails, anything is blocked, a page throws an error,
// or a page scrolls sideways on a phone. Console errors and failed requests
// are listed for a person to judge: some come from the workspace's network.

/* eslint-disable @typescript-eslint/no-require-imports --
   Playwright is installed for the whole of Claude's workspace, outside this
   project, and only require() can load it from there. */
const fs = require("fs");
const { chromium } = require("playwright");

const base = (process.argv[2] || "http://localhost:3000").replace(/\/$/, "");
const manifest = ".next/app-path-routes-manifest.json";
const pages = fs.existsSync(manifest)
  ? Object.entries(JSON.parse(fs.readFileSync(manifest, "utf8")))
      .filter(([file, route]) => file.endsWith("/page") && !route.startsWith("/_"))
      .map(([, route]) => route)
      .sort()
  : ["/"];

(async () => {
  const browser = await chromium.launch();
  const bad = [], blocked = new Set(), errors = new Set(), failed = new Set(), sideways = [];
  for (const theme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    await page.addInitScript((t) => {
      try { localStorage.setItem("theme", t); } catch {}
      window.__blocked = [];
      document.addEventListener("securitypolicyviolation", (e) =>
        window.__blocked.push(`${e.effectiveDirective} blocked ${e.blockedURI || "(inline)"}`));
    }, theme);
    page.on("pageerror", (e) => bad.push(`page error: ${e.message.slice(0, 160)}`));
    page.on("console", (m) => { if (m.type() === "error") errors.add(m.text().slice(0, 160)); });
    page.on("requestfailed", (r) => failed.add(
      `${new URL(r.url()).host} (${r.failure()?.errorText}) from ${r.frame()?.url().startsWith(base) ? "our page" : "a widget frame"}`));
    for (const route of pages) {
      const response = await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(4000);
      if (response?.status() !== 200) bad.push(`${theme} ${route} answered ${response?.status()}`);
      const r = await page.evaluate(() => ({
        blocked: window.__blocked,
        frames: [...document.querySelectorAll("iframe")].map((f) => f.getBoundingClientRect().height),
        items: document.querySelectorAll("main li:has(> h3)").length,
      }));
      r.blocked.forEach((b) => blocked.add(b));
      const empty = r.frames.filter((h) => h < 50).length;
      if (empty) bad.push(`${theme} ${route}: ${empty} widget frame(s) did not appear`);
      console.log(`${theme.padEnd(5)} ${route.padEnd(22)} widgets: ${r.frames.length}  news items: ${r.items}`);
    }
    await page.close();
  }
  const phone = await browser.newPage({ viewport: { width: 390, height: 844 } });
  for (const route of pages) {
    await phone.goto(base + route, { waitUntil: "networkidle" });
    if (await phone.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)) sideways.push(route);
  }
  await browser.close();

  const list = (items) => (items.length ? "\n  " + items.join("\n  ") : " none");
  console.log(`\nFailed pages and page errors:${list(bad)}`);
  console.log(`Blocked by the Content Security Policy:${list([...blocked])}`);
  console.log(`Pages that scroll sideways on a phone:${list(sideways)}`);
  console.log(`Console errors (judge these):${list([...errors])}`);
  console.log(`Failed requests (judge these):${list([...failed])}`);
  process.exit(bad.length || blocked.size || sideways.length ? 1 : 0);
})();
