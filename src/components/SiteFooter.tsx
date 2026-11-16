// The bottom of every page: the "not advice" note and credits for the
// tools and data the site uses. Each new data source gets credited here.
export function SiteFooter() {
  return (
    <footer className="border-t border-line pt-6 text-xs leading-6 text-ink-faint">
      <p>
        This site is a research and learning tool. Nothing on it is financial
        advice. All figures shown right now are sample data.
      </p>
      <p className="mt-1">
        Charts use TradingView Lightweight Charts™, copyright TradingView, Inc.{" "}
        <a
          href="https://www.tradingview.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          tradingview.com
        </a>
      </p>
    </footer>
  );
}
