import { useEffect, useMemo, useState } from "react";
import { computeDistribution, fetchDistributions } from "./api";
import type {
  ComputeResponse,
  DistributionConfig,
  DistributionVariant,
} from "./types";
import { Sidebar } from "./components/Sidebar";
import { Stage } from "./components/Stage";

type Theme = "light" | "dark";

const STORAGE_THEME_KEY = "stat-lab-theme";

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function readPalette(): string[] {
  const styles = getComputedStyle(document.documentElement);
  const fallback = ["#c47a3a", "#3a6dc4", "#c43a8a"];
  const get = (name: string, def: string) =>
    styles.getPropertyValue(name).trim() || def;
  return [
    get("--p1", fallback[0]),
    get("--p2", fallback[1]),
    get("--p3", fallback[2]),
  ];
}

function variantToParams(v: DistributionVariant): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [key, value] of Object.entries(v)) {
    if (key === "label") continue;
    if (typeof value === "number") out[key] = value;
  }
  return out;
}

export default function App() {
  const [distributions, setDistributions] = useState<DistributionConfig[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [bootError, setBootError] = useState("");
  const [bootLoading, setBootLoading] = useState(true);

  const [variantIdx, setVariantIdx] = useState(0);
  const [highlight, setHighlight] = useState(0);
  const [paramOverrides, setParamOverrides] = useState<Record<string, number>>(
    {},
  );
  const [numSamples, setNumSamples] = useState(400);

  const [results, setResults] = useState<ComputeResponse | null>(null);
  const [computeLoading, setComputeLoading] = useState(false);
  const [computeError, setComputeError] = useState("");

  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_THEME_KEY) as Theme | null;
    return saved === "dark" ? "dark" : "light";
  });
  const [paletteVersion, setPaletteVersion] = useState(0);

  // Apply theme to <html>
  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem(STORAGE_THEME_KEY, theme);
    // Force palette recompute after CSS vars apply
    requestAnimationFrame(() => setPaletteVersion((v) => v + 1));
  }, [theme]);

  const palette = useMemo(() => readPalette(), [paletteVersion, theme]);

  // Fetch distributions on mount
  useEffect(() => {
    fetchDistributions()
      .then((data) => {
        setDistributions(data);
        const initial = data.find((d) => d.id === "normal") ?? data[0];
        if (initial) setActiveId(initial.id);
      })
      .catch((e: Error) => setBootError(e.message))
      .finally(() => setBootLoading(false));
  }, []);

  const dist = useMemo(
    () => distributions.find((d) => d.id === activeId),
    [distributions, activeId],
  );

  // Reset variant/highlight/overrides on distribution change
  useEffect(() => {
    if (!dist) return;
    setVariantIdx(0);
    setHighlight(0);
    setParamOverrides({});
    setResults(null);
    setComputeError("");
  }, [activeId, dist]);

  // Effective param values: variant defaults + user overrides
  const paramValues = useMemo<Record<string, number>>(() => {
    if (!dist) return {};
    const variant = dist.default_variants[variantIdx];
    const base = variant ? variantToParams(variant) : {};
    for (const p of dist.params) {
      if (!(p.name in base)) base[p.name] = p.default;
    }
    return { ...base, ...paramOverrides };
  }, [dist, variantIdx, paramOverrides]);

  const handleSelectDistribution = (id: string) => {
    setActiveId(id);
  };

  const handleSelectVariant = (idx: number) => {
    setVariantIdx(idx);
    setParamOverrides({});
  };

  const handleParamChange = (name: string, value: number) => {
    setParamOverrides((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setParamOverrides({});
    setVariantIdx(0);
    setResults(null);
    setComputeError("");
  };

  const handleGenerate = async () => {
    if (!dist) return;
    setComputeLoading(true);
    setComputeError("");
    try {
      // Send all 3 variants — the chart shows three curves side by side.
      const variants = dist.default_variants.map((v, i) => {
        const baseParams = variantToParams(v);
        // For currently-active variant apply user overrides
        const params =
          i === variantIdx ? { ...baseParams, ...paramOverrides } : baseParams;
        const label =
          i === variantIdx && Object.keys(paramOverrides).length > 0
            ? buildVariantLabel(dist, params)
            : v.label;
        return { label, ...params };
      });
      const data = await computeDistribution(dist.id, variants, numSamples);
      setResults(data);
    } catch (e) {
      setComputeError(e instanceof Error ? e.message : "Ошибка вычисления");
    } finally {
      setComputeLoading(false);
    }
  };

  const toggleTheme = () => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  };

  if (bootLoading) {
    return <div className="v2-state">загрузка…</div>;
  }
  if (bootError) {
    return (
      <div className="v2-state error">
        Ошибка: {bootError}. Запусти бэкенд на http://localhost:8001
      </div>
    );
  }
  if (!dist) {
    return <div className="v2-state">распределения не найдены</div>;
  }

  return (
    <>
      <header className="v2-topbar">
        <div className="brand">
          <span className="logo">
            Stat <em>Lab</em>
          </span>
          <span className="sub">статистическая лаборатория · v0.1</span>
        </div>
        <div
          className="v2-theme-toggle"
          role="radiogroup"
          aria-label="Тема интерфейса"
        >
          <button
            type="button"
            className={"opt " + (theme === "light" ? "active" : "")}
            onClick={() => theme !== "light" && toggleTheme()}
            aria-checked={theme === "light"}
            role="radio"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="8" cy="8" r="3" />
              <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" />
            </svg>
            Light
          </button>
          <button
            type="button"
            className={"opt " + (theme === "dark" ? "active" : "")}
            onClick={() => theme !== "dark" && toggleTheme()}
            aria-checked={theme === "dark"}
            role="radio"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                d="M13 9.5A6 6 0 1 1 6.5 3a5 5 0 0 0 6.5 6.5z"
                fill="currentColor"
                stroke="none"
              />
            </svg>
            Dark
          </button>
        </div>
      </header>

      <div className="v2-root">
        <Sidebar
          distributions={distributions}
          activeId={activeId}
          onSelectDistribution={handleSelectDistribution}
          dist={dist}
          variantIdx={variantIdx}
          onSelectVariant={handleSelectVariant}
          paramValues={paramValues}
          onParamChange={handleParamChange}
          highlight={highlight}
          onHighlightChange={setHighlight}
          numSamples={numSamples}
          onNumSamplesChange={setNumSamples}
          onGenerate={handleGenerate}
          onReset={handleReset}
          loading={computeLoading}
        />
        <Stage
          dist={dist}
          numSamples={numSamples}
          results={results}
          palette={palette}
          loading={computeLoading}
        />
      </div>

      {computeError && (
        <div className="v2-state error">{computeError}</div>
      )}
    </>
  );
}

function buildVariantLabel(
  dist: DistributionConfig,
  params: Record<string, number>,
): string {
  const SYM: Record<string, string> = {
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
  return dist.params
    .map((p) => `${SYM[p.name] ?? p.name}=${params[p.name]}`)
    .join(", ");
}
