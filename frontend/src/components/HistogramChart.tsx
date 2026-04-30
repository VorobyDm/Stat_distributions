import Plot from "react-plotly.js";
import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[];
}

export function HistogramChart({ variants }: Props) {
  const data: Plotly.Data[] = [];

  for (const v of variants) {
    // Histogram of samples
    data.push({
      x: v.samples,
      type: "histogram",
      histnorm: "probability density",
      name: v.label,
      marker: { color: v.color },
      opacity: 0.4,
      nbinsx: 30,
    });

    // Theoretical curve
    data.push({
      x: v.theoretical.x,
      y: v.theoretical.y,
      type: "scatter",
      mode: "lines",
      name: `${v.label} (теория)`,
      line: { color: v.color, width: 2 },
    });
  }

  return (
    <Plot
      data={data}
      layout={{
        title: "Гистограмма выборок и теоретическая кривая",
        barmode: "overlay",
        xaxis: { title: "x" },
        yaxis: { title: "Плотность" },
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
