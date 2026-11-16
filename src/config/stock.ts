// THE one place that says which stock this site tracks.
//
// Project rule: no page or component may type a ticker or company name
// directly. They all import from this file, so switching to another stock
// later means editing this file and nothing else.

export const stockConfig = {
  ticker: "NVDA",
  name: "NVIDIA Corporation",
  shortName: "Nvidia",
  exchange: "NASDAQ",
  currency: "USD",
  // The stock's field. Used for the industry news section.
  industry: "Semiconductors and AI",
  about:
    "Designs graphics processors and the chips, systems and software used to train and run AI models in data centers.",
  // Words used to find and filter news about this stock.
  keywords: ["Nvidia", "NVDA", "GPU", "AI chips", "Data center", "CUDA"],
} as const;
