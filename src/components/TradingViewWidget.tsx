"use client";
// Runs in the browser: it adds TradingView's script to the page after the
// page has loaded, and reacts when the visitor switches theme.

import { useEffect, useRef, useState } from "react";
import { stockConfig } from "@/config/stock";

// Shows a ready-made widget from TradingView: the price chart, a panel with
// the current price and key figures, or a news feed.
//
// Why a widget and not our own chart: stock prices are licensed data, and
// none of the free price sources allow showing them on a public site.
// TradingView's widgets are free to embed, so the prices come from them.
//
// How a widget gets onto the page (this follows TradingView's own tutorial):
// 1. We add a <script> tag that points at TradingView's widget code.
// 2. The settings for the widget go inside that tag, written as JSON.
// 3. TradingView's code reads the settings and draws the widget in a frame.
//
// The settings below are the ones from TradingView's tutorial, with our
// stock and our theme filled in.
//
// Under each widget goes the credit line from TradingView's own embed code,
// word for word. Their FAQ says that removing or changing it ("text and link
// under the widget") needs their agreement.

type WidgetName = "advanced-chart" | "symbol-info" | "stock-news" | "market-news";
type Theme = "light" | "dark";

// Which of TradingView's script files draws each widget. Both news feeds
// use the same one, called "timeline", with different settings.
const SCRIPT_FILE: Record<WidgetName, string> = {
  "advanced-chart": "advanced-chart",
  "symbol-info": "symbol-info",
  "stock-news": "timeline",
  "market-news": "timeline",
};

function widgetSettings(widget: WidgetName, theme: Theme) {
  const symbol = stockConfig.tradingViewSymbol;

  if (widget === "advanced-chart") {
    return {
      autosize: true, // fill the box it is placed in
      symbol,
      interval: "D", // one bar per day to start with
      timezone: "Etc/UTC",
      theme,
      style: "1", // candlesticks. The visitor can change it in the chart
      locale: "en",
      allow_symbol_change: false, // this site is about one stock
      calendar: false,
      support_host: "https://www.tradingview.com",
    };
  }

  if (widget === "stock-news" || widget === "market-news") {
    return {
      // "symbol" shows stories about our stock. "market" shows the top
      // stories for the stock market as a whole.
      ...(widget === "stock-news"
        ? { feedMode: "symbol", symbol }
        : { feedMode: "market", market: "stock" }),
      colorTheme: theme,
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      locale: "en",
    };
  }

  // symbol-info: the price, the day's change and key figures
  return {
    symbol,
    width: "100%",
    locale: "en",
    colorTheme: theme,
    isTransparent: true, // let the page's own background show through
  };
}

// The credit line for each widget, as TradingView's widget pages show it
// (read on 2026-11-17). Only the stock is ours. Both news feeds get the
// same line: TradingView's page shows it for every feed setting.
function credit(widget: WidgetName): { text: string; url: string } {
  const [exchange, ticker] = stockConfig.tradingViewSymbol.split(":");
  const symbolPage = `https://www.tradingview.com/symbols/${exchange}-${ticker}/`;
  const tracking = "?utm_source=www.tradingview.com&utm_medium=widget_new&utm_campaign=";
  if (widget === "advanced-chart") {
    return { text: `${ticker} stock chart`, url: `${symbolPage}${tracking}advanced-chart` };
  }
  if (widget === "symbol-info") {
    return { text: `${ticker} performance`, url: `${symbolPage}${tracking}symbol-info` };
  }
  return {
    text: "Top stories",
    url: `https://www.tradingview.com/news/top-providers/tradingview/${tracking}timeline`,
  };
}

function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";
}

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
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Put the widget on the page, using the theme that is active right now.
    const build = () => {
      container.innerHTML = "";

      const frame = document.createElement("div");
      frame.className = "tradingview-widget-container__widget";
      frame.style.width = "100%";
      frame.style.height = "100%";
      container.appendChild(frame);

      const script = document.createElement("script");
      script.type = "text/javascript";
      script.async = true;
      script.src = `https://s3.tradingview.com/external-embedding/embed-widget-${SCRIPT_FILE[widget]}.js`;
      script.innerHTML = JSON.stringify(widgetSettings(widget, currentTheme()));
      container.appendChild(script);
    };

    // Hide the loading text once TradingView has added its frame.
    const frameWatcher = new MutationObserver(() => {
      if (container.querySelector("iframe")) setLoaded(true);
    });
    frameWatcher.observe(container, { childList: true, subtree: true });

    // These widgets cannot change theme on the fly, so when the visitor
    // switches theme, build the widget again in the new one.
    const themeWatcher = new MutationObserver(() => {
      setLoaded(false);
      build();
    });
    themeWatcher.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    build();

    return () => {
      frameWatcher.disconnect();
      themeWatcher.disconnect();
      container.innerHTML = "";
    };
  }, [widget]);

  // The page on tradingview.com for this stock, as a way out if the widget
  // cannot load.
  const symbolPage = `https://www.tradingview.com/symbols/${stockConfig.tradingViewSymbol.replace(":", "-")}/`;

  const { text, url } = credit(widget);

  // The widget fills the box, apart from one line at the bottom for the
  // credit, the same way TradingView's own embed code lays it out.
  return (
    <div className={`flex flex-col ${className}`}>
      {loaded ? null : (
        <p className="py-2 text-sm leading-6 text-ink-faint">
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
        </p>
      )}
      <div ref={containerRef} className="tradingview-widget-container min-h-0 w-full flex-1" />
      <div className="tradingview-widget-copyright pt-2 text-xs leading-5 text-ink-faint">
        <a
          href={url}
          rel="noopener nofollow"
          target="_blank"
          className="text-ink-soft underline underline-offset-2 hover:text-ink"
        >
          <span className="blue-text">{text}</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
}
