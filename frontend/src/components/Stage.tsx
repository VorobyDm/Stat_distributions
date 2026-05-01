import { Fragment } from "react";
import type { ComputeResponse, DistributionConfig, VariantStats } from "../types";
import { DistChart } from "./DistChart";

interface Props {
  dist: DistributionConfig;
  numSamples: number;
  results: ComputeResponse | null;
  palette: string[];
  loading: boolean;
}

const STAT_ROWS: { group: string; rows: { sym: string; label: string; key: keyof VariantStats }[] }[] = [
  {
    group: "центр",
    rows: [
      { sym: "μ", label: "среднее", key: "mean" },
      { sym: "Me", label: "медиана", key: "median" },
      { sym: "Mo", label: "мода", key: "mode" },
    ],
  },
  {
    group: "разброс",
    rows: [
      { sym: "σ", label: "стд. откл.", key: "std" },
      { sym: "σ²", label: "дисперсия", key: "variance" },
      { sym: "IQR", label: "межкварт.", key: "iqr" },
      { sym: "R", label: "размах", key: "range" },
    ],
  },
  {
    group: "форма",
    rows: [
      { sym: "γ₁", label: "асимметрия", key: "skewness" },
      { sym: "γ₂", label: "эксцесс", key: "kurtosis" },
    ],
  },
  {
    group: "квантили",
    rows: [
      { sym: "Q₁", label: "25%", key: "q25" },
      { sym: "Q₃", label: "75%", key: "q75" },
      { sym: "min", label: "минимум", key: "min" },
      { sym: "max", label: "максимум", key: "max" },
    ],
  },
];

export function Stage({ dist, numSamples, results, palette, loading }: Props) {
  const variants = results?.variants ?? [];

  return (
    <div className="v2-stage">
      <div className="v2-stage-h">
        <div>
          <div className="v2-stage-eyebrow">02 / лаборатория · {dist.num}</div>
          <h1 className="v2-stage-title">
            {dist.name} <em>распределение</em>
          </h1>
          <div className="v2-stage-tagline">{dist.tagline}</div>
        </div>
        <div className="v2-stage-meta">
          <div className="metric">
            <div className="v">{dist.default_variants.length}</div>
            <div className="l">варианта</div>
          </div>
          <div className="metric">
            <div className="v">{numSamples}</div>
            <div className="l">наблюдений</div>
          </div>
          <div className="metric">
            <div className="v">{dist.params.length}</div>
            <div className="l">параметра</div>
          </div>
        </div>
      </div>

      <div className="v2-chart-card">
        <span className="corner tl">FIG · {dist.num}</span>
        <span className="corner tr">PDF / HISTOGRAM</span>
        <span className="corner bl">x — значение</span>
        <span className="corner br">f(x)</span>
        <div className="v2-chart-area">
          {variants.length > 0 ? (
            <DistChart
              variants={variants}
              type={dist.type}
              palette={palette}
              area={dist.type === "continuous"}
            />
          ) : (
            <div
              className="v2-state"
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading
                ? "вычисляем…"
                : "нажмите «Сгенерировать», чтобы увидеть график"}
            </div>
          )}
        </div>
        {variants.length > 0 && (
          <div className="v2-legend">
            {variants.map((v, i) => (
              <div key={i} className="v2-legend-item">
                <div
                  className="dot"
                  style={{ background: palette[i % palette.length] }}
                />
                {v.label}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="v2-stage-bottom">
        <div className="v2-examples">
          <div className="v2-examples-h">
            <div className="t">
              Где встречается <em>в реальной жизни</em>
            </div>
            <div className="lbl">примеры</div>
          </div>
          <div className="v2-examples-grid">
            {dist.examples.map((ex, i) => (
              <div key={i} className="v2-example">
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <div className="text">{ex}</div>
              </div>
            ))}
          </div>
        </div>

        {variants.length > 0 ? (
          <div className="v2-stats-block">
            <div className="v2-stats-h">
              <div className="t">
                <em>Статистики</em> по вариантам
              </div>
              <div className="lbl">μ · σ · медиана</div>
            </div>
            <div className="v2-cards-row">
              {variants.map((v, i) => (
                <div key={i} className="v2-mini-card">
                  <div className="head">
                    <span className="lbl">{v.label}</span>
                    <span
                      className="swatch"
                      style={{ background: palette[i % palette.length] }}
                    />
                  </div>
                  <table>
                    <tbody>
                      {STAT_ROWS.map((g) => (
                        <Fragment key={g.group}>
                          <tr>
                            <td colSpan={2} className="group">
                              {g.group}
                            </td>
                          </tr>
                          {g.rows.map((row) => (
                            <tr key={`${g.group}-${row.key}`}>
                              <td className="k">
                                <span className="sym">{row.sym}</span>
                                {row.label}
                              </td>
                              <td className="v">{v.stats[row.key]}</td>
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="v2-state" style={{ padding: 16 }}>
            статистики появятся после генерации
          </div>
        )}
      </div>
    </div>
  );
}
