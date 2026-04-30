import { useState } from "react";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";
import { computeDistribution } from "../api";
import type { ComputeResponse, DistributionConfig } from "../types";
import { ParamForm } from "./ParamForm";
import { HistogramChart } from "./HistogramChart";
import { SampleTraceChart } from "./SampleTraceChart";

interface Props {
  config: DistributionConfig;
}

export function DistributionPage({ config }: Props) {
  const [variants, setVariants] = useState<Record<string, number>[]>(
    config.default_variants
  );
  const [numSamples, setNumSamples] = useState(1000);
  const [results, setResults] = useState<ComputeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCompute = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await computeDistribution(config.id, variants, numSamples);
      setResults(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка вычисления");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Text size="2xl" weight="bold" style={{ marginBottom: 12 }}>
        {config.name}
      </Text>

      <ParamForm
        params={config.params}
        variants={variants}
        onChange={setVariants}
        numSamples={numSamples}
        onNumSamplesChange={setNumSamples}
        onGenerate={handleCompute}
        loading={loading}
      />

      {error && (
        <Text view="alert" size="s" style={{ marginTop: 8 }}>
          {error}
        </Text>
      )}

      {loading && !results && (
        <div style={{ display: "flex", justifyContent: "center", paddingTop: 40 }}>
          <Loader size="m" />
        </div>
      )}

      {results && (
        <div style={{ marginTop: 16 }}>
          <SampleTraceChart variants={results.variants} />
          <HistogramChart variants={results.variants} />
        </div>
      )}
    </div>
  );
}
