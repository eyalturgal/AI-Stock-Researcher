// The bottom of every page: the "not advice" note and credits for the
// tools and data the site uses. Each new data source gets credited here.
export function SiteFooter() {
  return (
    <footer className="shell pb-10">
      <div className="border-t border-line pt-6 text-sm leading-6 text-ink-faint">
        <p>
          This site is a research and learning tool. Nothing on it is financial
          advice. Prices can be delayed, and reported figures can lag the
          newest filing by up to an hour.
        </p>
        <p className="mt-1">
          Prices, charts and news coverage are provided by{" "}
          <a
            href="https://www.tradingview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            TradingView
          </a>
          . Company financials and filings come from the{" "}
          <a
            href="https://www.sec.gov/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            U.S. Securities and Exchange Commission
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
