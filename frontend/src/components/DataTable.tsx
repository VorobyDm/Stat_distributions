import type { VariantResult } from "../types";

interface Props {
  variants: VariantResult[];
  type: "discrete" | "continuous";
  palette: string[];
  onClose: () => void;
}

function formatSample(s: number, type: "discrete" | "continuous"): string {
  if (type === "discrete") return String(Math.round(s));
  return s.toFixed(4);
}

export function DataTable({ variants, type, palette, onClose }: Props) {
  const rowCount = Math.max(...variants.map((v) => v.samples.length), 0);

  return (
    <div className="v2-data-panel">
      <div className="v2-data-h">
        <span className="col idx">№</span>
        {variants.map((_, i) => (
          <span key={i} className="col">
            <span
              className="dot"
              style={{ background: palette[i % palette.length] }}
            />
            Вар.{i + 1}
          </span>
        ))}
        <button
          type="button"
          className="v2-data-close"
          onClick={onClose}
          aria-label="Скрыть данные"
        >
          ×
        </button>
      </div>
      <div className="v2-data-body">
        {Array.from({ length: rowCount }, (_, i) => (
          <div key={i} className="v2-data-row">
            <span className="col idx">{i + 1}</span>
            {variants.map((v, j) => (
              <span key={j} className="col">
                {v.samples[i] !== undefined
                  ? formatSample(v.samples[i], type)
                  : "—"}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
