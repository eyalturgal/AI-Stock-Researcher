import { createElement } from "react";
import Script from "next/script";
import { stockConfig } from "@/config/stock";

// Shows a ready-made widget from TradingView: a price chart or a price ticker.
//
// Why a widget and not our own chart: stock prices are licensed data, and
// none of the free price sources allow showing them on a public site.
// TradingView's widgets are free to embed, so the prices come from them.
//
// A widget has two parts, both from TradingView's instructions:
// 1. a script that teaches the browser a new tag, for example
//    <tv-advanced-chart>
// 2. that tag, placed where the widget should appear
//
// The widget follows the site's light or dark theme on its own, and fills
// whatever box it is put in. So the caller sets the size with className.

type WidgetName = "advanced-chart" | "single-ticker" | "mini-chart";

export function TradingViewWidget({
  widget,
  className = "",
  loadingText,
}: {
  widget: WidgetName;
  className?: string;
  // Shown until the widget appears, and left in place if it never does
  // (for example when a browser extension blocks it).
  loadingText: string;
}) {
  const tag = `tv-${widget}`;
  // The page on tradingview.com for this stock, as a way out if the widget
  // cannot load.
  const symbolPage = `https://www.tradingview.com/symbols/${stockConfig.tradingViewSymbol.replace(":", "-")}/`;

  return (
    <div className={className}>
      <Script
        type="module"
        src={`https://www.tradingview-widget.com/w/en/${tag}.js`}
        strategy="afterInteractive"
      />
      {createElement(
        tag,
        { symbol: stockConfig.tradingViewSymbol },
        <p className="py-6 text-sm leading-6 text-ink-faint">
          {loadingText} If nothing appears, your browser may be blocking it.
          You can also{" "}
          <a
            href={symbolPage}
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink-soft underline underline-offset-2 hover:text-ink"
          >
            open it on TradingView
          </a>
          .
        </p>,
      )}
    </div>
  );
}
