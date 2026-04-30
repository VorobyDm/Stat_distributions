import Plot from "react-plotly.js";
import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[]; // sliced (visible) data
  totalSamples: number; // for fixed x-axis range
}

export function SampleTraceChart({ variants, totalSamples }: Props) {
  const data: Plotly.Data[] = variants.map((v) => ({
    y: v.samples,
    type: "scatter",
    mode: "lines",
    name: v.label,
    line: { color: v.color, width: 1 },
  }));

  return (
    <Plot
      data={data}
      layout={{
        title: "Последовательность выборок",
        xaxis: { title: "Итерация", range: [0, totalSamples] },
        yaxis: { title: "Значение" },
        height: 300,
        margin: { t: 40, b: 50, l: 60, r: 20 },
        showlegend: true,
        legend: { x: 1, xanchor: "right", y: 1 },
      }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}
