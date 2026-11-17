---
name: security-and-error-check
description: Run the full security and error check of the AI Stock Researcher site, and re-check that everything built so far still works. Covers secrets in the git history and in browser code, server-only guards, risky entry points, library security advisories, security headers and the Content Security Policy, page errors in both themes and at phone size, data fallbacks, SEC request pacing, and the live site. Use after a heavy phase (Phase 5, Phase 6), at the Nvidia checkpoint (end of Phase 7), after Phase 9, before any launch, at the very end (Phase 10), after adding a secret, an outside source, a login or any page or endpoint that takes visitor input, and whenever Eyal asks for a security check, an error check, a health check or to "check everything still works".
---

# Security and error check

Eyal asked for this after the first security pass (Phase 4, 2026-11-17): after every major update, after each heavy phase, and above all at the end, check security again and check that everything built so far still works. The first pass, with its reasons, is the "Security pass results" table in ROADMAP.md, Phase 4. This check repeats it and adds whatever the new work brought in.

Never print a secret's value, in commands or in the report. The scripts here print counts only.

## 1. Prepare

1. `pg_ctlcluster 16 main start` (the practice database).
2. `SEC_LOG_REQUESTS=1 NODE_USE_ENV_PROXY=1 npm run build > build.log 2>&1` in the scratchpad, not the repo. It must end with "Database tables are up to date." and no unexpected "Could not ..." lines.
3. `npm run lint` and `npx tsc --noEmit` pass.
4. `NODE_USE_ENV_PROXY=1 npm start` in the background. Without that setting the running site cannot reach the SEC either: once its cached pages go stale, it rebuilds them with the "could not be loaded" messages, and the page check reports missing items.

## 2. Security

1. **Secrets.** `bash .claude/skills/security-and-error-check/scripts/scan-secrets.sh`. Every count must be 0. On a hit, look at the match privately, then tell Eyal: a secret in the git history has to be changed at its source (a new password or key), because removing it from the history does not make it safe again.
2. **Server-only guard.** Every file that reads `process.env` or the database starts with `import "server-only"`: `grep -rln "process.env\|@/db" src` and check each one. No secret is in a `NEXT_PUBLIC_` variable.
3. **Entry points.** List anything a visitor can send data to: `find src -name route.ts -o -name proxy.ts -o -name middleware.ts`, `grep -rl '"use server"' src`, folders with brackets (`[id]`), forms, and `dangerouslySetInnerHTML`, `innerHTML` or `eval`. Each new one needs its input checked, and anything that costs money or calls a rate-limited source on each request (an AI question, the SEC) needs rate limiting. Read the "Auditing" part of `node_modules/next/dist/docs/01-app/02-guides/data-security.md`.
4. **Libraries.** `npm audit --omit=dev` must find 0 (the code the site ships). Then `npm audit`: compare with the accepted list below. Apply `npm audit fix` for the rest. Never `npm audit fix --force` without asking Eyal: it can downgrade tools and break them.
5. **Headers and the live site.** `RETRY_WAIT=0 bash scripts/check-live.sh https://ai-stock-researcher-ten.vercel.app` (the same check GitHub runs every three hours). Also look at the latest runs of the "Live site check" workflow on GitHub, and at any open "Live site check failed" issue.
6. **Content Security Policy and page errors.** `node .claude/skills/security-and-error-check/scripts/check-pages.js http://localhost:3000`, then again with the live address. Nothing may be blocked. If something new is blocked, it is a new outside source: add it to the policy in `next.config.ts` only if it is wanted and its terms were checked (the `check-data-source` skill).
7. **Outside data.** Outside text is shown as text, never as HTML, and outside links pass `webAddress` (`src/lib/feed.ts`). Check any new outside source for both.

## 3. Does everything still work

1. **Pages.** The `check-pages.js` report: every page in both themes, the widgets appear, the news pages have their items (Filings 40, Industry 30, Announcements everything saved), nothing scrolls sideways on a phone. Look at screenshots of anything new, in both themes.
2. **Fallbacks.** Every outside source must have one. Stop the database (`pg_ctlcluster 16 main stop`) and build: it must log "DATABASE UPDATE FAILED" and still build every page from the live sources. Start the database again afterwards. A build without `NODE_USE_ENV_PROXY=1` cannot reach the SEC: the pages must show the "could not be loaded" messages, not crash.
3. **SEC pacing.** `node .claude/skills/security-and-error-check/scripts/sec-rate.js build.log` on a build that read many documents (after the stop-the-database build is a good one). At most 8 in any second. With the database full, a build makes about 9 requests in all.
4. **Anything added since the last check.** Re-test it as a visitor would, and read its part of ROADMAP.md for what it should do.

## 4. Record

Add a dated results table to ROADMAP.md, in the section of the phase just finished, in the same form as the Phase 4 "Security pass results": risk, how it was checked, result, what was done. Fix what can be fixed. For anything left, write why. Add a session log entry. Tell Eyal what was found in plain words, and what he has to do himself, if anything.

## Known results (update when they change)

- Accepted library advisories, developer tools only (2026-11-17): `esbuild` via drizzle-kit (only affects a development server that is never run; its only fix breaks drizzle-kit) and `picomatch` (no fixed version yet; needs attacker-written file patterns). Take them off this list once a fix exists.
- Known console error in Claude's workspace only: `snowplow-pixel.tradingview.com` fails from inside TradingView's frames. That is TradingView's visitor tracking, blocked by the workspace's network, not by the site.
- The workspace's test browser draws blur poorly. Check a blur by its computed style, not by a screenshot.
- The SEC request queue covers one running program. Next.js builds fewer than 25 pages in one worker. Past 25 pages (Phase 9), see the open question in ROADMAP.md about pacing with several build workers.
