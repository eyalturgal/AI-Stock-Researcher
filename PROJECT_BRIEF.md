# Project Brief: AI Stock Researcher (working name)

## Who I am
Eyal Turgal. I'm building side projects to show on my personal site (eyalturgal.com, domain not bought yet). This tracker is my first one after finishing the personal site.

## The idea
A standalone website for researching a stock in depth, with its own interface and identity. It is NOT part of my personal site. My personal site will just link to it with a project card.

The goal in one line: **everything someone would want in order to understand a stock, in one place.** Charts and technicals, fundamentals and financial statements, earnings, public filings, analyst coverage, news about the company and its industry, plus an AI research layer that helps make sense of all of it.

- **Version 1:** Nvidia (NVDA). It's turbulent right now, widely tracked and very influential.
- **First major checkpoint:** a fully complete Nvidia tracker (Stage 1, see the roadmap below).
- **After that:** a small group of stocks (Magnificent Seven or the top of the S&P 500), then a broader "AI stocks" site.
- **Maybe later:** automatically track whichever company is the most valuable in the S&P 500 by market cap.
- **Name:** "AI Stock Researcher" is the working name (repo: `AI-Stock-Researcher`). Final name and domain are still undecided.

## Core rule for the code
Never hard-code "Nvidia" or "NVDA" anywhere. The ticker (and company name, logo, related keywords) must come from ONE config setting, so switching to "whoever is number one" later is a small change, not a rebuild.

## Inspiration
TradingView, but with my own take: take the different things TradingView has and turn each into its own focused, better designed section.

## Design direction
- Modern, trendy "liquid glass" style (glassy, translucent buttons and panels)
- The first screen has to look really good, even when it's static
- Start with a static design, then add dynamic features one at a time

## Full vision (not all for v1)
1. **Live chart:** live updating, interactive, with the usual timeframe and chart type options plus drawing/analysis tools like TradingView. Should feel smoother and work better than typical stock charts.
2. **Technicals:** indicators (moving averages, RSI, MACD, volume and so on) on the chart and summarized in their own section.
3. **Metrics tab:** a whole screen dedicated to key metrics.
4. **Fundamentals and financials:** income statement, balance sheet and cash flow over time, with the key ratios.
5. **Earnings:** earnings history, upcoming dates and surprises.
6. **Filings and public documents:** the company's SEC filings (10-K, 10-Q, 8-K and others), linked and organized.
7. **Analyst tab:** analyst ratings, price targets and consensus from the major firms. Note: the full written reports are the firms' paid, copyrighted product, so the site shows ratings, targets and consensus and links out. It does not republish reports.
8. **News:**
   - Top market news of the day
   - News relevant to the stock
   - News about the stock's industry (for NVDA: AI and semiconductors)
   - Eventually: auto-updating "relevant buzzwords" per company, used to filter news
9. **Top company detection (later, optional):** check market caps and switch the tracked company when the crown changes hands.
10. **Integrated AI chatbot:** ask questions about the stock and get answers grounded in the site's own data (prices, metrics, news, earnings, filings, research), not generic model knowledge. Needs rate limiting and a spending cap since the site is free and public.

## Version 1 scope (build this first)
Keep it small and ship it:
- One page for NVDA
- Polished static layout in the liquid glass style
- Live price chart
- Basic metrics section
- News feed for the stock

Everything else (technicals, financials, filings, analyst tab, industry news, buzzwords, AI research, chatbot) comes after v1 is live. v1 is the first public launch. The fully complete Nvidia tracker (Stage 1) is the bigger checkpoint after it.

## Technical notes / options to evaluate
- **Charting:** TradingView's free open source library "Lightweight Charts", or TradingView's embeddable widgets (Advanced Chart widget gives built-in tools fast but less design control).
- **Market data APIs (check current free tier limits):** Finnhub, Financial Modeling Prep, Alpha Vantage, Polygon/Massive. Need: real-time or near real-time price, market cap, fundamentals, analyst data, earnings, company news.
- **API keys must stay server-side**, not exposed in front-end code.
- Hosting: separate from my personal site, with its own domain eventually.

## Non-commercial by design
- Free for everyone, no ads, no paywall, no plans to sell it
- Goal is learning and having a strong project to my name, not revenue
- Self-hosted on my own setup; I'll pay for hosting/domain where needed
- Use free data sources and open source tools wherever possible
- The edge over existing sites: a modern, advanced interface (most finance sites look dated and are full of ads) plus an AI research layer
- Keep the code public on GitHub (good for the portfolio, and keeps open source licenses like AGPL simple)
- Still read each free API's terms: some free tiers are "personal use only" and may not allow showing data on a public site, even a free one. Pick sources that allow it, and credit them on the site.
- Non-commercial does not mean anything goes. Open source code is free to use within its license. Data is different: a free, public, no-ads site still has to follow each data source's display rules. Public-domain sources (like SEC EDGAR for filings and reported financials) are the safest foundation.

## AI research layer (the core value)
The research for these big stocks is done for the user, using far more data than they'd gather themselves:
- Bull case and bear case rundowns
- Earnings summaries
- Short research papers that summarize one part of the picture (a filing, an earnings call, a product cycle)
- Daily news digests: what happened and why it matters
- Balanced view: both sides of the picture, not hype
Built as saved, reusable skills/agents that run on a schedule and can be pointed at any ticker.

This is a research aid, not licensed financial advice. Every AI-written piece says so, shows its sources, and never tells anyone to buy or sell.

## Open source to evaluate
- **OpenBB** (Open Data Platform): Python/API layer that unifies 50+ data providers. Could serve as the data backend. AGPL licensed.
- **Fincept Terminal:** open source desktop "Bloomberg alternative" with AI agents. Mostly useful as inspiration for features. AGPL licensed.
- **TradingView Lightweight Charts:** free open source charting library.

## Roadmap (think big, build in stages)
Each stage should be genuinely complete and polished before moving to the next.
1. **Stage 1:** one stock (NVDA), done to the full vision above. This is the first major checkpoint.
2. **Stage 2:** a small group of stocks (Magnificent Seven, or the top of the S&P 500 by then), with comparisons across companies.
3. **Stage 3:** broader "AI stocks" site.

Later stages will need a database (stored price history, cached API data, cross-stock comparisons). Even Stage 1 should cache API responses to stay within free-tier limits, so design the data layer with expansion in mind.

## Production goals
This is a fully public, real hosted site, not a demo.
- Proper security: API keys and secrets server-side only, environment variables, rate limiting, input validation, HTTPS, dependency updates
- Reliable hosting and deployment (CI/CD from GitHub)
- Error handling and graceful fallbacks when an API is down or rate limited
- Use existing open source tools, libraries and templates wherever possible. No reinventing the wheel.

## What this project is really for
This is a test of my **AI engineering** abilities, not my hand-coding abilities. I want to learn to build:
- **Reusable workflows:** anything I have Claude do once (e.g. setting up a new stock page, its data pipeline, its news filters) should be saved so it can be repeated for the next stock without redoing the work. Options to explore: Claude Code skills, custom slash commands, subagents, and a CLAUDE.md with project conventions.
- **Automated infrastructure:** scheduled jobs that keep data fresh on their own (e.g. GitHub Actions cron, serverless scheduled functions), plus background tasks like refreshing news and buzzwords.
- **Agents:** processes that run and update the site without me, for example detecting a change in the top company by market cap, or regenerating each company's relevant keywords.

Goal: build it properly for the first stock, capture the process as reusable workflows/agents, then use those to scale to Stage 2 and 3.

## How I want to work on this
- Start simple, get something that looks good on screen, then iterate
- Explain decisions briefly so I learn as we go
- Push back if I'm overscoping
