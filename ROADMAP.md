# Roadmap and Progress

This file is the source of truth for where the project stands. Update it at the end of every work session.

---

## Current status

- **Current phase:** Phase 0 (Setup and foundations)
- **Next action:** Create the GitHub repo and put CLAUDE.md, PROJECT_BRIEF.md and ROADMAP.md in it
- **Blocked on:** nothing yet
- **Last updated:** 2026-11-15

### Done so far
- [x] Personal site (eyalturgal.com) basically finished
- [x] Project idea defined and written up in PROJECT_BRIEF.md
- [x] Roadmap created

---

## Phases

Each phase ends with something working and visible. Don't start the next phase until the current one's "done when" is true.

### Phase 0: Setup and foundations
- [ ] Create a GitHub repo for the project
- [ ] Add CLAUDE.md, PROJECT_BRIEF.md, ROADMAP.md to the repo
- [ ] Learn the git basics needed: commit, push, branch, pull request
- [ ] Decide the tech stack (have Claude propose options and explain the tradeoffs)
- [ ] Decide hosting
- [ ] Create a "hello world" version and deploy it to a public URL

**Done when:** a blank page is live on the internet and deploys automatically when I push to GitHub.

### Phase 1: Static design (NVDA)
- [ ] Define the design system: colors, fonts, spacing, liquid glass components (buttons, cards, tabs)
- [ ] Build the main page layout with placeholder data
- [ ] Tabs scaffolded: Overview, Chart, Metrics, News (others added later)
- [ ] Works well on phone and desktop
- [ ] Ticker, company name and keywords come from ONE config file

**Done when:** the site looks finished and polished, even though the data is fake.

### Phase 2: Real data
- [ ] Choose a market data source and confirm its terms allow display on a public site
- [ ] Build a backend/API layer so API keys never reach the browser
- [ ] Add caching so the site stays within free-tier limits
- [ ] Live price chart with TradingView Lightweight Charts (timeframes, chart types)
- [ ] Metrics tab with real data
- [ ] Loading states and error states (what users see when an API fails)

**Done when:** the NVDA page shows real, updating data and nothing breaks when an API is slow or down.

### Phase 3: News
- [ ] Stock-specific news feed
- [ ] Top market news of the day
- [ ] AI industry news
- [ ] Basic keyword filtering driven by the config file
- [ ] Credit every source on the site

**Done when:** the news tab is useful enough that I'd actually check it.

### Phase 4: Production hardening and v1 launch
- [ ] Security pass: secrets in environment variables, rate limiting, input validation, HTTPS, dependency scanning
- [ ] Basic monitoring/error alerts
- [ ] Privacy-friendly analytics (optional)
- [ ] Buy and connect the project's domain (name still undecided)
- [ ] Add a project card on eyalturgal.com linking to it

**Done when:** v1 is publicly launched and I'd be comfortable sending the link to anyone.

### Phase 5: Automation and AI research layer
- [ ] Scheduled jobs that refresh data and news on their own
- [ ] AI daily digest: what happened and why it matters
- [ ] AI bull case and bear case rundowns
- [ ] AI earnings summaries
- [ ] Save each of these as reusable skills/agents/workflows that take a ticker as input

**Done when:** the site updates its research every day without me touching it.

### Phase 6: AI chatbot
- [ ] Chatbot answers questions using the site's own data (prices, metrics, news, research)
- [ ] Rate limiting per user and a hard monthly spending cap
- [ ] Clear note that it's not financial advice

**Done when:** a visitor can ask "why did NVDA drop this week?" and get a grounded, sourced answer.

### Phase 7: Deeper features
- [ ] Analyst tab: ratings, price targets, consensus
- [ ] Earnings tab: history, upcoming dates, surprises
- [ ] More chart tools (drawing, indicators)
- [ ] Auto-updating "buzzwords" per company for news filtering

**Done when:** Stage 1 matches the full vision in PROJECT_BRIEF.md.

### Phase 8: Make it repeatable
- [ ] Adding a new ticker is one workflow, not a rebuild
- [ ] Test it by spinning up a second stock page with the saved workflows
- [ ] Optional: auto-detect the most valuable S&P 500 company and switch to it

**Done when:** a new stock page can be created mostly by running saved workflows.

### Phase 9: Stage 2, Magnificent Seven
- [ ] Add a database (price history, cached data, research archive)
- [ ] Pages for all seven companies
- [ ] Comparison views across companies

### Phase 10: Stage 3, AI stock tracker
- [ ] Expand to a broader set of AI stocks
- [ ] Sector-level research and news

---

## Open questions and rabbit holes

Things I don't know how to do yet. Dive into each one when its phase comes up, and move the answer to the decision log.

- [ ] Which tech stack fits best for a beginner who wants a real production site?
- [ ] Where to host, and what it costs
- [ ] Which free data API allows showing data on a public site
- [ ] How "live" updates should work (polling vs websockets) within free limits
- [ ] Is OpenBB worth using as the data layer, or simpler to call APIs directly?
- [ ] Which AI model/provider for research and the chatbot, and how to cap costs
- [ ] How scheduled jobs/agents run in production (GitHub Actions, serverless cron, etc.)
- [ ] How to package workflows as Claude Code skills, commands or subagents
- [ ] Project name and domain

---

## Decision log

| Date | Decision | Why |
|------|----------|-----|
| 2026-11-15 | Standalone site, linked from eyalturgal.com | Keep the personal site clean |
| 2026-11-15 | Start with NVDA, ticker kept in one config | Turbulent and widely tracked; easy to switch later |
| 2026-11-15 | Free, no ads, non-commercial, code public | Goal is learning and portfolio, not revenue |

---

## Session log

Add a short entry after each work session: what got done, what broke, what's next.

- **2026-11-15:** Defined the project, wrote PROJECT_BRIEF.md and ROADMAP.md.
