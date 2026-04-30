import { Text } from "@consta/uikit/Text";
import type { VariantResult } from "../types";

const STAT_LABELS: Record<string, string> = {
  mean: "Среднее",
  variance: "Дисперсия",
  std: "Стд. откл.",
  median: "Медиана",
  min: "Минимум",
  max: "Максимум",
};

interface Props {
  variants: VariantResult[];
}

export function StatsPanel({ variants }: Props) {
  return (
    <div>
      <Text size="m" weight="bold" style={{ marginBottom: 12 }}>
        Статистики выборок
      </Text>
      {variants.map((v) => (
        <div
          key={v.label}
          style={{
            marginBottom: 16,
            borderLeft: `4px solid ${v.color}`,
            paddingLeft: 10,
          }}
        >
          <Text size="s" weight="bold" style={{ marginBottom: 4 }}>
            {v.label}
          </Text>
          <table style={{ fontSize: 12, borderCollapse: "collapse", width: "100%" }}>
            <tbody>
              {Object.entries(STAT_LABELS).map(([key, label]) => (
                <tr key={key}>
                  <td style={{ padding: "2px 0", color: "var(--color-typo-secondary)" }}>
                    {label}
                  </td>
                  <td style={{ padding: "2px 0", textAlign: "right", fontWeight: 500 }}>
                    {v.stats[key as keyof typeof v.stats]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
