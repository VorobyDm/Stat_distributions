import { useMemo } from "react";
import type { DistributionConfig } from "../types";

const PARAM_SYMBOL: Record<string, string> = {
  mu: "μ",
  sigma: "σ",
  lambda: "λ",
  alpha: "α",
  beta: "β",
  theta: "θ",
  nu: "ν",
  d1: "d₁",
  d2: "d₂",
};

function paramSymbol(name: string): string {
  return PARAM_SYMBOL[name] ?? name;
}

function shortPillName(name: string): string {
  return name.split(" ")[0].slice(0, 6);
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightFormula(formula: string, paramName: string | null): string {
  if (!paramName) return formula;
  const symbol = paramSymbol(paramName);
  const re = new RegExp(escapeRegex(symbol));
  return formula.replace(re, `<mark>${symbol}</mark>`);
}

interface Props {
  distributions: DistributionConfig[];
  activeId: string;
  onSelectDistribution: (id: string) => void;

  dist: DistributionConfig;
  variantIdx: number;
  onSelectVariant: (idx: number) => void;

  paramValues: Record<string, number>;
  onParamChange: (name: string, value: number) => void;

  highlight: number;
  onHighlightChange: (idx: number) => void;

  numSamples: number;
  onNumSamplesChange: (n: number) => void;

  onGenerate: () => void;
  onReset: () => void;
  loading: boolean;
}

export function Sidebar({
  distributions,
  activeId,
  onSelectDistribution,
  dist,
  variantIdx,
  onSelectVariant,
  paramValues,
  onParamChange,
  highlight,
  onHighlightChange,
  numSamples,
  onNumSamplesChange,
  onGenerate,
  onReset,
  loading,
}: Props) {
  const activeParam = dist.params[highlight];
  const formulaHTML = useMemo(
    () => highlightFormula(dist.formula, activeParam?.name ?? null),
    [dist.formula, activeParam],
  );

  const formatValue = (n: number, isInt: boolean): string => {
    if (isInt) return String(Math.round(n));
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
  };

  return (
    <div className="v2-panel">
      <div className="v2-panel-h">
        <div className="title">Статистическая лаборатория</div>
        <div className="badge">CONSOLE / 02</div>
      </div>

      <div className="v2-pills">
        {distributions.map((d) => (
          <button
            key={d.id}
            className={"v2-pill " + (d.id === activeId ? "active" : "")}
            onClick={() => onSelectDistribution(d.id)}
            type="button"
          >
            {d.num} {shortPillName(d.name)}
          </button>
        ))}
      </div>

      <div className="v2-section-divider">что это</div>
      <div className="v2-about">
        <div className="lbl">кратко</div>
        <div className="text">{dist.about}</div>
      </div>

      <div className="v2-formula-card">
        <div className="label">формула плотности</div>
        <div
          className="formula"
          dangerouslySetInnerHTML={{ __html: formulaHTML }}
        />
        <div className="formula-hint">
          подсвечен активный параметр — кликните на ручку ниже
        </div>
      </div>

      <div className="v2-section-divider">параметры и их влияние</div>

      {dist.default_variants.length > 0 && (
        <div className="v2-variant-row">
          {dist.default_variants.map((v, i) => (
            <button
              key={i}
              className={"v2-variant-btn " + (i === variantIdx ? "active" : "")}
              onClick={() => onSelectVariant(i)}
              type="button"
            >
              <span className="num">ВАРИАНТ {i + 1}</span>
              <span className="vlbl">{v.label}</span>
            </button>
          ))}
        </div>
      )}

      {dist.params.map((p, i) => {
        const value = paramValues[p.name] ?? p.default;
        const isInt = p.type === "int";
        const stepValue = isInt ? 1 : p.step ?? (p.max - p.min) / 100;
        const [namePart, descPart] = p.label.split("—").map((s) => s.trim());

        return (
          <div
            key={p.name}
            className={"v2-knob " + (i === highlight ? "focus" : "")}
            onClick={() => onHighlightChange(i)}
          >
            <div className="v2-knob-h">
              <span className="v2-knob-name">{namePart}</span>
              <span className="v2-knob-val">{formatValue(value, isInt)}</span>
            </div>
            {descPart && <div className="v2-knob-desc">{descPart}</div>}
            <input
              type="range"
              min={p.min}
              max={p.max}
              step={stepValue}
              value={value}
              onChange={(e) => onParamChange(p.name, Number(e.target.value))}
              onFocus={() => onHighlightChange(i)}
            />
            {p.effect && <div className="v2-knob-effect">{p.effect}</div>}
          </div>
        );
      })}

      <div className="v2-section-divider">размер выборки</div>
      <div className="v2-anim-row">
        <div className="lbl">N</div>
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={numSamples}
          onChange={(e) => onNumSamplesChange(Number(e.target.value))}
        />
        <div className="counter">{numSamples}</div>
      </div>
      <div className="v2-anim-hint">
        Число наблюдений в гистограмме. Чем больше N, тем ближе эмпирическое
        распределение к теоретической кривой.
      </div>

      <div className="v2-action">
        <button
          className="primary"
          onClick={onGenerate}
          disabled={loading}
          type="button"
        >
          {loading ? "генерируем…" : "⚡ Сгенерировать"}
        </button>
        <button
          className="secondary"
          onClick={onReset}
          disabled={loading}
          type="button"
        >
          сбросить
        </button>
      </div>
    </div>
  );
}
