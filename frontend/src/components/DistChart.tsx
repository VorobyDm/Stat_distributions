import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[];
  type: "discrete" | "continuous";
  palette: string[];
  height?: number;
  area?: boolean;
}

export function DistChart({ variants, type, palette, height = 320, area = true }: Props) {
  const width = 600;
  const padL = 40;
  const padR = 12;
  const padT = 12;
  const padB = 28;

  // Theoretical curves provide xs/ys; histograms provide counts/edges
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
  for (let i = 0; i <= 4; i++) tickXs.push(xMin + (i / 4) * (xMax - xMin));
  const tickYs: number[] = [];
  for (let i = 0; i <= 3; i++) tickYs.push((i / 3) * yMax);

  const formatNum = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height={height}
      style={{ display: "block", overflow: "visible" }}
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
    </svg>
  );
}
