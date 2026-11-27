"use client";

import { useEffect, useRef, useState } from "react";
import s from "./SeoDashboard.module.css";

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(260, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / p;
  return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10) * p;
}

export type Bar = { label: string; value: number; overlay?: number; color?: string; note?: string };

/** Horizontal bars with values printed at the end of each bar. */
export function HBarChart({ bars, label, format = (v: number) => String(v), color = "var(--accent)" }: { bars: Bar[]; label: string; format?: (v: number) => string; color?: string }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const barH = 22, gap = 9;
  const labW = Math.min(W * 0.42, Math.max(...bars.map((b) => b.label.length)) * 6.6 + 12);
  const valW = 96;
  const max = Math.max(...bars.map((b) => b.value), 0) || 1;
  const x = (v: number) => (v / max) * Math.max(40, W - labW - valW);
  const H = bars.length * (barH + gap);
  return (
    <div ref={ref} className={s.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        {bars.map((b, i) => (
          <g key={b.label} transform={`translate(0,${i * (barH + gap)})`}>
            <text x={labW - 8} y={barH / 2} dy="0.35em" textAnchor="end" className={s.barLabel}>{b.label}</text>
            <rect x={labW} height={barH} rx={3} width={Math.max(2, x(b.value))} fill={b.color || color} opacity={b.overlay !== undefined ? 0.3 : 1} />
            {b.overlay !== undefined && <rect x={labW} height={barH} rx={3} width={x(b.overlay)} fill={b.color || color} />}
            <text x={labW + x(b.value) + 6} y={barH / 2} dy="0.35em" className={s.axisText}>{format(b.value)}{b.note ? ` ${b.note}` : ""}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export type Dot = { id: string; x: number; y: number; r: number; color: string; lines: string[] };

/** Scatter plot with gridlines, axes and a hover tooltip kept inside the chart. */
export function Scatter({ dots, xLabel, yLabel, label, xFormat = (v: number) => String(v) }: { dots: Dot[]; xLabel: string; yLabel: string; label: string; xFormat?: (v: number) => string }) {
  const [ref, W] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<{ d: Dot; px: number; py: number } | null>(null);
  const H = 340, m = { t: 14, r: 18, b: 42, l: 44 };
  const xMax = niceMax(Math.max(...dots.map((d) => d.x)) * 1.05);
  const yMin = Math.floor((Math.min(...dots.map((d) => d.y)) - 0.3) * 2) / 2;
  const yMax = Math.ceil((Math.max(...dots.map((d) => d.y)) + 0.2) * 2) / 2;
  const sx = (v: number) => m.l + (v / xMax) * (W - m.l - m.r);
  const sy = (v: number) => H - m.b - ((v - yMin) / (yMax - yMin)) * (H - m.t - m.b);
  const xCount = Math.max(3, Math.min(8, Math.floor(W / 100)));
  const xTicks: number[] = Array.from({ length: xCount + 1 }, (_: unknown, i: number) => (xMax / xCount) * i);
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax + 1e-9; v += 0.5) yTicks.push(Math.round(v * 10) / 10);
  return (
    <div ref={ref} className={s.chart}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} onPointerLeave={() => setHover(null)}>
        {yTicks.map((t) => (
          <g key={`y${t}`}>
            <line x1={m.l} x2={W - m.r} y1={sy(t)} y2={sy(t)} stroke="#e7ecf0" />
            <text x={m.l - 6} y={sy(t)} dy="0.35em" textAnchor="end" className={s.axisText}>{t.toFixed(1)}</text>
          </g>
        ))}
        {xTicks.map((t, i) => (
          <text key={`x${i}`} x={sx(t)} y={H - m.b + 16} textAnchor={i === 0 ? "start" : i === xTicks.length - 1 ? "end" : "middle"} className={s.axisText}>{xFormat(Math.round(t))}</text>
        ))}
        <line x1={m.l} x2={W - m.r} y1={H - m.b} y2={H - m.b} stroke="#b9c3cc" />
        <text x={W - m.r} y={H - 4} textAnchor="end" className={s.axisText}>{xLabel}</text>
        <text x={4} y={m.t - 2} className={s.axisText}>{yLabel}</text>
        {dots.map((d) => (
          <circle key={d.id} cx={sx(d.x)} cy={sy(d.y)} r={d.r} fill={d.color} fillOpacity={0.78} stroke="#fff" strokeWidth={1}
            onPointerEnter={(e) => { const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); setHover({ d, px: e.clientX - box.left, py: e.clientY - box.top }); }}
            onPointerMove={(e) => { const box = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect(); setHover({ d, px: e.clientX - box.left, py: e.clientY - box.top }); }}
          />
        ))}
      </svg>
      {hover && (
        <div className={s.tip} style={{ left: Math.max(0, Math.min(hover.px + 12, W - 270)), top: Math.max(0, hover.py - 80) }}>
          {hover.d.lines.map((l, i) => (i === 0 ? <b key={i}>{l}</b> : <span key={i}>{l}</span>))}
        </div>
      )}
    </div>
  );
}
