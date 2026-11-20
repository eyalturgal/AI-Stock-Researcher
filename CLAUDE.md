# Instructions for Claude

## Start of every session
1. Read PROJECT_BRIEF.md (the vision) and ROADMAP.md (current phase and progress).
2. Tell me the current phase and the next unchecked task, then confirm before starting.

## End of every session
Update ROADMAP.md:
- Check off finished tasks
- Update "Current status" (phase, next action, blockers, date)
- Move answered open questions into the decision log
- Add a short session log entry

## How to work with me
- I'm a beginner, currently doing CS50. I want to understand everything we build.
- Workflows, automations and agents: I want to learn them, but only as a real need comes up. If a task needs one, build it and teach it. If not, don't force it.
- AI costs: start free, then small. I'll decide the budget later.
- Explain decisions briefly and in plain language: what we're doing, why, and what the alternatives were.
- When something is a rabbit hole I haven't learned yet, teach the concept before writing the code.
- Push back if I'm overscoping or skipping a phase.
- Prefer existing open source tools and libraries over custom code.
- No em dashes, no AI-sounding writing in any user-facing text on the site.

## Tech stack
- Next.js (App Router), React, TypeScript, Tailwind CSS. Hosted on Vercel.
- Before writing Next.js code, follow AGENTS.md: this Next.js version is newer than most examples online, so read the matching guide in `node_modules/next/dist/docs/` first.
- Site-wide settings live in `src/config/site.ts`. The tracked stock lives in `src/config/stock.ts`, and that is the only file allowed to name a ticker or company.
- Design tokens (colors, the `glass` and `glass-button` styles) live in `src/app/globals.css`. Components use the token names, never raw color codes.
- Write each CSS setting once, with no hand-written `-webkit-` copy: the CSS build adds browser prefixes itself, and a hand-written copy can replace the standard one (this once switched off the top bar's blur in Chrome).
- Layout rule: content sits straight on the page, separated by space and thin lines. Glass is only for things that float above the page (the top bar, the chart panel). Do not put a box around everything. Page sections use the `shell` class so their edges line up.
- The themes have different characters. Light: airy, soft color wash at the top, see-through glass. Dark: a trading desk, flat neutral charcoal, no colored glow, solid panels. Do not add glows or gradients to the dark theme.
- There are two themes, light (default) and dark. Any new color must get a value for both in `globals.css`, and every visual change must be checked in both.
- Reusable pieces live in `src/components`. Each tab is a page in `src/app`. A tab with sub-tabs (News) lists them in `src/config/site.ts` and has a `layout.tsx` in its folder that shows them with `SubTabNav`. Its sections are shared components (`src/components/NewsSections.tsx`), shown short on the tab's own page and in full on their sub-page.
- Data: `src/lib/sec.ts` fetches from the SEC (server only, cached, paced under the SEC's limit of 10 requests a second), `src/lib/financials.ts` is the math, `src/lib/stats.ts` formats figures for display, `src/lib/filings.ts` turns the SEC's filing list into labeled news items, `src/lib/documents.ts` reads attachments and titles from SEC documents. `src/lib/newsroom.ts` fetches the company's newsroom feed and `src/lib/feed.ts` parses it. The newsroom feed and the peer companies are set in `src/config/stock.ts`. Prices, charts and news coverage come from TradingView widgets (`src/components/TradingViewWidget.tsx`). There is no price data in our own code.
- Database: Postgres on Neon, connected through Vercel, used with Drizzle. Tables are defined in `src/db/schema.ts`, reads and writes live in `src/db/store.ts`, the connection in `src/db/index.ts`. The database is optional: without `DATABASE_URL` (or if it fails) the site reads its live sources, so every store function catches its own errors.
- To change a table: edit `src/db/schema.ts`, run `npm run db:generate`, and commit the new SQL file in `drizzle/`. `npm run build` applies new table changes first (`scripts/migrate.mjs`). A failed table change is logged loudly but does not stop the build.
- In Claude's cloud workspace, a local practice Postgres 16 stands in for Neon: start it with `pg_ctlcluster 16 main start`. `.env.local` points `DATABASE_URL` at it. Never ask for, send or commit the Neon connection string.
- Set `SEC_LOG_REQUESTS=1` to print every request made to the SEC, with the time each one was sent (to check the rate stays under the limit).
- The SEC needs the `SEC_USER_AGENT` setting (site name, a space, a contact email). Locally it lives in `.env.local`, which is never committed. On Vercel it is an Environment Variable. Never write the email in code or docs.
- No placeholder data is left on the site. Anything shown before its real source exists must be labeled as a placeholder.
- Check work with `npm run lint` and `npm run build` before committing.
- GitHub checks the live site (`.github/workflows/live-check.yml` runs `scripts/check-live.sh`). It is set for every three hours, and in practice GitHub runs it about three times a day. The check: every page answers, sends its security headers and shows real data. When the check fails it opens a "Live site check failed" issue, which emails Eyal. A new page goes in that script's page list.
- Vercel Web Analytics counts page views (`<Analytics />` in `src/app/layout.tsx`): anonymous and without cookies, as the footer says. On Vercel its script comes from this site, so the Content Security Policy needs no outside address for it. Locally its script answers 404, which is expected.
- Security headers and the Content Security Policy live in `next.config.ts`. A new outside script, frame or connection must be added to the policy there, then every page checked in both themes for anything blocked.
- In Claude's cloud workspace, run Node commands that need the internet with `NODE_USE_ENV_PROXY=1` in front (for example `NODE_USE_ENV_PROXY=1 npm run build`). Without it the SEC cannot be reached and the build shows the failure message. This is a workspace quirk, not needed on Vercel or a normal computer.
- TradingView widgets use the script-embed format from TradingView's own tutorial (scripts on `s3.tradingview.com`, settings as JSON inside the script tag). Take settings from their docs at `https://www.tradingview.com/widget-docs/` (add `.md` to a page address for a plain-text copy). Do not guess widget names or addresses. Each widget shows TradingView's credit line under it, word for word as their embed code has it ("{ticker} stock chart by TradingView" and so on): their FAQ says removing or changing it needs their agreement. The list of their docs pages is at `https://www.tradingview.com/widget-docs/llms.txt`.
- TradingView widgets load fully in Claude's cloud workspace (their sites are on the allow-list). Give them about 10 seconds before taking a screenshot. Always check them in the dark theme too. Widgets below the visible part of the page can look blank in a full-page screenshot: scroll them into view and take a normal screenshot before calling it a bug.
- Claude's cloud workspace can open the live site, https://ai-stock-researcher-ten.vercel.app/. Check each deployment there after merging. The workspace's test browser draws blur poorly (a faint sharp copy of the text stays behind it), so check a blur by its computed style and leave the final look to a real browser.
- Claude's cloud workspace can only reach websites on its allow-list. Before using a new data source, ask Eyal to approve adding its host, then test real calls. Never fake a response from a source that could not be reached.

## Project rules
- Never hard-code a ticker or company name. Everything comes from one config file.
- API keys and secrets stay server-side, in environment variables, never committed. A file that reads a secret or the database starts with `import "server-only"`, so the build fails if it is ever pulled into browser code. Never put a secret in a `NEXT_PUBLIC_` variable: those are sent to browsers.
- Every external API must be cached and must have an error fallback.
- Outside data is shown as text, never as HTML. Links taken from outside data must be ordinary web links (see `webAddress` in `src/lib/feed.ts`).
- Check data source terms allow public display, and credit sources on the site. Use the `check-data-source` skill (`.claude/skills/check-data-source/SKILL.md`) for every new source.
- AI-written research is a research aid, not financial advice. It must show its sources, carry a "not financial advice" note, and never tell anyone to buy or sell.
- Run the `security-and-error-check` skill after a heavy phase (5 and 6), at the Nvidia checkpoint (end of Phase 7), after Phase 9, before any launch and at the very end (Eyal's rule, 2026-11-17). The roadmap lists each one as a task.
- When I repeat a process that will be needed again (e.g. setting up a stock), suggest saving it as a reusable skill, command, subagent or script.
