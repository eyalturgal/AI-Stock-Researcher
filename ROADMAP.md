# Roadmap and Progress

This file is the source of truth for where the project stands. Update it at the end of every work session.

---

## Current status

- **Current phase:** Phase 5 (Automation and AI research layer), not started. v1 was launched on 2026-11-20, which closed Phase 4
- **Next action:** Start Phase 5 in a fresh Claude session. First, with Eyal, break it into small sub-steps (as Phase 3 was) and settle what it depends on, all in the open questions: (1) the AI budget, a monthly cap; (2) whether the site stays public, which decides what the AI briefs may show; (3) which AI model, and how costs are capped (look up current prices first; load the `claude-api` skill); (4) the rules for what AI briefs may contain (a working rule is already there). Scheduled jobs run on GitHub Actions (decided in 3.7). The first build step is likely the collector job and the tables it fills
- **Blocked on:** Eyal's AI budget and public-or-private decisions
- **Last updated:** 2026-11-20

### Done so far
- [x] Personal site (eyalturgal.com) basically finished
- [x] Project idea defined and written up in PROJECT_BRIEF.md
- [x] Roadmap created
- [x] GitHub repo created with the project docs in it
- [x] Tech stack and hosting chosen
- [x] Hello world page built, merged to `main` and deployed on Vercel
- [x] Phase 1 first pass: design system, four tabs, stock config, sample data
- [x] Phase 2: real figures from the SEC, with TradingView's price panel and chart
- [x] Phase 3: the News tab with filings, company announcements, industry news and media coverage, in sub-tabs, with a database behind it. Eyal's verdict: "incredibly useful" (2026-11-17)
- [x] Phase 4: v1 launched (2026-11-20) at https://ai-stock-researcher-ten.vercel.app/ after a security pass, monitoring, analytics, TradingView's credit lines, a pre-launch security and error check, and the fixes from Eyal's visual review

---

## Phases

Each phase ends with something working and visible. Don't start the next phase until the current one's "done when" is true.

### Phase 0: Setup and foundations
- [x] Create a GitHub repo for the project
- [x] Add CLAUDE.md, PROJECT_BRIEF.md, ROADMAP.md to the repo
- [ ] Learn the git basics needed: commit, push, branch, pull request
- [x] Decide the tech stack (have Claude propose options and explain the tradeoffs)
- [x] Decide hosting
- [x] Create a "hello world" version
- [x] Deploy it to a public URL (done by Eyal on Vercel. Claude could not open the site to confirm it)

**Done when:** a blank page is live on the internet and deploys automatically when I push to GitHub.

**Live URL:** https://ai-stock-researcher-ten.vercel.app/ (from Eyal, 2026-11-17). Claude's workspace cannot open it: its network blocks the address.

**Left over from Phase 0:** the git basics box. Eyal has now done a pull request and a merge by hand. Commit, push and branch get practiced during Phase 1, one small change at a time.

### Phase 1: Static design (NVDA)
- [x] Define the design system: colors, fonts, spacing, liquid glass components (buttons, cards, tabs)
- [x] Build the main page layout with placeholder data
- [x] Tabs scaffolded: Overview, Chart, Metrics, News (others added later)
- [x] Works well on phone and desktop (checked at 390px and 1280px wide)
- [x] Ticker, company name and keywords come from ONE config file (`src/config/stock.ts`)
- [x] Light and dark themes with a switch (Eyal's request). Light is the default, and the choice is remembered
- [x] Richer palette (Eyal's request): emerald and gold for "markets and money", cyan and violet for "AI and futuristic"
- [x] Open layout (Eyal's feedback: the design felt claustrophobic, too central and too "AI looking"): wide page, tabs in a top bar, name and price straight on the page, glass kept for the top bar and the chart only
- [x] Dark theme reworked (Eyal's feedback: light looks great, dark looked like a tech product demo, not a stock site): flat charcoal, no colored glow, solid panels, blue price line
- [x] Eyal reviews the design and asks for changes until it feels right (signed off 2026-11-17 by starting Phase 2. Looks work continues as real content arrives)

**Done when:** the site looks finished and polished, even though the data is fake.

### Phase 2: Real data
- [x] Choose a market data source and confirm its terms allow display on a public site (SEC EDGAR for financials, TradingView widgets for prices)
- [x] Build a backend/API layer so API keys never reach the browser (`src/lib/sec.ts` runs on the server only, and the SEC contact details live in a private setting)
- [x] Add caching so the site stays within free-tier limits (the SEC is asked about once an hour, and a failure is retried after a minute)
- [x] Live price and price chart from TradingView's widgets (confirmed working on the live site by Eyal, 2026-11-17)
- [x] Metrics tab with real data (reported financials from the SEC)
- [x] Price-based figures (market cap, P/E): TradingView's price panel under the company name shows them, along with dividend yield and the next earnings date
- [x] Loading states and error states (gray placeholder bars while loading, a plain message when the SEC or TradingView cannot be reached. Both were tested)

**Eyal's steps to see it:**
1. In Vercel, open the project, then Settings, then Environment Variables. Add one named `SEC_USER_AGENT` with the value `AI Stock Researcher` followed by a space and the contact email. Tick Production and Preview.
2. Open the Deployments tab and redeploy the latest deployment of the branch `claude/compassionate-cerf-hngjgk` (settings only apply to new deployments).
3. Open that preview site. Check three things: the price under the company name, the chart on Overview and on the Chart tab, and the figures on the Metrics tab.
4. Tell Claude what shows up. If a widget is missing, the page shows a "Loading ... from TradingView" line in its place.

**Done when:** the NVDA page shows real, updating data and nothing breaks when an API is slow or down.

**Phase 2 research (2026-11-17): what each source allows.** Read from each provider's own terms page unless marked otherwise.

| Source | What it has | Free plan allows a public site? | In their words |
|---|---|---|---|
| SEC EDGAR (data.sec.gov) | Filings, reported financials (revenue, earnings, EPS and more), share counts. Updated within about a minute of a filing. No prices, news or analyst data | Yes. No key, no cost | "All Government-created content on sec.gov and EDGAR public filing content are free to access and reuse." Rules: at most 10 requests a second, and automated tools must name themselves with a contact address |
| TradingView widgets | Price charts with drawing tools and indicators, price and fundamentals panels. Embedded as a ready-made block, their data | Yes, with TradingView branding kept | "a free and powerful chart for you to easily embed onto any website". Paying does not unlock real-time data in widgets |
| Finnhub | Prices, fundamentals, news, analyst data | No | "You hereby agree to not redistribute or share access to data or derived results from the data ... with anyone or any 3rd party without written approval" |
| Alpha Vantage | Prices, fundamentals, news | No | Free use is "personal, non-commercial". Anything beyond activities "that are private and individual in nature" counts as commercial |
| Financial Modeling Prep | Prices, fundamentals, analyst data | No | "Free does not mean exempt." A public portfolio or demonstration site is listed as data display that needs an agreement first |
| Twelve Data | Prices, fundamentals | No on the free plan | Free plan is internal use only. External display needs a business plan (reported at about $149 a month, not confirmed with them) |
| Massive (was Polygon) | Prices | Probably not | Not read at the source. Reviews say individual plans are personal use only |

Sources: [SEC webmaster FAQ](https://www.sec.gov/about/webmaster-frequently-asked-questions), [SEC EDGAR APIs](https://www.sec.gov/search-filings/edgar-application-programming-interfaces), [SEC website dissemination policy](https://www.sec.gov/about/privacy-information), [TradingView widgets](https://www.tradingview.com/widget/), [TradingView policies](https://www.tradingview.com/policies/), [Finnhub terms](https://finnhub.io/terms-of-service), [Alpha Vantage terms](https://www.alphavantage.co/terms_of_service/), [FMP on public sites](https://site.financialmodelingprep.com/insights/platform/can-you-use-fmp-data-in-a-public-app-website-or-client-dashboard), [Twelve Data terms](https://twelvedata.com/terms).

**The three ways forward for prices:**
1. **Public and free:** SEC data in our own design, plus TradingView widgets for everything price-based. Comes with TradingView's drawing tools. Less control over how the price chart looks.
2. **Private and free:** put the site behind a login, use a free API (for example Finnhub) under its personal-use terms, keep our own chart. Not publicly viewable.
3. **Public and paid:** buy a plan with display rights (Twelve Data's business plan is the cheapest found so far). Our own chart, public, with a monthly cost.

### Phase 3: News
Phase 3 gathers and organizes the news. Turning it into AI-written briefs is Phase 5, and it is planned here so Phase 3 collects what that needs.

**The categories (drafted with Eyal, 2026-11-17).** News is sorted by who is speaking, because that decides both how much to trust it and what we are allowed to do with it.

| # | Category | What is in it | How sure it is | Reuse |
|---|---|---|---|---|
| A | Official record | SEC filings: annual report (10-K), quarterly report (10-Q), event notices (8-K), which include earnings releases | Certain. The company is legally responsible for it | Free to copy and quote |
| B | Company announcements | Press releases, product launches, keynotes, earnings calls | First-hand, but written to look good | To be checked |
| C | Media coverage | Reporting, interviews, analysis, scandals, rumors | Second-hand. Ranges from solid to speculation | Copyrighted. Headlines and links, or our own summaries |
| D | Industry news | Competitors, suppliers, customers, rules. The industry is set in the stock config | Second-hand | Same as C |
| E | Market news | Interest rates, the wider economy, big moves in the market | Second-hand | Same as C |

Every item also gets a **topic** (earnings, product, leadership, legal, deals, analyst views) and a **certainty label** (confirmed by an official source, reported by media, rumor or speculation, opinion).

**Sub-steps:**
- [x] 3.1 Agree the categories, topics and certainty labels above (agreed by Eyal, 2026-11-17)
- [x] 3.2 Source research, like Phase 2: where it comes from, whether we may show it, and whether we may store and summarize it (done 2026-11-17, results below)
- [x] 3.3 Category A: the company's SEC filings as a feed, with plain-language labels for each filing type (on the News tab, and the latest three on the Overview)
- [x] 3.4 Category B: company announcements, from two places found in 3.2: the company's newsroom feed (its address goes in the stock config), and the press releases already attached to SEC filings, listed under each filing with their own titles
- [x] 3.5 Categories C, D and E: company news (C) and market news (E) from TradingView's news widget. Industry news (D) from the SEC filings of seven peer companies listed in the stock config (research below)
- [x] 3.6 Media coverage as data the AI can use: decided in 3.2. No source checked lets our code store and summarize media articles for a public site, so in Phase 5 the AI finds and reads coverage itself (Claude's web search and web fetch tools) while writing a brief. We store only the brief, short quotes and links
- [x] 3.7 Where news is stored: decided in 3.2. A Postgres database on Neon's free plan, filled by a scheduled job on GitHub Actions. Set up at the start of Phase 5, when something first needs storing
- [x] 3.8 News tab laid out by category, with every source credited. Our own sections come first (official filings, company announcements, industry), TradingView's coverage after. Keyword filtering is dropped: our code holds no media items until Phase 5, and then the AI judges what is relevant
- [x] 3.9 Database: Postgres on Neon's free plan (Eyal chose it, 2026-11-17; moved up from Phase 5). First jobs: keep each filing's attachment titles once they are read, so the SEC is not asked again on every refresh, and keep the newsroom's history, since its feed only holds the last 20 items. Done: SEC requests per build went from 46 to 9
- [x] 3.10 Friendly titles (Eyal's request): use the company's own attachment title as the headline when there is one ("NVIDIA Announces CEO Transition" in place of "Leadership or board change"), turn ALL-CAPITAL titles into normal case, and trim legal wording. AI rewrites what rules cannot fix, in Phase 5. Done: our label now sits under the headline on an "SEC filing" line, and the rules (in `src/lib/documents.ts`) were tested on every stored title
- [x] 3.11 News sub-tabs (Eyal's request): each section opens into its own page with more items (Filings, Announcements, Industry, Coverage), reached from a row of sub-tabs under the main tabs. Done: "All news" shows a short version of every section with a "More…" link, and the sub-pages show 40 filings, every saved announcement, 30 industry filings and taller news boxes

**Eyal's steps for 3.9:**
1. In Vercel, add a database and pick Neon (Neon's guide calls this the "Vercel-Managed" route and recommends it for anyone new to Neon). If asked, choose Create New Neon Account.
2. Region: Washington, D.C. / US East, where Vercel runs the site by default.
3. Auth: off. It adds user logins, and the site has no accounts.
4. Realtime: off. It pushes database changes to open pages instantly, and nothing here needs that. Neon only allows turning it on when a database is created.
5. Plan: Free. Name: ai-stock-researcher.
6. Then Storage, the new database, Connect Project: pick this project and tick Development, Preview and Production. Under "Create database branch for deployment", tick Preview only, so test versions of the site get their own copy of the database and cannot break the live one. Leave the custom prefix empty. Vercel then adds the connection settings (DATABASE_URL and others) to the project on its own.
7. Do not send the password or connection string to Claude. Claude tests against a local copy of Postgres in its workspace, and the live site gets the settings from Vercel.

**Done when:** the news tab is useful enough that I'd actually check it. Met (Eyal, 2026-11-17: "incredibly useful". He keeps using it for a few days, and anything missing goes back on the list).

**Peer companies (2026-11-17).** The industry section follows NVIDIA's rivals and supply chain. All of them file with the SEC, so they cost nothing to follow.

| Company | Why it matters for NVIDIA | Filings |
|---|---|---|
| AMD | Rival in data center GPUs | 8-K event notices |
| Intel | Rival in AI accelerators and data center processors | 8-K |
| Broadcom | Designs custom AI chips for big cloud companies, competing for the same budgets | 8-K |
| Marvell | Custom AI chips and data center networking | 8-K |
| TSMC | Manufactures NVIDIA's chips. Its monthly revenue report is an early read on AI chip demand | 6-K (foreign company) |
| Micron | Supplies the high-bandwidth memory used with NVIDIA's AI chips | 8-K |
| ASML | Makes the machines chip factories like TSMC need for advanced chips | 6-K (foreign company) |

Considered and left out: the rest of the SMH semiconductor ETF (about 25 stocks, with NVIDIA itself around a fifth of the fund). Many of them make analog, car or phone chips that rarely move NVIDIA, so they would add noise. NVIDIA's biggest customers (Microsoft, Alphabet, Amazon, Meta, Oracle) drive its demand but are not chip companies; they can be added to the list later. SK Hynix and Samsung make AI memory too but do not file with the SEC.

**3.2 research (2026-11-17): what each news source allows.** Read from each provider's own pages unless marked otherwise.

| Source | What it has | Show on our public site? | Store it and let the AI summarize it? | In their words |
|---|---|---|---|---|
| SEC filings and their attachments | Filings, plus the company's own press releases and CFO commentary attached to them | Yes | Yes | "free to access and reuse" (Phase 2 research). Checked: the Nov 12 filing carries the CEO-change press release, the Aug 26 filing carries the earnings release and the CFO commentary |
| The company's newsroom feed | Press releases and company blog posts with short summaries. Tested: 20 recent items | Yes, non-commercial, credited and linked | Not addressed. Low risk: it is the company's own announcement | "a free service for any individual for information purposes only. Use is restricted to non-commercial purposes only." NVIDIA may "request the immediate cessation of any specific use" |
| TradingView news widget | Media headlines for the company and the market | Yes, live since pull request 7 | No. It is drawn for people to read, and our code cannot see inside it | Phase 2 research |
| Google News feed | Headlines from many outlets | No | No | "made available solely for the purpose of rendering Google News results within a personal feed reader for personal, non-commercial use. Any other use of the feed is expressly prohibited." |
| The Guardian API | Full article text from one newspaper | Free key is for non-commercial use, and "publishing content on third party sites" is listed under the paid key | No on the free key: the paid key covers "training models for generative artificial intelligence services, text and data mining solutions" | From their access page. Their full terms on theguardian.com were not read: adding that site to Claude's workspace did not go through |
| Marketaux | Finance news snippets tagged by ticker: 3 per request, 100 requests a day | No | No | "solely for your personal, non-commercial use" (terms last updated January 10, 2021) |
| NewsAPI.org | Headlines from many outlets | No | No | Free plan is for "development and testing in a development environment only" (their pricing page, quoted via search) |
| GDELT | Searchable headlines and links from news sites worldwide | Reportedly yes, with a credit and link | Reportedly yes | Not read at the source. Others quote "unlimited and unrestricted use for any academic, commercial, or governmental use of any kind without fee". Its API refused or dropped every test call from Claude's workspace ("Please limit requests to one every 5 seconds") |

**Storage and scheduling (also 3.2):**
- **Neon Postgres, free plan:** "no time limits and no credit card required", 100 compute-hours a month and 1 GB of storage per project. Connects to Vercel through the Vercel Marketplace.
- **GitHub Actions:** free for this repo because it is public (GitHub lists "Standard GitHub-hosted runners in public repositories" as free). Scheduled runs go every 5 minutes at most, can start late when GitHub is busy, and switch off after 60 days without repository activity (these last points from guides, not GitHub's own pages).
- **Files in the repo instead of a database:** possible. Vercel can be told not to deploy a data branch (`git.deploymentEnabled`: "Specify branches that should not trigger a deployment upon commits"). Without that, each data update would use one of the free plan's 100 deployments a day (Vercel's docs, via search).
- **AI costs, for Phase 5:** Claude's web search costs $10 per 1,000 searches plus tokens, and web fetch costs tokens only (Anthropic's pricing docs, via search). The default model, Claude Opus 5.5, costs $4 per million input tokens and $20 per million output tokens.

### Phase 4: Production hardening and v1 launch
- [x] Security pass: secrets in environment variables, rate limiting, input validation, HTTPS, dependency scanning. Done 2026-11-17, results below
- [x] Eyal: two-factor sign-in, and Web Analytics switched on in Vercel (both done by Eyal, 2026-11-20)
- [x] Eyal: in the repo on GitHub, Settings, then "Advanced Security" (in the "Security and quality" part of the sidebar): enable Secret Protection, Push protection and Dependabot alerts. Done by Eyal, 2026-11-20
- [x] Database settings as Secret in Vercel (done by Eyal, 2026-11-17). The Neon connection created them as "Config" (readable again in the dashboard by anyone with access to the project). Vercel does not allow switching integration variables to Secret in the list. Its documented route: disconnect the database from the project, optionally reset the database password in Neon, reconnect with Development unticked and "Sensitive" turned on in the advanced options, then redeploy
- [x] Trim Claude's workspace allow-list: remove sites that were only needed for research or were ruled out (Alpha Vantage, Finnhub, Twelve Data, FMP, Marketaux, NYT, the Guardian, Google News). Keep the live site, added 2026-11-17 so Claude can check each deployment. Done 2026-11-17: 9 removed, 20 left (the SEC, TradingView, NVIDIA's newsroom, GDELT for the Phase 5 test, the database and docs sites, the live site)
- [x] Basic monitoring/error alerts. Done 2026-11-17: GitHub checks the live site, set for every three hours and in practice about three times a day (`.github/workflows/live-check.yml` runs `scripts/check-live.sh`). If a page fails, misses a security header or shows a "could not be loaded" message twice in a row, five minutes apart, it opens a "Live site check failed" issue, which emails Eyal. First run on GitHub: passed
- [x] TradingView's credit line under each widget, a launch requirement found in their widget FAQ. Done 2026-11-17
- [x] Privacy-friendly analytics (optional). Done 2026-11-17: Vercel Web Analytics (Eyal's choice), in the code since pull request 19. It counts once Eyal switches it on (item above). Facts for the choice (Vercel's docs, 2026-11-17): Vercel Web Analytics is free on the Hobby plan for 50,000 page views a month, never billed (it stops counting until the next month), uses no cookies, records page views anonymously and keeps no visitor identity past 24 hours. Note: TradingView's widget frames already run TradingView's own visitor tracking (seen in testing: snowplow-pixel.tradingview.com), outside our control
- [x] Security and error check before the v1 launch (the `security-and-error-check` skill). Done 2026-11-20, results below
- [x] Fixes from Eyal's visual review (2026-11-20): the price panel no longer cuts off its last line, no scrollbar beside the tabs, a price-only header (our SEC figures on Overview and Metrics), a plain one-color mark instead of the gradient, and the site's own icon in browser tabs (it was still the Next.js logo)

**Security pass results (2026-11-17).** What could go wrong for this site, how it was checked, and what was done.

| Risk | How it was checked | Result | What was done |
|---|---|---|---|
| A secret (the SEC contact email, the database password) committed to the public repo | Every past change searched for the email, database addresses and common key formats. Checked that `.env*` files are ignored and were never committed | Clean. The only matches are the README's placeholder examples | Nothing needed |
| A secret sent to visitors' browsers | The built browser code searched for the email and database settings. Only three server files read private settings, and none use `NEXT_PUBLIC_` | Clean | Files that read secrets or the database start with `import "server-only"`, so the build fails if one is ever pulled into browser code. Tested: it does |
| Known security holes in libraries | `npm audit` | 0 in the libraries the site ships. 3 in developer tools | `minimatch` fixed with a safe update. `esbuild` (via drizzle-kit) only affects a development server we never run, and its only fix breaks drizzle-kit. `picomatch` has no fixed version yet and needs attacker-written file patterns. Both left; Dependabot will flag fixes |
| Code slipped in through outside data (newsroom feed, SEC documents) | Read how outside text and links reach the page | React shows outside text as plain text. Links were used as given | Only `http(s)` links are kept from the feed, one bad item no longer stops the feed, and only plain file names become SEC links. Tested with `javascript:` and other bad links |
| Another site showing ours in a frame to trick clicks, browsers guessing file types, full page addresses passed to other sites, unused browser features | Read the live site's headers | None of the matching headers were sent | `next.config.ts` now sends `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` and `Permissions-Policy` |
| Scripts or frames from unknown places | Next.js guide on Content Security Policy | None was set | A policy allowing only our own files and TradingView's script and frames. Every page tested in both themes: nothing blocked, every widget loads |
| Plain HTTP, no encryption | Read the live headers | Vercel already sends `Strict-Transport-Security` (2 years) | Nothing needed |
| Floods of visitors driving up SEC requests or costs (rate limiting) | Looked for forms, API routes, server actions and address-based pages. Read the live cache headers | None exist. Pages come from Vercel's cache (`x-vercel-cache: HIT`), and outside sources are only asked again when the cache runs out | Nothing needed now. Rate limiting becomes necessary with the chatbot (Phase 6), where every question costs money |
| Someone taking over Eyal's accounts (GitHub, Vercel, Neon) | Not checkable from code | The biggest real risk for a one-person project | Eyal's item above: two-factor sign-in and GitHub's security settings |

**Pre-launch security and error check (2026-11-20).** Run with the `security-and-error-check` skill.

| Area | How it was checked | Result | What was done |
|---|---|---|---|
| Secrets | The skill's scan: git history, tracked files, browser code | Clean. The scan flagged its own list of patterns, which had been committed since its first test | The scanner no longer matches itself. Checked that it still catches a made-up token |
| Secret-reading files and browser code | Search for files that read settings or the database | All four start with `import "server-only"`. No `NEXT_PUBLIC_` settings | Nothing needed |
| Entry points | Search for forms, API routes, server actions and address-based pages | None | Nothing needed |
| Libraries | `npm audit` | 0 in the libraries the site ships. Developer tools: only `esbuild` (accepted). `picomatch` is no longer flagged | `picomatch` taken off the accepted list |
| Live site and monitoring | The live check, GitHub's run history and issues | Every page passes. 8 runs, all passed, no issues. But GitHub ran the three-hourly check only about three times a day, about two hours late | Descriptions corrected. Accepted for a personal site |
| Security policy and page errors | The page check, local and live, both themes and phone size | Nothing blocked, no page errors, no sideways scrolling. Only known console messages (TradingView's tracking pixel blocked by the workspace, a cancelled request inside a TradingView frame, the analytics script missing locally) | Nothing needed |
| Database down | Build with the database stopped | Built every page with full data from the SEC, and logged "DATABASE UPDATE FAILED" | Nothing needed |
| SEC down | Build with the SEC unreachable, after clearing the answers saved by the last build | Built every page. Where SEC data goes, the "could not be loaded" message shows, and pages refresh after 1 minute. Announcements still came from the database (26) | The skill now says to clear the saved answers first: a first try without that proved nothing |
| SEC pacing | The rate check on the build that read 123 documents | At most 8 in any second | Nothing needed |
| New since the last check | The live site in both themes | TradingView's credit lines under every widget, the analytics note in the footer, the analytics script loading from the site's own address | Nothing needed. Visitor counts are in Vercel's Analytics tab (Vercel's script skips automated browsers) |

**Done when:** v1 is publicly launched and I'd be comfortable sending the link to anyone. Met: Eyal launched v1 on 2026-11-20.

### Phase 5: Automation and AI research layer
- [ ] Use the database from 3.9 for the collector's items and the AI briefs
- [ ] Scheduled jobs that refresh data and news on their own: a collector on GitHub Actions, about every 30 minutes, storing filings, attached press releases and newsroom items so the AI can look back over days
- [ ] AI news briefs (Eyal's idea, 2026-11-17): group stories about the same event, then write one brief per event. Each brief says what happened, what is confirmed, what is only reported, where sources disagree, what is still unknown, and links every source. Shown as small cards that open into the full brief. Built as a fixed workflow that runs on a schedule, not a free-roaming agent. Eyal's additions: use short direct quotes, credited and linked, so nobody's words get reworded wrong. Sensitive topics (leadership, legal, scandals, rumors) get stricter rules: only what a named source says, labeled as reported until an official source confirms it. The AI may also search the web for stories the regular sources miss. Decided in 3.2: media coverage is found with Claude's web search and read with web fetch, since no news source allows our code to store it
- [ ] AI daily digest: what happened and why it matters
- [ ] AI bull case and bear case rundowns
- [ ] AI earnings summaries
- [ ] AI research papers that summarize one part of the picture (a filing, an earnings call)
- [ ] Every AI-written piece shows its sources and a "not financial advice" note
- [ ] Save each of these as reusable skills/agents/workflows that take a ticker as input
- [ ] Security and error check: a heavy phase (an AI key, AI costs, scheduled jobs)

**Done when:** the site updates its research every day without me touching it.

### Phase 6: AI chatbot
- [ ] Chatbot answers questions using the site's own data (prices, metrics, news, research)
- [ ] Rate limiting per user and a hard monthly spending cap
- [ ] Clear note that it's not financial advice
- [ ] Security and error check: a heavy phase (visitor questions, rate limiting, AI costs)

**Done when:** a visitor can ask "why did NVDA drop this week?" and get a grounded, sourced answer.

### Phase 7: Deeper features
- [ ] Analyst tab: ratings, price targets, consensus (no republishing of full reports)
- [ ] Earnings tab: history, upcoming dates, surprises
- [ ] Financials tab: income statement, balance sheet, cash flow, key ratios
- [ ] Metrics over time (Eyal's request): charts showing how revenue, earnings, margins and P/E have moved across quarters and years
- [ ] Filings tab: SEC filings (10-K, 10-Q, 8-K), linked and organized. Partly covered since 3.11 by News > Filings (the last 40 filings)
- [ ] Technicals: indicators on the chart and a summary section
- [ ] Full chart workspace (Eyal's request): its own full-screen view with drawing tools, chart types, more timeframes and on-canvas options, in the style of TradingView or a broker platform
- [ ] App-style layout (Eyal's idea, 2026-11-17): the site still feels like it floats in empty space. Divide the screen into regions with lines that run edge to edge, the way Vercel, GitHub, YouTube and TradingView's Supercharts do (a sidebar, a main area, a side panel), so every piece sits in its own area. Lines between regions, not boxes around everything, which felt claustrophobic in Phase 1. Best done once there is content to fill the regions, such as the chatbot (Phase 6) and the list of stocks (Phase 9)
- [ ] Auto-updating "buzzwords" per company for news filtering
- [ ] Partners and investments (Eyal's idea, 2026-11-17): the companies NVIDIA invests in and partners with, recent and big ones first. Sources found: its quarterly holdings report to the SEC (form 13F: on Sep 30, 2026 it held shares in 8 public companies worth $48.3B, led by Space Exploration Technologies, Intel and CoreWeave), deal filings (agreements and acquisitions), and partnership announcements in the newsroom. Private stakes only show up in announcements. Can move before the launch if Eyal wants it in v1
- [ ] A project card on eyalturgal.com linking to this site (moved from Phase 4: Eyal, 2026-11-17, "later phase"). Decide at the Nvidia checkpoint
- [ ] Security and error check at the Nvidia checkpoint

**Done when:** Stage 1 matches the full vision in PROJECT_BRIEF.md.

> **First major checkpoint: the fully complete Nvidia tracker.** Reached when Phases 0 to 7 are done.

### Phase 8: Make it repeatable
- [ ] Adding a new ticker is one workflow, not a rebuild
- [ ] Test it by spinning up a second stock page with the saved workflows
- [ ] Optional: auto-detect the most valuable S&P 500 company and switch to it

**Done when:** a new stock page can be created mostly by running saved workflows.

### Phase 9: Stage 2, Magnificent Seven
- [ ] Extend the database from Phase 5 for price history and comparisons across companies
- [ ] Pages for all seven companies
- [ ] Comparison views across companies
- [ ] Pick the project's name and buy its domain, before the site covers more than one stock (moved from Phase 4: v1 launches on the vercel.app address). Then change the address in the monitor (`.github/workflows/live-check.yml`), CLAUDE.md, the skill and the README
- [ ] Security and error check (more pages: see the open question on SEC pacing with several build workers)

### Phase 10: Stage 3, AI stock tracker
- [ ] Expand to a broader set of AI stocks
- [ ] Sector-level research and news
- [ ] Final security and error check

---

## Open questions and rabbit holes

Things I don't know how to do yet. Dive into each one when its phase comes up, and move the answer to the decision log.

- [ ] How "live" updates should work (polling vs websockets) within free limits
- [ ] How far back each kind of data goes on the source we pick. Expectation to confirm in Phase 2: years of daily prices, and reported financials (revenue, earnings) from SEC filings going back many years. P/E over time is not downloaded, it is worked out from the price history and the earnings history
- [ ] Is OpenBB worth using as the data layer, or simpler to call APIs directly?
- [ ] Which AI model/provider for research and the chatbot, and how to cap costs
- [ ] How scheduled jobs/agents run in production. Leaning GitHub Actions: Vercel's free plan only runs scheduled jobs once a day. Eyal is fine paying for Vercel if that turns out simpler
- [ ] Public or private site: the site is currently open to anyone with the link. Eyal thinks of it as private. Putting it behind a login is a Vercel setting. Worth deciding before Phase 5, since what the AI briefs may do can depend on it
- [ ] Which open source data projects to build on: OpenBB and Fincept Terminal (the "open source Bloomberg terminal" projects) get evaluated in Phase 2
- [ ] How to build the full chart workspace: Lightweight Charts has no drawing tools built in. Options to research: TradingView's larger Advanced Charts library (free but needs their approval), TradingView's embeddable widget, or community plugins
- [ ] How to package workflows as Claude Code skills, commands or subagents
- [ ] What AI-written news briefs may contain. Working rule until researched: facts in our own words plus short direct quotes, each credited and linked. Never whole articles or paywalled text. Official filings can be quoted freely. This area of law is unsettled, so check it properly before Phase 5
- [ ] Project name and domain. v1 launches on the vercel.app address (Eyal, 2026-11-17). The name and domain come before Stage 2 (Phase 9)
- [ ] GDELT as a free radar for media stories: test it from GitHub Actions in Phase 5, since it refused every call from Claude's workspace
- [ ] Company logos (Eyal wants them, like other finance sites have): research how those sites get them. Likely a logo service with terms that allow display, or the company's own brand guidelines. For now the site shows a plain tile with the ticker
- [ ] SEC pacing with several build workers: the request queue in `src/lib/sec.ts` covers one running copy of the program. Next.js builds a site of fewer than 25 pages in one worker, so builds are safe today. With more stocks (Phase 9), builds will use several workers, each with its own queue, and together they could pass the SEC's limit of 10 a second. Options then: build with one worker, or share the limit (for example through the database)

---

## Decision log

| Date | Decision | Why |
|------|----------|-----|
| 2026-11-15 | Standalone site, linked from eyalturgal.com | Keep the personal site clean |
| 2026-11-15 | Start with NVDA, ticker kept in one config | Turbulent and widely tracked; easy to switch later |
| 2026-11-15 | Free, no ads, non-commercial, code public | Goal is learning and portfolio, not revenue |
| 2026-11-16 | Working name: AI Stock Researcher (repo `AI-Stock-Researcher`) | Covers the long-term direction (AI research layer, AI stocks). Final name and domain still open |
| 2026-11-16 | Vision widened to "everything needed to understand a stock": added financials, filings, technicals, research papers | Still built in phases. v1 scope is unchanged |
| 2026-11-16 | Analyst tab shows ratings, targets and consensus only | Full analyst reports are paid, copyrighted products and can't be republished |
| 2026-11-16 | Tech stack: Next.js 16 (React, TypeScript) with Tailwind CSS | One codebase covers the pages and the server side that hides API keys. Largest ecosystem, and the chart library is built for it. Alternatives were Astro (simpler, but this site is too interactive for it) and Python Flask (matches CS50, but weaker for a polished UI and more hosting work) |
| 2026-11-16 | Hosting: Vercel Hobby (free) | Made by the Next.js team, deploys on every push with zero setup. Free plan is non-commercial only, which fits. Alternative was Cloudflare (no non-commercial rule, but needs an adapter to run Next.js) |
| 2026-11-16 | Each tab is its own page with its own address (`/`, `/chart`, `/metrics`, `/news`) | Tabs can be linked and shared, each one is a single small file, and it fits a future per-stock address. Alternative was one page that swaps content with JavaScript |
| 2026-11-16 | Chart library (TradingView Lightweight Charts) added in Phase 1, fed with sample data | The design is judged with the real chart, and Phase 2 only has to swap the data. Alternative was a throwaway hand-drawn placeholder |
| 2026-11-16 | Sample data is labeled on every page, and sample news uses obvious placeholder headlines | The site is public. Realistic fake prices or fake news about a real company could mislead someone |
| 2026-11-16 | Green and red are reserved for "up" and "down", always with an arrow and a sign | Keeps color meaningful, and readable for color-blind visitors |
| 2026-11-16 | Two themes, dark and light, switched by a `data-theme` attribute on the page plus CSS variables | Every color already lived in one file, so a second theme is just a second set of values. Used the method from the Next.js docs. Alternative was the `next-themes` library, skipped because it has not been updated since early 2025 and the built-in way is about ten lines |
| 2026-11-16 | Palette: emerald, cyan and violet gradient as the signature, gold as a small highlight, cyan for the price line | Eyal asked for "AI and futuristic" mixed with "stocks and money". The price line stays away from green and red so it never reads as "up" or "down" |
| 2026-11-16 | Open layout: content sits on the page, separated by space and thin lines. Glass is kept for the top bar and the chart panel. The brand gradient appears once, in the site mark | A box around everything made the page feel cramped and gave nothing priority. Glass panels plus glowing gradients everywhere is also the default look of AI-made sites, so using them sparingly makes the site look more like its own thing. Alternative was keeping the cards and only adding spacing |
| 2026-11-17 | The two themes get different characters. Light: airy, a soft wash of color, see-through glass. Dark: a trading desk, flat neutral charcoal, no colored glow, solid panels, blue price line | Eyal liked light but found dark looked like a showcase for new technology. Navy-black with a neon green, cyan and violet glow is the look of tech product launches. Trading platforms use flat charcoal and leave color to the data. Alternative was only dimming the glow |
| 2026-11-17 | Light is the default theme for a first visit. A visitor's own choice is still remembered | Eyal finds light the stronger of the two. Alternatives were dark as default, or following each visitor's device setting |
| 2026-11-17 | Prices: route 1, public and free. TradingView's widgets show the price and the chart, and our own code shows SEC figures | Keeps the site public, free and inside every provider's terms. Eyal chose it. Alternatives were a private site with a free API, or a paid plan with display rights |
| 2026-11-17 | TradingView widgets use the older script-embed format, not the newer "web component" format | The newer format was tried first and did not load on the live site: its exact code is only given out after signing in, so part of it was guessed. The older format is written out in full in TradingView's tutorial. The cost: a widget has to be rebuilt when the visitor switches theme |
| 2026-11-17 | The sample chart and the Lightweight Charts library were removed | The price chart now comes from TradingView's widget. The library can come back for our own charts of SEC figures over time (Phase 7) |
| 2026-11-17 | Quarter 4 figures are worked out as full year minus the first three quarters | Companies do not report the fourth quarter on its own. Checked against the real data: the four quarters add up exactly to the reported full year |
| 2026-11-17 | Database code: Drizzle with the standard Postgres client (node-postgres). Table changes run at the start of every build | Drizzle's queries read like SQL, and it writes the SQL for table changes into files we commit. The standard client works with both Neon and a local practice Postgres, so changes are tested before they go live. Running table changes in the build is what Neon's guide suggests, and it keeps each test copy of the database in step with its code |
| 2026-11-17 | The database is optional. Every read or write catches its own errors, and a failed table change does not stop the build | The same rule as every outside source: if it fails, fall back to the live source. Tested with no database and with the database stopped |
| 2026-11-17 | SEC request volume solved by storing filing details | Measured: 46 SEC requests per build with an empty database, 9 once it holds the filing details |
| 2026-11-17 | Database: Postgres on Neon, created through Vercel. Moved up from Phase 5 into Phase 3 | Eyal chose it over MongoDB and paid hosting. Concrete needs now: fewer SEC requests, stored friendly titles, and news history for the sub-tabs. Postgres fits structured data and the SQL from CS50 |
| 2026-11-17 | SEC limits: a speed limit of 10 requests a second, with no daily or monthly cap on its pages | The SEC's own words: "no more than 10 requests per second, regardless of the number of machines", and it may "block IP addresses that submit excessive requests". The site paces itself at about 8 a second |
| 2026-11-17 | Peer companies for industry news: AMD, Intel, Broadcom, Marvell (rivals), TSMC, Micron, ASML (supply chain) | Eyal suggested AMD, Intel, ASML, TSMC and the SMH ETF. The list keeps the companies whose news actually moves NVIDIA and leaves out the rest of SMH as noise. All file with the SEC |
| 2026-11-17 | News tab order: our own sections first (official filings, company announcements, industry), TradingView's coverage after | Eyal does not want the news dominated by TradingView. The AI briefs in Phase 5 will add the most value on top |
| 2026-11-17 | Attachment titles are read from the first 32 KB of each document, with a rule for what counts as a headline | The SEC's lists only say "EX-99.1". Tested on NVIDIA, AMD, Intel, Marvell, Micron, TSMC and ASML documents, including foreign company reports |
| 2026-11-17 | Saved the data source check as a Claude Code skill: `.claude/skills/check-data-source` | It was done twice the same way (Phase 2 and 3.2), and more sources are coming |
| 2026-11-17 | Company announcements come from the press releases attached to SEC filings and from the company's own newsroom feed, its address kept in the stock config | Both are the company's own words. The SEC copies are free to reuse, and the newsroom feed allows non-commercial use |
| 2026-11-17 | No news API for media coverage. In Phase 5 the AI finds and reads coverage itself with Claude's web search and web fetch tools | Every feed and API checked bans public display, bans AI use, or did not work. Eyal wanted AI searching anyway. Only the brief, short quotes and links are stored |
| 2026-11-17 | Industry news means a list of peer companies in the stock config, shown through their SEC filings | Free and works for any company. Eyal noted an industry can be defined in different ways, and a list he edits handles that |
| 2026-11-17 | Storage: Postgres on Neon's free plan, filled by scheduled jobs on GitHub Actions. The database moves up from Phase 9 to Phase 5 | Free, no server to run, and Eyal knows SQL from CS50. It will also hold the AI briefs and later the chatbot's search. Alternative was data files in the repo: simpler, but harder to search and outgrown by Phase 6 |
| 2026-11-17 | Keyword filtering of news dropped from Phase 3 | Our code holds no media items until Phase 5, and then the AI judges relevance |
| 2026-11-17 | News categories A to E, with topics and certainty labels, agreed | Eyal's breakdown of news, sorted by who is speaking |
| 2026-11-17 | News tab first version: official filings from the SEC, company and market news from TradingView's news widget | Both sources were already cleared in the Phase 2 research, so they went live before the rest of the research. Eyal: get something out there, then fix |
| 2026-11-17 | AI news briefs may use short direct quotes, credited and linked | Eyal's idea. Quoting keeps the AI from rewording a source wrong, which matters most for rumors and scandals. Whole articles and paywalled text are never copied |
| 2026-11-17 | Sensitive topics get stricter rules in the AI briefs | Eyal: some things matter more to get right. Leadership, legal, scandals and rumors are labeled as reported until an official source confirms them |
| 2026-11-17 | The AI may search the web for stories the regular sources miss | Eyal wants the widest coverage. Cost and reliability get designed in Phase 5 |
| 2026-11-17 | Direction check from Eyal: do not rebuild what leaders already do well (charts stay with TradingView). The site's own angle is AI tools that help people understand the data, and pulling together data that single sources lack | Keeps effort on what makes the site different. Every new feature should be judged against this |
| 2026-11-17 | SEC EDGAR is the source for filings and reported financials | It is the only source checked that is free, needs no key and explicitly allows reuse on a public site. Every route for prices uses it |
| 2026-11-16 | Hosting stays on Vercel's free plan. Eyal will pay if a limit gets in the way | Removes hosting cost as a reason to compromise the design |
| 2026-11-17 | A filing's headline is the company's own title when the filing carries a press release, with our plain-language label on an "SEC filing" line under it | Eyal's request. The company's title says what happened, and our label still says what kind of filing it is |
| 2026-11-17 | Title cleanup rules run when a title is shown, not when it is stored | Stored titles stay exactly as the company wrote them, and a better rule fixes every title at once. What rules cannot fix waits for the AI step in Phase 5 |
| 2026-11-17 | News sub-tabs are pages under `/news` with one shared layout: All news, Filings, Announcements, Industry, Coverage. "All news" shows each section short with a "More…" link, and each sub-page shows it in full | Eyal's request: open up each section without making the News page longer. The list of sub-tabs lives in the site config |
| 2026-11-17 | Each news source is fetched as one fixed-size list (40 filings, 30 industry filings, 50 announcements), and every page shows the newest few of it | New pages add no requests to the SEC or the newsroom |
| 2026-11-17 | Phase 3 closed | Eyal's verdict: the News tab is "incredibly useful". He keeps using it for a few days, and anything missing goes back on the list |
| 2026-11-17 | Top bar: the blur fixed, and its color made more solid (light 85%, dark 92%) | Eyal found text under the bar hard to read. The blur never worked in Chrome, Edge or Firefox: the CSS build kept only Safari's copy of the setting. The more solid color keeps text readable even where a browser draws blur poorly |
| 2026-11-17 | The live site is on Claude's workspace allow-list | Claude can check each deployment after a merge |
| 2026-11-17 | Content Security Policy of the fixed kind, set in `next.config.ts` | The nonce kind makes every page rebuild on each visit (Next.js guide), which would undo the caching that keeps SEC requests low. The fixed kind still limits scripts and frames to our own files and TradingView, and stops other sites from framing ours |
| 2026-11-17 | A security and error check after each heavy phase, at the Nvidia checkpoint and at the end, saved as the `security-and-error-check` skill | Eyal's rule: check security again, and that everything built still works, after major updates and above all at the end. A skill makes each check the same thorough one |
| 2026-11-17 | Monitoring: a scheduled GitHub Actions check that opens an issue when the live site fails | Free for a public repo, no new service or terms to check. An issue, because GitHub's own failure email goes to whoever last changed the schedule. A failed check is retried after five minutes, so a source busy for a moment does not raise an alarm |
| 2026-11-17 | Claude's workspace allow-list trimmed to what the project uses | Fewer sites the workspace can reach means less that can go wrong. Sites can be added again when needed |
| 2026-11-17 | Each TradingView widget shows TradingView's own credit line under it, word for word ("NVDA stock chart by TradingView", "NVDA performance by TradingView", "Top stories by TradingView") | Answers the open question on TradingView's credit. Their widget FAQ says removing or changing the attribution ("text and link under the widget") needs their agreement. The wording was read from their widget pages and builder. The NOTICE file the question mentioned belongs to their chart library, removed in Phase 2 |
| 2026-11-20 | v1 launched, on the vercel.app address | Eyal's call, after the pre-launch security and error check and the fixes from his visual review |
| 2026-11-20 | The header shows only TradingView's price panel, across the full width. Our SEC figures are on the Overview (which gains gross margin and the source line) and Metrics | Eyal's choice ("price-first"). The header is on every page, the figures repeated the Overview's, and after each earnings release they show the previous quarter for about a week. Finance sites keep the price on every page and the details on a summary page |
| 2026-11-20 | The site's mark is a rising line in a one-color square, and the gradient is gone | Eyal's choice ("plain mark"): the bright gradient square with the letters AI looked artificial |
| 2026-11-20 | The live check's real frequency, about three times a day, is accepted | GitHub runs scheduled checks when it has room. For a personal research site, finding a problem within about nine hours is enough. A paid uptime service would be the step up if that changes |
| 2026-11-17 | Analytics: Vercel Web Analytics | Eyal's choice. Free on the Hobby plan for 50,000 page views a month and never billed, anonymous, no cookies (Vercel's docs). On Vercel it runs from the site's own address, so the security policy needed no outside address |
| 2026-11-17 | v1 launches on the vercel.app address. The name and domain come before Stage 2 (Phase 9) | Eyal's choice. Free, works now, and the name can be chosen without rushing, once it has to fit more than one stock |
| 2026-11-17 | The project card on eyalturgal.com moves to a later phase (the Nvidia checkpoint) | Eyal: "later phase" |
| 2026-11-17 | Two developer-tool advisories left in place (`esbuild` via drizzle-kit, `picomatch`) | Neither reaches the live site, which ships with 0 known security holes. The only fix for `esbuild` breaks drizzle-kit, and `picomatch` has no fix yet. Dependabot will flag fixes once Eyal enables it |
| 2026-11-17 | SEC requests wait in a queue, each leaving 125 ms after the one before | Measured on a test build: the old time-slot method let two requests leave 61 ms apart when the program was busy. The queue measured 125 ms at the least and 8 a second at most |

---

## Session log

Add a short entry after each work session: what got done, what broke, what's next.

- **2026-11-15:** Defined the project, wrote PROJECT_BRIEF.md and ROADMAP.md.
- **2026-11-16:** Started Phase 0. Renamed the project to AI Stock Researcher and widened the brief (financials, filings, technicals, research papers, "not financial advice" rule). Chose Next.js + Tailwind on Vercel. Built and tested a hello world page on the branch `claude/compassionate-cerf-hngjgk`. Nothing broke. Next: Eyal merges to `main` and connects Vercel, then Phase 1 (static design).
- **2026-11-16 (second session):** Eyal merged the first pull request and deployed on Vercel, closing Phase 0 apart from recording the live URL. Built the Phase 1 first pass: design tokens and liquid glass styles in `globals.css`, reusable components, four tab pages, `src/config/stock.ts` as the single stock config, and labeled sample data. Tested every tab on desktop and phone sizes, plus the chart's range buttons, hover readout and data table. One bug found and fixed (a sample headline printed "ai" in lowercase). Next: Eyal's design feedback, then Phase 2 (real data).
- **2026-11-16 (third session):** At Eyal's request, opened and merged pull request 2, so the first pass is on `main`. Eyal's feedback: likes the glass and the dark look, finds the colors bland, wants a light and dark switch, and wants a much fuller chart later. Built the second pass on the branch: new palette, light theme, theme switch, and the chart now repaints when the theme changes. Tested both themes on desktop and phone sizes, including that the choice survives a reload. Nothing broke. Next: Eyal reviews the live site and decides on merging the second pass.
- **2026-11-16 (fourth session):** Eyal's feedback on the design: claustrophobic, very central, same color everywhere, still "AI looking". Light mode may be the better of the two. Built a third pass on the branch: full-width top bar holding the tabs, the stock name and price straight on the page with four headline stats beside them, wider page, boxes removed from stats, news and metrics, and a single glow at the top in place of blobs everywhere. Tested every tab in both themes at phone, laptop and wide-screen sizes. One issue found and fixed (the chart panel stretched taller than its content). Next: Eyal's verdict on the third pass. Design polish will continue as real content arrives in Phase 2.
- **2026-11-17:** Eyal's feedback on the third pass: light mode looks great, dark mode still feels like a technology showcase and not a stock site. Reworked the dark theme only: neutral charcoal background, colored glow removed, solid raised panels, blue price line. Light theme is pixel-for-pixel unchanged (compared screenshots before and after). Tested all tabs at three screen sizes, no errors. Also logged Eyal's ask for charts of metrics over time (Phase 7) and the question of how far back the data goes (Phase 2). Next: Eyal's verdict on dark, then merging the branch.
- **2026-11-17 (second session):** Eyal approved the reworked dark theme and asked for light as the default and for everything to be merged. Switched the default to light, tested it, then opened and merged pull request 3. The live site now has all four design passes. Next: Eyal reviews the live site and signs off on Phase 1, or asks for more changes.
- **2026-11-17 (third session):** Started Phase 2. Researched data sources by reading each provider's own terms. Finding: SEC EDGAR is free and open for filings and financials, but none of the free price APIs checked (Finnhub, Alpha Vantage, FMP, Twelve Data) allow showing prices on a public site. TradingView's embeddable widgets do. Wrote the findings and the three ways forward into the Phase 2 section. One snag: this cloud workspace blocked the providers' sites, fixed by Eyal approving an allow-list of seven sites. No code written yet. Next: Eyal picks the price route and gives SEC contact details, then the data layer gets built.
- **2026-11-17 (fourth session):** Eyal chose route 1 and gave a contact email for the SEC. Built the SEC data layer (`src/lib/sec.ts` for fetching and caching, `src/lib/financials.ts` for the math, `src/lib/stats.ts` for display) and put real figures on the header, the Overview and the Metrics tab. Checked the math against the SEC's own full-year totals. Replaced the sample chart and sample price with TradingView widgets. Two snags: (1) TradingView's widget server refuses requests from Claude's workspace, so the widgets could not be seen working here, only their fallback message. (2) Node programs in the workspace need an extra setting to reach the internet, now noted in CLAUDE.md. Tested: real figures render in both themes on desktop and phone, and the failure message shows when the SEC is unreachable. Next: Eyal adds the Vercel setting and checks the preview.
- **2026-11-17 (fifth session):** Eyal added the `SEC_USER_AGENT` setting in Vercel but was unsure about some of the choices there, saw no change on the site (the work was still on the branch), and asked for everything to be merged so it is saved and visible. Merged pull request 4. The widgets go live unverified, with their fallback text as the safety net. Next: Eyal reports what the live site shows, and anything missing gets fixed from there.
- **2026-11-17 (sixth session):** Eyal confirmed the SEC figures show on the live site, and that the TradingView widgets did not load. Cause: the widgets used TradingView's newer format with a partly guessed address. Rebuilt them in the script-embed format from TradingView's tutorial, with a price panel under the company name and the full chart. Tested in the workspace: the scripts load, the frames appear on every tab, they rebuild in the right theme when switching, and there are no page errors. The live numbers could not be seen here. Merged pull request 5. Next: Eyal confirms on the live site.
- **2026-11-17 (seventh session):** Eyal confirmed the TradingView price and chart work on the live site and restated the direction: lean on leaders for what they do well, and make AI help and gathered data the site's own angle. No code changed. Leftovers from Phase 2: check whether the price panel shows market cap and P/E, and tidy the company name appearing twice at the top. Next: Phase 3 (News), on Eyal's go.
- **2026-11-17 (eighth session):** Closed the Phase 2 leftovers. Eyal approved five more TradingView sites for Claude's workspace, so the widgets can now be seen there with live numbers. Confirmed the price panel shows market cap, P/E, dividend yield and the next earnings date. Removed our own repeated ticker and company name from the top (the title stays for screen readers and search engines), and swapped our EPS figure there for revenue growth, since the panel already shows EPS. Found and fixed a bug: in dark mode the price panel had a white background. Merged pull request 6. Then broke Phase 3 into categories and sub-steps from Eyal's description of news, and added his AI news brief idea to Phase 5. Next: Eyal confirms the categories.
- **2026-11-17 (ninth session):** Eyal approved the categories and sub-steps, and added rules for the AI briefs: short direct quotes, stricter care on sensitive topics, and AI web search. Built the first version of the News tab: the company's last 12 SEC filings with plain-language titles and links to the original documents, plus TradingView's company news and market news feeds. The Overview now shows the latest three filings. Removed all placeholder news, so no sample data is left anywhere. Tested both themes on desktop and phone. A full-page screenshot showed the news feeds blank in dark mode, but scrolling to them showed they work: a screenshot quirk, now noted in CLAUDE.md. Merged pull request 7. Next: 3.2, source research for company announcements and for news our own code can hold.
- **2026-11-17 (tenth session):** Did 3.2, the news source research, reading each provider's terms at the source where possible and testing real calls. Eyal approved 14 more sites for Claude's workspace; a later request for 2 more (theguardian.com, gdeltproject.org) did not go through, so those two terms pages are marked as not read. Findings: official sources are open (SEC filings carry the company's own press releases, and the company's newsroom feed allows non-commercial use), but no media news source allows our code to store and summarize articles for a public site. Answered Eyal's questions on databases, hosting, agents and workflows: Neon Postgres, GitHub Actions and Vercel cover it for free, with Claude's web search for media coverage in Phase 5. Cross-check on a live case: the Nov 12 filing and its attached press release confirm the CEO change but give no reason. No code changed. Next: 3.4 on Eyal's go.
- **2026-11-17 (eleventh session):** Saved the data source check as a skill. Researched peer companies (Eyal suggested AMD, Intel, ASML, TSMC and the SMH ETF) and picked seven rivals and suppliers. Built 3.4 and the industry section: the newsroom feed as "Company announcements", attached press releases listed under each filing with their real titles, and peers' newsworthy filings, including foreign companies' 6-K reports. The title rule was tuned on real documents until junk titles like "NEWS RELEASE" and an address line were gone. Added the latest announcements to the Overview and credited the newsroom in the footer. Checked both themes on desktop and phone, no errors. Eyal raised MongoDB and paid hosting: logged as a Phase 5 choice with Claude's view. Merged pull request 9. Next: Eyal's verdict on the News tab, then Phase 4.
- **2026-11-17 (twelfth session):** Eyal asked for friendly titles, news sub-tabs and the database, raised partnerships as something worth tracking, and asked about the SEC's limits. Answered the limits from the SEC's own pages. Checked a source for partnerships: NVIDIA's quarterly 13F holdings report lists 8 companies it owns shares in. Added 3.9 to 3.11 to Phase 3 and partners to Phase 7, with the database steps for Eyal. No code changed. Next: Eyal checks the site and creates the database.
- **2026-11-17 (thirteenth session):** Eyal created the Neon database in Vercel, connected it for Preview and Production, and switched its settings to Secret. Built 3.9 with Drizzle: two tables (filing details and newsroom items), a first migration written as plain SQL, table changes applied at the start of each build, and reads and writes that fall back to the live sources on any failure. Measured SEC requests per build: 46 with an empty database, 9 after. Tested a build with no database setting and one with the database stopped: both built the full site. Merged pull request 11. Next: 3.10, friendly titles.
- **2026-11-17 (fourteenth session):** Eyal confirmed the live build reports "Database tables are up to date", so the live site uses the Neon database. Built 3.10, friendly titles. When a filing carries a press release, the release's title is now the headline ("NVIDIA Announces CEO Transition"), with our plain-language label under it. New cleanup rules: titles written all in capitals become normal case (keeping short forms like AI and company names from the stock config like AMD), legal tails are cut, long financial statement titles are shortened, and a repeated date at the end is dropped. Tested the rules on every title in the database plus made-up edge cases. One bug found and fixed on the way: a date was being cut from the financial statement titles. Checked both themes. SEC requests per build stay at 9. Also removed the price route question from the open list, since it was decided earlier. Merged pull request 12. Next: 3.11, news sub-tabs.
- **2026-11-17 (fifteenth session):** Eyal shared the live address, now in Phase 0. Built 3.11, news sub-tabs: All news (a short version of every section, each with a "More…" link), Filings (40, back to May 2024), Announcements (every saved newsroom item), Industry (30) and Coverage (taller news boxes). The sub-tabs are listed in the site config and shown by a News layout, so the row stays in place between sub-pages. The main News tab stays marked on them, and on a phone the row scrolls to show the open sub-tab. Each source is now fetched as one list that every page takes the newest few from, so new pages add no requests. The build that read the extra filings got one "503" (busy) answer from the SEC, which the fallback handled. Measuring the rate behind it showed the old pacing could let two requests leave 61 ms apart when the program was busy (a peak of 9 in one second, under the limit of 10). Replaced it with a queue, remeasured at no gap under 125 ms and at most 8 a second. Builds are back to 9 SEC requests once filings are saved. Checked every page on desktop and phone in both themes. Claude's workspace cannot open the live site, so live checks stay with Eyal. Merged pull request 13. Next: Eyal's verdict on Phase 3, then Phase 4.
- **2026-11-17 (sixteenth session):** Eyal gave the Phase 3 verdict: the News tab is "incredibly useful" (he keeps using it for a few days), so Phase 3 is closed. He approved adding the live site to Claude's workspace allow-list, and Claude confirmed 3.11 is live. He shared a layout idea for later, logged in Phase 7: an app-style layout divided into regions, like Vercel, GitHub and TradingView. He also reported that text under the top bar is hard to read. Cause: the bar's blur never worked in Chrome, Edge or Firefox, because the CSS build kept only Safari's copy of the setting. Fixed it for the bar and the glass panels, and made the bar's color more solid (light 85%, dark 92%). Checked both themes at rest and with text under the bar. This workspace's test browser draws blur poorly, so the final look is for Eyal to judge in a real browser. Merged pull request 14. Next: Phase 4, starting with the security pass.
- **2026-11-17 (seventeenth session):** Started Phase 4 with the security pass, after reading the Next.js production checklist and its guides on data security and Content Security Policy. Checked for secrets in the git history and in the browser code (clean), library advisories (0 in what the site ships, 3 in developer tools: one fixed, two left with reasons), risky entry points (none: no forms, API routes or server actions), and the live headers (only HTTPS-only was sent, by Vercel). Added the server-only guard to the four files that read secrets or the database, and proved it with a test build that failed as intended. Added a Content Security Policy and four other safety headers, then loaded every page in both themes: nothing blocked, every widget loads. Outside links are now checked: only web links from the feed, only plain file names from the SEC. Along the way: the workspace had restarted and stopped the practice database, and the next build fell back to the live sources as designed. A command that ran a downloaded secret scanner without its confirmation prompt was refused by the workspace's safety check, so the scan was done with a search instead. Merged pull request 15. Next: Eyal's two-factor sign-in and GitHub settings, then the allow-list trim and monitoring.
- **2026-11-17 (eighteenth session):** Eyal asked for a security and error check after every major update, after heavy phases and at the end. Saved it as the `security-and-error-check` skill with three tested scripts (secret scan, page check across both themes and phone size, SEC rate), and added a check task to Phases 4, 5, 6, 7, 9 and 10. Built monitoring: a GitHub Actions check of the live site every three hours that opens an issue when it fails. Its script passes on the live site and fails properly on a broken address. The first run on GitHub passed. Trimmed the workspace allow-list from 29 sites to 20. Testing found two things: the secret scan's first version reported a find when every count was 0 (fixed), and a test server started without the workspace's internet setting showed the fallback messages once its pages refreshed. That proved the site falls back and heals by itself, and the skill now says how to start the server. Merged pull requests 16 and 17. Next: Eyal's two-factor sign-in and GitHub settings, then the rest of Phase 4.
- **2026-11-17 (nineteenth session):** Eyal put two-factor sign-in on hold and asked to continue. Answered the last pre-launch open question: TradingView's widget FAQ says the credit line under each widget may only be removed or changed with their agreement, and our widgets had none. Read the exact lines from their widget pages (the text version of their docs leaves out two embed codes, so they were read from the live demos in their builder) and added them under every widget. Found that lint had been failing since pull request 16 on the new skill's scripts, which had been run but not linted. Fixed. Gathered the facts for the analytics choice from Vercel's docs. Eyal then decided: Vercel Web Analytics, v1 on the vercel.app address, and the project card in a later phase. Added the analytics to the site with a footer note, after checking in Vercel's docs that it uses no cookies and runs from the site's own address. Moved the domain to Phase 9 and the card to Phase 7. Merged pull requests 18 and 19. Next: Eyal switches on analytics and does two-factor sign-in, then the security and error check before the v1 launch.
- **2026-11-20 (twentieth session):** Eyal turned on two-factor sign-in and switched on Web Analytics. Ran the pre-launch security and error check with the skill (results in Phase 4). Nothing on the site needed fixing. The skill itself needed three fixes: the secret scan matched its own pattern list once committed, the "SEC down" test reused the answers the last build had saved until they were cleared (the first try proved nothing, and the skill now says so), and the route table needs a UTF-8 search. Found that GitHub runs the three-hourly live check only about three times a day, and corrected the descriptions. Confirmed the newsroom history works: 26 announcements are kept, more than the feed's 20. Merged pull request 20. Next: Eyal confirms GitHub's security settings and makes the launch call. Before Phase 5: the AI budget, and public or private.
- **2026-11-20 (twenty-first session):** Eyal finished GitHub's security settings and sent four visual issues with screenshots. (1) The price panel cut off its last line: TradingView sets the panel's height from one measurement as it loads, which came out a few pixels short on his Windows screen at 125%. Measured its heights for each layout on the live site and gave the frame a minimum per layout. (2) A scrollbar beside the News tab: the tab row could scroll up and down by 1px, which Windows shows. Fixed. (3) The header figures: Eyal chose a price-only header. The Overview gained gross margin and the source line. (4) The logo: Eyal chose a plain one-color mark. Also found that browser tabs still showed the Next.js logo, and replaced it with the new mark. Checked at six screen sizes and in both themes, and ran the skill's page check. Merged pull request 21. Next: Eyal's launch call.
- **2026-11-20 (twenty-second session):** Eyal confirmed the live fixes and launched v1, closing Phase 4. He asked whether to start a new session for Phase 5, with this one's context 72% full. Advised yes: Phase 5 is a new layer, and CLAUDE.md, this roadmap and the two skills carry everything a new session needs. Wrote the Phase 5 starting point into "Current status". Merged pull request 22. Next: Phase 5 in a fresh session, starting with its sub-steps and Eyal's AI budget and public-or-private decisions.
