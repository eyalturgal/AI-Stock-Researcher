// PLACEHOLDER NEWS. None of this is real.
//
// Prices and financial figures on the site are now real. News is the one
// part still waiting for a data source (Phase 3), so these stand-in items
// keep the layout in place until then. They are worded as obvious
// placeholders so nothing here can be mistaken for a real headline, and the
// pages that show them say so.

import { stockConfig } from "@/config/stock";

export type NewsCategory = "Company" | "Industry" | "Market";

export type NewsItem = {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  source: string;
  age: string;
};

export const sampleNews: NewsItem[] = [
  {
    id: "company-1",
    category: "Company",
    title: `Placeholder headline about ${stockConfig.shortName}'s latest quarterly results`,
    summary:
      "A short summary of the story will sit here: what happened, and why it matters for the stock.",
    source: "Sample source",
    age: "2h ago",
  },
  {
    id: "industry-1",
    category: "Industry",
    title: `Placeholder headline about the ${stockConfig.industry} industry`,
    summary:
      "Industry stories give context: competitors, supply, demand and regulation in the stock's field.",
    source: "Sample source",
    age: "4h ago",
  },
  {
    id: "market-1",
    category: "Market",
    title: "Placeholder headline about today's top market story",
    summary:
      "The biggest market news of the day, even when it is not about this company.",
    source: "Sample source",
    age: "5h ago",
  },
  {
    id: "company-2",
    category: "Company",
    title: `Placeholder headline about a new ${stockConfig.shortName} product`,
    summary:
      "Product launches, partnerships and leadership changes will show up as company news.",
    source: "Sample source",
    age: "Yesterday",
  },
  {
    id: "industry-2",
    category: "Industry",
    title: "Placeholder headline about a competitor's announcement",
    summary:
      "What rivals do often moves the stock too, so those stories belong here.",
    source: "Sample source",
    age: "Yesterday",
  },
  {
    id: "market-2",
    category: "Market",
    title: "Placeholder headline about interest rates and the wider economy",
    summary:
      "Economy-wide news that tends to move every large stock at once.",
    source: "Sample source",
    age: "2 days ago",
  },
];
