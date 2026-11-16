"use client";
// "use client" means this component runs in the visitor's browser, not only
// on the server. The chart needs that because it draws on a canvas and
// reacts to the mouse.

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AreaSeries,
  ColorType,
  createChart,
  type IChartApi,
  type ISeriesApi,
} from "lightweight-charts";
import type { PricePoint } from "@/data/sample";
import { formatDate, formatPercent, formatPrice } from "@/lib/format";

// The time range buttons. "days" counts trading days, not calendar days.
const RANGES = [
  { label: "1M", name: "1 month", days: 21 },
  { label: "3M", name: "3 months", days: 63 },
  { label: "6M", name: "6 months", days: 126 },
  { label: "1Y", name: "1 year", days: 252 },
];

export function PriceChart({
  data,
  currency,
  heightClass = "h-64 sm:h-80",
  detailed = false,
}: {
  data: PricePoint[];
  currency: string;
  heightClass?: string;
  // The Chart tab passes detailed, which adds range stats and a data table.
  detailed?: boolean;
}) {
  // "State" is a value the component remembers. Changing it redraws the component.
  const [rangeDays, setRangeDays] = useState(126);
  const [hovered, setHovered] = useState<PricePoint | null>(null);

  // "Refs" hold things that live outside React: the page element the chart
  // draws into, and the chart objects themselves.
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Area"> | null>(null);

  // Only the days inside the chosen range.
  const visible = useMemo(() => data.slice(-rangeDays), [data, rangeDays]);
  const range = RANGES.find((option) => option.days === rangeDays) ?? RANGES[0];

  const first = visible[0];
  const last = visible[visible.length - 1];
  const values = visible.map((point) => point.value);
  const high = Math.max(...values);
  const low = Math.min(...values);
  const rangeChangePercent = ((last.value - first.value) / first.value) * 100;

  // Create the chart once, when the component first appears on the page.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Colors come from the design tokens in globals.css, so the chart
    // always matches the rest of the site.
    const styles = getComputedStyle(container);
    const token = (name: string) => styles.getPropertyValue(name).trim();

    const chart = createChart(container, {
      autoSize: true, // follow the size of the container, on every screen
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: token("--color-ink-faint"),
        fontFamily: styles.fontFamily,
        // The library's license asks for a visible TradingView credit.
        attributionLogo: true,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: token("--color-chart-grid") },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      // Dragging and zooming are off for now so the page scrolls normally
      // on a phone. They come back with the real chart tools.
      handleScroll: false,
      handleScale: false,
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: token("--color-chart-line"),
      topColor: token("--color-chart-fill-top"),
      bottomColor: token("--color-chart-fill-bottom"),
      lineWidth: 2,
      priceLineVisible: false,
    });

    // When the mouse moves over the chart, remember the point under it so
    // the readout above the chart can show that day's price.
    chart.subscribeCrosshairMove((param) => {
      const point = param.seriesData.get(series);
      if (point && "value" in point && typeof point.time === "string") {
        setHovered({ time: point.time, value: point.value });
      } else {
        setHovered(null);
      }
    });

    chartRef.current = chart;
    seriesRef.current = series;

    // Clean up when the component leaves the page.
    return () => {
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
    };
  }, []);

  // Whenever the range changes, hand the chart its new data.
  useEffect(() => {
    seriesRef.current?.setData(visible);
    chartRef.current?.timeScale().fitContent();
  }, [visible]);

  const shown = hovered ?? last;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        {/* Readout: the hovered day, or the latest day when nothing is hovered. */}
        <p className="text-sm text-ink-soft">
          <span className="font-medium text-ink">
            {formatPrice(shown.value, currency)}
          </span>
          <span className="mx-2 text-ink-faint" aria-hidden="true">
            ·
          </span>
          {formatDate(shown.time)}
        </p>

        <div role="group" aria-label="Time range" className="flex gap-1">
          {RANGES.map((option) => (
            <button
              key={option.label}
              type="button"
              aria-pressed={option.days === rangeDays}
              aria-label={option.name}
              onClick={() => setRangeDays(option.days)}
              className="glass-button px-3 py-1.5"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={containerRef}
        role="img"
        aria-label={`Price chart for the last ${range.name}. From ${formatPrice(first.value, currency)} on ${formatDate(first.time)} to ${formatPrice(last.value, currency)} on ${formatDate(last.time)}.`}
        className={`w-full ${heightClass}`}
      />

      {detailed ? (
        <>
          <dl className="mt-5 grid grid-cols-3 gap-3 border-t border-line pt-4">
            <div>
              <dt className="text-xs text-ink-faint">High ({range.label})</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {formatPrice(high, currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Low ({range.label})</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {formatPrice(low, currency)}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-ink-faint">Change ({range.label})</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">
                {formatPercent(rangeChangePercent)}
              </dd>
            </div>
          </dl>

          {/* The same data as a table, for screen readers and for anyone
              who prefers exact numbers. */}
          <details className="mt-4 text-sm">
            <summary className="cursor-pointer text-ink-soft hover:text-ink">
              Show this data as a table
            </summary>
            <div className="mt-3 max-h-72 overflow-y-auto rounded-xl border border-line">
              <table className="w-full text-left tabular-nums">
                <thead className="sticky top-0 bg-canvas text-xs text-ink-faint">
                  <tr>
                    <th scope="col" className="px-4 py-2 font-medium">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-2 text-right font-medium">
                      Close
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {[...visible].reverse().map((point) => (
                    <tr key={point.time}>
                      <td className="px-4 py-2 text-ink-soft">
                        {formatDate(point.time)}
                      </td>
                      <td className="px-4 py-2 text-right text-ink">
                        {formatPrice(point.value, currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        </>
      ) : null}
    </div>
  );
}
