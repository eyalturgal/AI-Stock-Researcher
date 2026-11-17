# AI Stock Researcher

An all-in-one site for researching a stock: charts, fundamentals, filings, news and AI research in one place. It starts with a single stock and grows from there.

Free, no ads, non-commercial. Nothing on the site is financial advice.

- The vision: [PROJECT_BRIEF.md](PROJECT_BRIEF.md)
- Where the project stands: [ROADMAP.md](ROADMAP.md)

## Run it on your own computer

You need [Node.js](https://nodejs.org) version 20.9 or newer.

```bash
npm install
```

```bash
npm run dev
```

Then open http://localhost:3000 in a browser.

### One setting is needed for the company figures

The financial figures come from the SEC, which asks every automated tool to say who it is. Create a file named `.env.local` in the project folder with one line, using your own contact email:

```
SEC_USER_AGENT="AI Stock Researcher you@example.com"
```

This file stays on your computer. Git ignores it, so it never ends up in the public code. On Vercel, add the same name and value under Settings, Environment Variables.

Without it the site still runs, and shows a message where the figures would be.

## Where the data comes from

- Prices and charts: [TradingView](https://www.tradingview.com/) widgets
- Company financials: filings published by the [U.S. Securities and Exchange Commission](https://www.sec.gov/)

## Built with

- [Next.js](https://nextjs.org) and [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [TradingView widgets](https://www.tradingview.com/widget/)
