import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useApi } from "@/lib/api";
import { OfferKind } from "@/types";
import { formatDate, formatPrice } from "@/utils/helpers";

type Point = { effectiveMonthlyPrice: number; recordedAt: string };

// Single series, so no legend: the heading names it. Colors: the line uses the
// accent blue (validated against the white card surface); text uses gray ink.
const LINE = "#0077b6";
const GRID = "#e5e7eb";
const HEIGHT = 180;
const MARGIN = { top: 14, right: 76, bottom: 26, left: 52 };

// 3–5 round tick values (whole euros, or steps of 2, 5, 10...) covering the range
function niceTicks(min: number, max: number) {
  const span = Math.max(max - min, 1);
  const step = [1, 2, 5, 10, 20, 50].find((s) => span / s <= 4) ?? 100;
  const start = Math.floor(min / step) * step;
  const end = Math.ceil(max / step) * step;
  const ticks = [];
  for (let value = start; value <= end + 1e-9; value += step) ticks.push(value);
  return ticks;
}

export default function PriceHistoryChart({ kind, offerId }: { kind: OfferKind; offerId: string }) {
  const { t } = useTranslation();
  const { data } = useApi<{ history: Point[] }>(`/api/price-history/${kind}/${offerId}`);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [active, setActive] = useState<number | null>(null);

  const points = useMemo(
    () => (data?.history ?? []).map((p) => ({ price: p.effectiveMonthlyPrice, time: new Date(p.recordedAt).getTime(), date: p.recordedAt })),
    [data]
  );

  // The container only exists once data has loaded, so measure again then
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setWidth(Math.max(280, entry.contentRect.width)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [points.length]);

  if (!data) return <p className="text-sm text-gray-500">{t("common.loading")}</p>;
  if (points.length === 0) return null;

  const current = points[points.length - 1];
  const table = (
    <details className="text-sm">
      <summary className="cursor-pointer text-blue-700">{t("history.showTable")}</summary>
      <table className="mt-2 w-full max-w-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="font-medium py-1">{t("history.date")}</th>
            <th className="font-medium py-1 text-right">{t("history.price")}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.time} className="border-t">
              <td className="py-1">{formatDate(point.date)}</td>
              <td className="py-1 text-right tabular-nums">{formatPrice(point.price)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </details>
  );

  // One price only: a sentence says it better than a chart
  if (points.length === 1) {
    return (
      <div ref={containerRef} className="space-y-2">
        <h2 className="font-semibold">{t("history.title")}</h2>
        <p className="text-sm text-gray-700">
          {t("history.unchanged", { price: formatPrice(current.price), date: formatDate(current.date) })}
        </p>
      </div>
    );
  }

  const now = Date.now();
  const innerWidth = width - MARGIN.left - MARGIN.right;
  const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
  const prices = points.map((p) => p.price);
  const ticks = niceTicks(Math.min(...prices), Math.max(...prices));
  const yMin = ticks[0];
  const yMax = ticks[ticks.length - 1];
  const start = points[0].time;
  const end = Math.max(now, current.time + 1);
  const x = (time: number) => MARGIN.left + ((time - start) / (end - start)) * innerWidth;
  const y = (price: number) => MARGIN.top + (1 - (price - yMin) / (yMax - yMin || 1)) * innerHeight;

  // Step line: a price holds until the next change, then jumps
  let line = `M${x(points[0].time)},${y(points[0].price)}`;
  points.slice(1).forEach((point) => {
    line += `H${x(point.time)}V${y(point.price)}`;
  });
  line += `H${x(end)}`;
  const area = `${line}V${y(yMin)}H${x(start)}Z`;

  const activePoint = active !== null ? points[active] : null;

  function pickNearest(clientX: number, svg: SVGSVGElement) {
    const box = svg.getBoundingClientRect();
    const px = ((clientX - box.left) / box.width) * width;
    let nearest = 0;
    points.forEach((point, i) => {
      if (Math.abs(x(point.time) - px) < Math.abs(x(points[nearest].time) - px)) nearest = i;
    });
    setActive(nearest);
  }

  return (
    <div className="space-y-2">
      <div>
        <h2 className="font-semibold">{t("history.title")}</h2>
        <p className="text-xs text-gray-500">{t("history.subtitle")}</p>
      </div>
      <div ref={containerRef} className="relative">
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`${t("history.title")}: ${points.map((p) => `${formatDate(p.date)} ${formatPrice(p.price)}`).join(", ")}`}
          tabIndex={0}
          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 rounded"
          onPointerMove={(e) => pickNearest(e.clientX, e.currentTarget)}
          onPointerLeave={() => setActive(null)}
          onFocus={() => setActive(points.length - 1)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setActive((i) => Math.max(0, (i ?? points.length - 1) - 1));
            if (e.key === "ArrowRight") setActive((i) => Math.min(points.length - 1, (i ?? 0) + 1));
          }}
        >
          {/* Recessive hairline grid with clean euro ticks */}
          {ticks.map((tick) => (
            <g key={tick}>
              <line x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} stroke={GRID} strokeWidth={1} />
              <text x={MARGIN.left - 8} y={y(tick)} dy="0.32em" textAnchor="end" className="fill-gray-500 text-[11px] tabular-nums">
                {formatPrice(tick)}
              </text>
            </g>
          ))}
          <text x={MARGIN.left} y={HEIGHT - 6} className="fill-gray-500 text-[11px]">
            {formatDate(points[0].date)}
          </text>
          <text x={x(end)} y={HEIGHT - 6} textAnchor="end" className="fill-gray-500 text-[11px]">
            {t("history.today")}
          </text>

          <path d={area} fill={LINE} fillOpacity={0.1} />
          <path d={line} fill="none" stroke={LINE} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* Current price: end dot with a surface ring, value in text ink */}
          <circle cx={x(end)} cy={y(current.price)} r={4} fill={LINE} stroke="#fff" strokeWidth={2} />
          <text x={x(end) + 8} y={y(current.price)} dy="0.32em" className="fill-gray-900 text-xs font-semibold tabular-nums">
            {formatPrice(current.price)}
          </text>

          {activePoint && (
            <g pointerEvents="none">
              <line x1={x(activePoint.time)} x2={x(activePoint.time)} y1={MARGIN.top} y2={MARGIN.top + innerHeight} stroke="#9ca3af" strokeWidth={1} />
              <circle cx={x(activePoint.time)} cy={y(activePoint.price)} r={4} fill={LINE} stroke="#fff" strokeWidth={2} />
            </g>
          )}
        </svg>

        {activePoint && (
          <div
            role="status"
            className="absolute top-0 pointer-events-none rounded-md border bg-white px-3 py-2 shadow-md text-xs"
            style={{
              left: Math.min(Math.max(x(activePoint.time) - 70, 0), width - 150),
              top: Math.max(y(activePoint.price) - 64, 0),
            }}
          >
            <p className="flex items-center gap-2 font-semibold text-gray-900 text-sm tabular-nums">
              <span className="inline-block w-3 h-0.5" style={{ background: LINE }} aria-hidden />
              {formatPrice(activePoint.price)}
            </p>
            <p className="text-gray-500">{formatDate(activePoint.date)}</p>
          </div>
        )}
      </div>
      {table}
    </div>
  );
}
