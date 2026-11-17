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

### The database (optional)

The site keeps some data in a Postgres database (hosted by [Neon](https://neon.com/)), so it does not have to read the same SEC documents again on every refresh. It works without one. To use a database on your own computer, add its address to `.env.local`:

```
DATABASE_URL="postgresql://user:password@localhost:5432/stockdb"
```

`npm run build` creates or updates the tables first. After changing a table in `src/db/schema.ts`, run this to write the SQL for the change into the `drizzle` folder, and commit it:

```bash
npm run db:generate
```

## Where the data comes from

- Prices, charts and news coverage: [TradingView](https://www.tradingview.com/) widgets
- Company financials and filings, including those of peer companies: the [U.S. Securities and Exchange Commission](https://www.sec.gov/)
- Company announcements: the company's own newsroom feed, used for non-commercial purposes

## Built with

- [Next.js](https://nextjs.org) and [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team) and [Postgres](https://www.postgresql.org), hosted on [Neon](https://neon.com)
- [TradingView widgets](https://www.tradingview.com/widget/)
