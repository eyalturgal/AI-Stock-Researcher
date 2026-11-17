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
  // The company's ID number at the SEC ("CIK"), always written as 10 digits.
  // Look one up at https://www.sec.gov/search-filings/cik-lookup
  cik: "0001045810",
  // How TradingView names this stock: the exchange, a colon, the ticker.
  tradingViewSymbol: "NASDAQ:NVDA",
  // The company's own news feed (RSS) and newsroom page. Set feedUrl to ""
  // if the company has none, and the section is left out.
  newsroom: {
    feedUrl: "https://nvidianews.nvidia.com/releases.xml",
    pageUrl: "https://nvidianews.nvidia.com/",
  },
  // Companies whose news matters for this stock: rivals and the supply
  // chain. The News tab shows their filings with the SEC. cik is each
  // company's SEC number, written as 10 digits.
  peers: [
    { name: "AMD", ticker: "AMD", cik: "0000002488", relationship: "Competitor" },
    { name: "Intel", ticker: "INTC", cik: "0000050863", relationship: "Competitor" },
    { name: "Broadcom", ticker: "AVGO", cik: "0001730168", relationship: "Competitor" },
    { name: "Marvell", ticker: "MRVL", cik: "0001835632", relationship: "Competitor" },
    { name: "TSMC", ticker: "TSM", cik: "0001046179", relationship: "Chip maker" },
    { name: "Micron", ticker: "MU", cik: "0000723125", relationship: "Memory supplier" },
    { name: "ASML", ticker: "ASML", cik: "0000937966", relationship: "Equipment supplier" },
  ],
  // The stock's field. Used for the industry news section.
  industry: "Semiconductors and AI",
  about:
    "Designs graphics processors and the chips, systems and software used to train and run AI models in data centers.",
  // Words used to find and filter news about this stock.
  keywords: ["Nvidia", "NVDA", "GPU", "AI chips", "Data center", "CUDA"],
} as const;
