import Plot from "react-plotly.js";
import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[]; // sliced (visible) data
  allVariants: VariantResult[]; // full data for axis range and bin edges
  discrete?: boolean; // discrete distribution?
}

// Count occurrences of each integer value in samples
function countValues(samples: number[], maxVal: number): { x: number[]; y: number[] } {
  const counts = new Array(maxVal + 1).fill(0);
  for (const s of samples) {
    const idx = Math.round(s);
    if (idx >= 0 && idx <= maxVal) counts[idx]++;
  }
  const total = samples.length;
  const x: number[] = [];
  const y: number[] = [];
  for (let i = 0; i <= maxVal; i++) {
    x.push(i);
    y.push(counts[i] / total);
  }
  return { x, y };
}

export function HistogramChart({ variants, allVariants, discrete }: Props) {
  const data: Plotly.Data[] = [];

  // Fixed x-axis range from full data
  let xMin = Infinity;
  let xMax = -Infinity;
  for (const v of allVariants) {
    for (const s of v.samples) {
      if (s < xMin) xMin = s;
      if (s > xMax) xMax = s;
    }
  }
  const xPad = (xMax - xMin) * 0.05 || 1;

  for (let i = 0; i < variants.length; i++) {
    const v = variants[i];
    const full = allVariants[i];

    if (discrete) {
      const maxVal = Math.round(xMax);
      const counted = countValues(v.samples, maxVal);

      // Bars centered on integers, overlay mode with transparency
      data.push({
        x: counted.x,
        y: counted.y,
        type: "bar",
        name: v.label,
        marker: { color: v.color, opacity: 0.4 },
        width: 0.8,
      });

      // Theoretical PMF as lines + markers
      data.push({
        x: v.theoretical.x,
        y: v.theoretical.y,
        type: "scatter",
        mode: "lines+markers",
        name: `${v.label} (теория)`,
        line: { color: v.color, width: 2 },
        marker: { color: v.color, size: 6 },
      });
    } else {
      // Histogram for continuous distributions
      const binEdges = full.histogram.bin_edges;
      const binStart = binEdges[0];
      const binEnd = binEdges[binEdges.length - 1];
      const binSize = (binEnd - binStart) / (binEdges.length - 1);

      data.push({
        x: v.samples,
        type: "histogram",
        histnorm: "probability density",
        name: v.label,
        marker: { color: v.color },
        opacity: 0.4,
        xbins: { start: binStart, end: binEnd, size: binSize },
      });

      // Theoretical PDF as line
      data.push({
        x: v.theoretical.x,
        y: v.theoretical.y,
        type: "scatter",
        mode: "lines",
        name: `${v.label} (теория)`,
        line: { color: v.color, width: 2 },
      });
    }
  }

  return (
    <Plot
      data={data}
      layout={{
        title: discrete
          ? "Частота выборок и теоретическая PMF"
          : "Гистограмма выборок и теоретическая кривая",
        barmode: "overlay",
        xaxis: { title: "x", range: [xMin - xPad, xMax + xPad] },
        yaxis: { title: discrete ? "Вероятность" : "Плотность" },
        height: 450,
        margin: { t: 40, b: 50, l: 60, r: 20 },
        showlegend: true,
        legend: { x: 1, xanchor: "right", y: 1 },
      }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}
