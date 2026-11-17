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
- Layout rule: content sits straight on the page, separated by space and thin lines. Glass is only for things that float above the page (the top bar, the chart panel). Do not put a box around everything. Page sections use the `shell` class so their edges line up.
- The themes have different characters. Light: airy, soft color wash at the top, see-through glass. Dark: a trading desk, flat neutral charcoal, no colored glow, solid panels. Do not add glows or gradients to the dark theme.
- There are two themes, light (default) and dark. Any new color must get a value for both in `globals.css`, and every visual change must be checked in both.
- Reusable pieces live in `src/components`. Each tab is a page in `src/app`.
- Data: `src/lib/sec.ts` fetches from the SEC (server only, cached), `src/lib/financials.ts` is the math, `src/lib/stats.ts` formats figures for display. Prices and charts come from TradingView widgets (`src/components/TradingViewWidget.tsx`). There is no price data in our own code.
- The SEC needs the `SEC_USER_AGENT` setting (site name, a space, a contact email). Locally it lives in `.env.local`, which is never committed. On Vercel it is an Environment Variable. Never write the email in code or docs.
- `src/data/sample.ts` now holds placeholder news only, until Phase 3. Pages that show it must say it is a placeholder.
- Check work with `npm run lint` and `npm run build` before committing.
- In Claude's cloud workspace, run Node commands that need the internet with `NODE_USE_ENV_PROXY=1` in front (for example `NODE_USE_ENV_PROXY=1 npm run build`). Without it the SEC cannot be reached and the build shows the failure message. This is a workspace quirk, not needed on Vercel or a normal computer.
- TradingView's widget server refuses requests from Claude's cloud workspace, so widgets cannot be seen working there. Eyal checks them on the Vercel preview. Do not try to get around the refusal.
- Claude's cloud workspace can only reach websites on its allow-list. Before using a new data source, ask Eyal to approve adding its host, then test real calls. Never fake a response from a source that could not be reached.

## Project rules
- Never hard-code a ticker or company name. Everything comes from one config file.
- API keys and secrets stay server-side, in environment variables, never committed.
- Every external API must be cached and must have an error fallback.
- Check data source terms allow public display, and credit sources on the site.
- AI-written research is a research aid, not financial advice. It must show its sources, carry a "not financial advice" note, and never tell anyone to buy or sell.
- When I repeat a process that will be needed again (e.g. setting up a stock), suggest saving it as a reusable skill, command, subagent or script.
