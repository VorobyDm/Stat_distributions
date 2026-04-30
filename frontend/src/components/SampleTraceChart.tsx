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
        title: { text: "Генерация трёх случайных выборок", font: { size: 16 } },
        xaxis: { title: { text: "Итерация", standoff: 10 }, range: [0, totalSamples] },
        yaxis: { title: { text: "Значение", standoff: 10 } },
        height: 340,
        margin: { t: 50, b: 60, l: 70, r: 20 },
        showlegend: true,
        legend: { x: 1, xanchor: "right", y: 1 },
      }}
      useResizeHandler
      style={{ width: "100%" }}
    />
  );
}
