---
name: check-data-source
description: Check whether an outside data source (an API, RSS feed, embeddable widget, dataset, logo service or website) may be used on the AI Stock Researcher site. Reads the provider's terms at the source, quotes them, tests a real call, and records the result in ROADMAP.md. Use this whenever a new source of prices, financials, news, filings, analyst data, logos or any other outside data is being considered, when Eyal asks "can we use X", "is X free", "is X allowed", "what about X for the news", when a source's terms may have changed, or before any code starts calling a new outside host, even if nobody mentions terms or licensing.
---

# Check a data source

This site shows outside data on a public, free, non-commercial website, and later an AI will summarize some of it. A provider's terms decide three separate things:

- whether its data may be **shown publicly**
- whether it may be **stored** (copies, caches, a database)
- whether it may be **used by AI** (summaries, analysis, training)

Free plans often say "personal use only". That rules out a public site even when no money is involved. Getting this wrong can mean a provider revokes access and part of the site goes blank, so every source is checked the same way before code uses it. This skill is how the project rule "Check data source terms allow public display, and credit sources on the site" gets applied.

## Steps

### 1. Say what we want from the source

Write one line: what data, for which part of the site, and whether it will only be shown or also stored or given to the AI. The answer decides which parts of the terms matter.

### 2. Find the provider's own terms

Look for, in this order: the terms of use or service, the API or developer terms, the pricing page (free plans often state their license there), and any attribution or display guidelines. A feed or file can carry its own terms inside it, like a copyright line in an RSS feed, so check the data itself too.

Search engines and comparison blogs are useful for finding pages and for leads. They are often out of date or wrong, so treat what they say as a lead to confirm, not an answer.

### 3. Get the pages within reach

Claude's cloud workspace can only reach websites on its allow-list. If the provider's site is not on it, ask Eyal to approve the exact hosts needed (for example `www.example.com` and `api.example.com`) and say what each one is for. Ask once for everything the check needs. If a request does not go through, carry on and mark what could not be read. Do not look for a way around it.

Some sites block automated readers. Respect that: use another official page, or mark the point as not read at the source.

### 4. Read and quote

Read the pages (with `curl`, converting HTML to text) and pull out the exact sentences on:

- **public display:** may the data appear on a public website?
- **storing and caching:** may we keep copies, and for how long?
- **AI use:** summarizing, analysis, training, "text and data mining"
- **attribution:** is a credit or link required, and in what form?
- **limits that matter:** requests per day, delays, how far back the data goes, the price of the cheapest plan that allows our use

Quote the provider's own words, in short pieces. Note the "last updated" date of the terms if one is shown.

### 5. Test a real call

If our code would call the source, make one real request and look at what comes back: does it work from here, is the data what we expected, how fresh is it, and are there rate-limit or error messages. Never write up a source as working if no real call succeeded, and never make up a sample response.

### 6. Record it

Add a row to the research table of the current phase in `ROADMAP.md`. Create the table if the phase has none, with these columns:

| Source | What it has | Show on our public site? | Store it and let the AI summarize it? | In their words |
|---|---|---|---|---|

- Answer each question with Yes, No, or a short qualified answer such as "Yes, non-commercial, credited and linked".
- Put the deciding quote in the last column.
- Mark anything not read at the source: "(via search)" or "(reported by others, not read at the source)".
- Link the provider's pages in a Sources line under the table.

If the check settles a decision, add it to the decision log. If it raises a question nobody can answer yet, add it to the open questions.

### 7. Tell Eyal

Give a short, plain verdict: can we use it, for what, and on what conditions (credit, link, limits). If it is ruled out, name the sentence that rules it out. If the terms are unclear, say so instead of guessing, and suggest asking the provider in writing.

If the source does get used, credit it on the site (the footer, and next to the data where it appears).

## Things to watch for

- "Personal", "non-commercial", "internal use" and "development only" usually mean no public site, even a free one.
- Display rights and AI rights are separate. A source can allow one and not the other.
- A paid plan does not always add display rights. Check what the named plan actually includes.
- Embeddable widgets (like TradingView's) are a different case: usually allowed on any site with their branding kept, but our code cannot read the data inside them.
- Official government sources such as the SEC are usually free to reuse. Quote the policy anyway.
- Never copy a provider's whole terms into the repo. Short quotes and a link are enough.

## Example row

| Google News feed | Headlines from many outlets | No | No | "made available solely for the purpose of rendering Google News results within a personal feed reader for personal, non-commercial use. Any other use of the feed is expressly prohibited." |
