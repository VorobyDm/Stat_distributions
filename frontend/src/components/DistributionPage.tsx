import { useCallback, useEffect, useRef, useState } from "react";
import { Text } from "@consta/uikit/Text";
import { Loader } from "@consta/uikit/Loader";
import { computeDistribution } from "../api";
import type { ComputeResponse, DistributionConfig, VariantResult } from "../types";
import { ParamForm } from "./ParamForm";
import { HistogramChart } from "./HistogramChart";
import { SampleTraceChart } from "./SampleTraceChart";

interface Props {
  config: DistributionConfig;
}

function sliceVariants(variants: VariantResult[], step: number): VariantResult[] {
  return variants.map((v) => ({
    ...v,
    samples: v.samples.slice(0, step),
  }));
}

export function DistributionPage({ config }: Props) {
  const [variants, setVariants] = useState<Record<string, number>[]>(
    config.default_variants
  );
  const [numSamples, setNumSamples] = useState(1000);
  const [results, setResults] = useState<ComputeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Animation state
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50); // samples per tick
  const intervalRef = useRef<number | null>(null);

  const totalSamples = results?.variants[0]?.samples.length ?? 0;

  const stopAnimation = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();
    setPlaying(true);
  }, [stopAnimation]);

  // Interval effect — runs when playing or speed changes
  useEffect(() => {
    if (!playing || totalSamples === 0) return;

    intervalRef.current = window.setInterval(() => {
      setStep((prev) => {
        const next = prev + speed;
        if (next >= totalSamples) {
          // Will stop in next effect cycle
          return totalSamples;
        }
        return next;
      });
    }, 100); // 100ms between ticks = 10 fps

    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [playing, speed, totalSamples]);

  // Stop when reached the end
  useEffect(() => {
    if (step >= totalSamples && totalSamples > 0) {
      stopAnimation();
    }
  }, [step, totalSamples, stopAnimation]);

  const handleCompute = async () => {
    stopAnimation();
    setLoading(true);
    setError("");
    try {
      const data = await computeDistribution(config.id, variants, numSamples);
      setResults(data);
      setStep(0);
      // Auto-start animation after generation
      setTimeout(() => setPlaying(true), 100);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка вычисления");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayPause = () => {
    if (playing) {
      stopAnimation();
    } else {
      if (step >= totalSamples) setStep(0); // restart if at end
      startAnimation();
    }
  };

  const visibleVariants = results ? sliceVariants(results.variants, step) : null;

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
        // Animation controls
        showAnimation={results !== null}
        playing={playing}
        onPlayPause={handlePlayPause}
        speed={speed}
        onSpeedChange={setSpeed}
        step={step}
        onStepChange={(v) => { stopAnimation(); setStep(v); }}
        totalSamples={totalSamples}
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

      {visibleVariants && (
        <div style={{ marginTop: 16 }}>
          <SampleTraceChart
            variants={visibleVariants}
            totalSamples={totalSamples}
          />
          <HistogramChart
            variants={visibleVariants}
            allVariants={results!.variants}
            discrete={config.type === "discrete"}
          />
        </div>
      )}
    </div>
  );
}
