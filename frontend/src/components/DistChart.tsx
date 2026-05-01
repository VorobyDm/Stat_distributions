import { useEffect, useRef, useState } from "react";
import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[];
  type: "discrete" | "continuous";
  palette: string[];
  area?: boolean;
}

type HoverState = {
  screenX: number;
  dataX: number;
  values: { label: string; color: string; y: number }[];
};

export function DistChart({ variants, type, palette, area = true }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 600, height: 240 });
  const [hover, setHover] = useState<HoverState | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const rect = entries[0].contentRect;
      const w = Math.max(200, Math.floor(rect.width));
      const h = Math.max(120, Math.floor(rect.height));
      setSize({ width: w, height: h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { width, height } = size;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 28;

  const allX = variants.flatMap((v) => v.theoretical.x);
  const allY = variants.flatMap((v) => [
    ...v.theoretical.y,
    ...v.histogram.counts,
  ]);
  const xMin = Math.min(...allX);
  const xMax = Math.max(...allX);
  const yMin = 0;
  const yMax = Math.max(...allY) * 1.08 || 1;

  const sx = (x: number) =>
    padL + ((x - xMin) / (xMax - xMin || 1)) * (width - padL - padR);
  const sy = (y: number) =>
    height - padB - ((y - yMin) / (yMax - yMin || 1)) * (height - padT - padB);

  const tickXs: number[] = [];
  if (type === "discrete") {
    const lo = Math.ceil(xMin);
    const hi = Math.floor(xMax);
    const step = Math.max(1, Math.round((hi - lo) / 4));
    for (let x = lo; x <= hi; x += step) tickXs.push(x);
    if (tickXs[tickXs.length - 1] !== hi) tickXs.push(hi);
  } else {
    for (let i = 0; i <= 4; i++) tickXs.push(xMin + (i / 4) * (xMax - xMin));
  }
  const tickYs: number[] = [];
  for (let i = 0; i <= 3; i++) tickYs.push((i / 3) * yMax);

  const formatNum = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

  // Look up y(x) for a variant — interpolate for continuous, snap for discrete
  function yAt(v: VariantResult, x: number): number {
    const xs = v.theoretical.x;
    const ys = v.theoretical.y;
    if (xs.length === 0) return 0;
    if (type === "discrete") {
      const idx = xs.findIndex((vx) => Math.abs(vx - x) < 0.5);
      return idx >= 0 ? ys[idx] : 0;
    }
    let i0 = 0;
    while (i0 < xs.length - 1 && xs[i0 + 1] < x) i0++;
    const i1 = Math.min(i0 + 1, xs.length - 1);
    const x0 = xs[i0];
    const x1 = xs[i1];
    if (x0 === x1) return ys[i0];
    const t = (x - x0) / (x1 - x0);
    return ys[i0] + t * (ys[i1] - ys[i0]);
  }

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    if (mouseX < padL || mouseX > width - padR) {
      setHover(null);
      return;
    }
    const dataX =
      xMin + ((mouseX - padL) / (width - padL - padR)) * (xMax - xMin);
    const snappedX = type === "discrete" ? Math.round(dataX) : dataX;
    const values = variants.map((v, i) => ({
      label: v.label,
      color: palette[i % palette.length],
      y: yAt(v, snappedX),
    }));
    setHover({ screenX: sx(snappedX), dataX: snappedX, values });
  };

  const handleMouseLeave = () => setHover(null);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", position: "relative" }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ display: "block" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Grid lines */}
        {tickYs.map((t, i) => (
          <line
            key={`gy${i}`}
            x1={padL}
            x2={width - padR}
            y1={sy(t)}
            y2={sy(t)}
            stroke="var(--ds-grid)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
        ))}

        {/* X axis labels */}
        {tickXs.map((t, i) => (
          <text
            key={`tx${i}`}
            x={sx(t)}
            y={height - 8}
            fontSize="10"
            fontFamily="JetBrains Mono, monospace"
            fill="var(--ds-muted)"
            textAnchor="middle"
          >
            {formatNum(t)}
          </text>
        ))}
        {/* Y axis labels */}
        {tickYs.map((t, i) => (
          <text
            key={`ty${i}`}
            x={padL - 6}
            y={sy(t) + 3}
            fontSize="9"
            fontFamily="JetBrains Mono, monospace"
            fill="var(--ds-muted)"
            textAnchor="end"
          >
            {t.toFixed(2)}
          </text>
        ))}

        {/* Histogram bars (faded) */}
        {variants.map((v, i) => {
          const color = palette[i % palette.length];
          const edges = v.histogram.bin_edges;
          const counts = v.histogram.counts;
          if (!edges || edges.length === 0) return null;

          return (
            <g key={`h${i}`} opacity={0.32}>
              {counts.map((c, j) => {
                if (type === "discrete") {
                  const center = (edges[j] + edges[j + 1]) / 2;
                  const w = Math.max(2, (sx(xMin + 1) - sx(xMin)) * 0.7);
                  return (
                    <rect
                      key={j}
                      x={sx(center) - w / 2}
                      y={sy(c)}
                      width={w}
                      height={Math.max(0, sy(0) - sy(c))}
                      fill={color}
                    />
                  );
                }
                const x1 = sx(edges[j]);
                const x2 = sx(edges[j + 1]);
                const w = Math.max(1, (x2 - x1) * 0.92);
                const cx = (x1 + x2) / 2;
                return (
                  <rect
                    key={j}
                    x={cx - w / 2}
                    y={sy(c)}
                    width={w}
                    height={Math.max(0, sy(0) - sy(c))}
                    fill={color}
                  />
                );
              })}
            </g>
          );
        })}

        {/* Theoretical curves / discrete stems */}
        {variants.map((v, i) => {
          const color = palette[i % palette.length];
          const xs = v.theoretical.x;
          const ys = v.theoretical.y;

          if (type === "discrete") {
            return (
              <g key={`c${i}`}>
                {xs.map((x, j) => (
                  <g key={j}>
                    <line
                      x1={sx(x)}
                      x2={sx(x)}
                      y1={sy(0)}
                      y2={sy(ys[j])}
                      stroke={color}
                      strokeWidth="2"
                      opacity="0.95"
                    />
                    <circle cx={sx(x)} cy={sy(ys[j])} r={3} fill={color} />
                  </g>
                ))}
              </g>
            );
          }

          const pts = xs.map((x, j) => `${sx(x)},${sy(ys[j])}`).join(" ");
          const areaPts = `${sx(xs[0])},${sy(0)} ${pts} ${sx(xs[xs.length - 1])},${sy(0)}`;
          return (
            <g key={`c${i}`}>
              {area && <polygon points={areaPts} fill={color} opacity="0.12" />}
              <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" />
            </g>
          );
        })}

        {/* Hover crosshair + dots on each curve */}
        {hover && (
          <g pointerEvents="none">
            <line
              x1={hover.screenX}
              x2={hover.screenX}
              y1={padT}
              y2={height - padB}
              stroke="var(--ds-muted)"
              strokeWidth="1"
              strokeDasharray="2 4"
              opacity="0.7"
            />
            {hover.values.map((v, i) => (
              <circle
                key={i}
                cx={hover.screenX}
                cy={sy(v.y)}
                r={4}
                fill={v.color}
                stroke="var(--ds-paper)"
                strokeWidth="2"
              />
            ))}
          </g>
        )}
      </svg>

      {hover && (
        <div
          className="v2-chart-tooltip"
          style={{
            left: Math.min(width - 8, Math.max(8, hover.screenX)),
            top: padT,
          }}
        >
          <div className="x">
            x = {type === "discrete" ? hover.dataX : hover.dataX.toFixed(2)}
          </div>
          {hover.values.map((v, i) => (
            <div key={i} className="row">
              <span className="dot" style={{ background: v.color }} />
              <span className="label">{v.label}</span>
              <span className="value">{v.y.toFixed(4)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
