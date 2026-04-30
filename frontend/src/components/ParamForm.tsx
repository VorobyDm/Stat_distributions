import { TextField } from "@consta/uikit/TextField";
import { Button } from "@consta/uikit/Button";
import type { DistributionParam } from "../types";

const VARIANT_COLORS = ["#e53935", "#43a047", "#1e88e5"];

interface Props {
  params: DistributionParam[];
  variants: Record<string, number>[];
  onChange: (variants: Record<string, number>[]) => void;
  numSamples: number;
  onNumSamplesChange: (value: number) => void;
  onGenerate: () => void;
  loading: boolean;
}

export function ParamForm({ params, variants, onChange, numSamples, onNumSamplesChange, onGenerate, loading }: Props) {
  const handleChange = (variantIndex: number, paramName: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = variants.map((v, i) =>
      i === variantIndex ? { ...v, [paramName]: num } : v
    );
    onChange(updated);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 16,
        padding: "8px 12px",
        background: "var(--color-bg-secondary)",
        borderRadius: 4,
        flexWrap: "wrap",
      }}
    >
      {variants.map((variant, vi) => (
        <div
          key={vi}
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: 6,
            borderLeft: `4px solid ${VARIANT_COLORS[vi]}`,
            paddingLeft: 8,
          }}
        >
          {params.map((p) => (
            <TextField
              key={p.name}
              label={p.label}
              type="number"
              value={String(variant[p.name] ?? p.default)}
              onChange={(value) => handleChange(vi, p.name, value ?? "")}
              step={p.type === "int" ? 1 : (p.step ?? 0.1)}
              min={p.min}
              max={p.max}
              size="s"
              style={{ width: 110 }}
            />
          ))}
        </div>
      ))}
      <TextField
        label="Выборка"
        type="number"
        value={String(numSamples)}
        onChange={(value) => {
          const n = parseInt(value ?? "");
          if (!isNaN(n) && n > 0) onNumSamplesChange(n);
        }}
        step={100}
        min={10}
        max={10000}
        size="s"
        style={{ width: 100 }}
      />
      <Button
        label="Сгенерировать"
        size="s"
        onClick={onGenerate}
        loading={loading}
        style={{ whiteSpace: "nowrap", marginLeft: "auto" }}
      />
    </div>
  );
}
