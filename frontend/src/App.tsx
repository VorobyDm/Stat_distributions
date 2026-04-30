import { useEffect, useState } from "react";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";
import { fetchDistributions } from "./api";
import type { DistributionConfig } from "./types";
import { DistributionNav } from "./components/DistributionNav";
import { DistributionPage } from "./components/DistributionPage";

export default function App() {
  const [distributions, setDistributions] = useState<DistributionConfig[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDistributions()
      .then((data) => {
        setDistributions(data);
        if (data.length > 0) setActiveId(data[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

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
          Убедись, что бэкенд запущен на http://localhost:8000
        </Text>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <aside
        style={{
          width: 280,
          minWidth: 280,
          borderRight: "1px solid var(--color-bg-border)",
          padding: "20px 0",
          background: "var(--color-bg-secondary)",
        }}
      >
        <Text
          size="xl"
          weight="bold"
          style={{ padding: "0 16px", marginBottom: 16 }}
        >
          Распределения
        </Text>
        <DistributionNav
          items={distributions}
          activeId={activeId}
          onSelect={setActiveId}
        />
      </aside>
      <main style={{ flex: 1, padding: 24, overflow: "auto" }}>
        {activeDistribution && (
          <DistributionPage
            key={activeDistribution.id}
            config={activeDistribution}
          />
        )}
      </main>
    </div>
  );
}
