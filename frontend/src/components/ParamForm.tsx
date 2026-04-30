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
  // Animation
  showAnimation: boolean;
  playing: boolean;
  onPlayPause: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  step: number;
  onStepChange: (step: number) => void;
  totalSamples: number;
}

export function ParamForm({
  params, variants, onChange,
  numSamples, onNumSamplesChange,
  onGenerate, loading,
  showAnimation, playing, onPlayPause,
  speed, onSpeedChange,
  step, onStepChange, totalSamples,
}: Props) {
  const handleChange = (variantIndex: number, paramName: string, value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return;
    const updated = variants.map((v, i) =>
      i === variantIndex ? { ...v, [paramName]: num } : v
    );
    onChange(updated);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {/* Parameters row */}
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
          label="Размер выборки"
          type="number"
          value={String(numSamples)}
          onChange={(value) => {
            const n = parseInt(value ?? "");
            if (!isNaN(n) && n > 0) onNumSamplesChange(n);
          }}
          step={100}
          min={10}
          max={10000}
          size="m"
          style={{ width: 140, marginLeft: "auto" }}
        />
        <Button
          label="Сгенерировать"
          size="s"
          onClick={onGenerate}
          loading={loading}
          style={{ whiteSpace: "nowrap" }}
        />
      </div>

      {/* Animation controls row */}
      {showAnimation && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "6px 12px",
            background: "var(--color-bg-secondary)",
            borderRadius: 4,
          }}
        >
          <Button
            label={playing ? "⏸ Пауза" : step >= totalSamples ? "⏮ Сначала" : "▶ Старт"}
            size="xs"
            view={playing ? "secondary" : "primary"}
            onClick={onPlayPause}
            style={{ whiteSpace: "nowrap", minWidth: 100 }}
          />

          <label style={{ fontSize: 13, whiteSpace: "nowrap" }}>
            Скорость:
          </label>
          <input
            type="range"
            min={1}
            max={500}
            value={speed}
            onChange={(e) => onSpeedChange(Number(e.target.value))}
            style={{ width: 120 }}
          />
          <span style={{ fontSize: 12, minWidth: 20 }}>{speed}</span>

          <label style={{ fontSize: 13, whiteSpace: "nowrap", marginLeft: 8 }}>
            Шаг:
          </label>
          <input
            type="range"
            min={0}
            max={totalSamples}
            value={step}
            onChange={(e) => onStepChange(Number(e.target.value))}
            style={{ flex: 1 }}
          />
          <span style={{ fontSize: 12, minWidth: 70 }}>
            {step} / {totalSamples}
          </span>
        </div>
      )}
    </div>
  );
}
