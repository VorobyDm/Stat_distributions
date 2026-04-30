import { useEffect, useState } from "react";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";
import { fetchDistributions } from "./api";
import type { ComputeResponse, DistributionConfig } from "./types";
import { DistributionNav } from "./components/DistributionNav";
import { DistributionPage } from "./components/DistributionPage";
import { StatsPanel } from "./components/StatsPanel";

export default function App() {
  const [distributions, setDistributions] = useState<DistributionConfig[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [results, setResults] = useState<ComputeResponse | null>(null);

  useEffect(() => {
    fetchDistributions()
      .then((data) => {
        setDistributions(data);
        if (data.length > 0) setActiveId(data[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setResults(null);
  };

  const activeDistribution = distributions.find((d) => d.id === activeId);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", paddingTop: 100 }}>
        <Loader size="m" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <Text view="alert" size="l">
          Ошибка: {error}
        </Text>
        <Text size="s" style={{ marginTop: 8 }}>
          Убедись, что бэкенд запущен на http://localhost:8001
        </Text>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          minWidth: 260,
          display: "flex",
          flexDirection: "column",
          borderRight: "1px solid var(--color-bg-border)",
          background: "var(--color-bg-secondary)",
        }}
      >
        {/* Navigation section */}
        <div style={{ padding: "16px 0", borderBottom: "1px solid var(--color-bg-border)" }}>
          <Text
            size="l"
            weight="bold"
            style={{ padding: "0 16px", marginBottom: 12 }}
          >
            Статистические распределения
          </Text>
          <DistributionNav
            items={distributions}
            activeId={activeId}
            onSelect={handleSelect}
          />
        </div>

        {/* Stats section */}
        <div style={{ flex: 1, padding: 16, overflow: "auto" }}>
          {results ? (
            <StatsPanel variants={results.variants} />
          ) : (
            <Text size="xs" view="secondary" style={{ fontStyle: "italic" }}>
              Нажми «Сгенерировать», чтобы увидеть статистики
            </Text>
          )}
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {activeDistribution && (
          <DistributionPage
            key={activeDistribution.id}
            config={activeDistribution}
            onResults={setResults}
          />
        )}
      </main>
    </div>
  );
}
