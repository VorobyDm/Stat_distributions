import type { ComputeResponse, DistributionConfig } from "./types";

const API_BASE = "";

export async function fetchDistributions(): Promise<DistributionConfig[]> {
  const res = await fetch(`${API_BASE}/api/distributions`);
  if (!res.ok) throw new Error("Failed to fetch distributions");
  return res.json();
}

export async function computeDistribution(
  distribution: string,
  variants: Record<string, number | string>[],
  numSamples = 1000,
  numBins = 30
): Promise<ComputeResponse> {
  const res = await fetch(`${API_BASE}/api/compute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      distribution,
      variants,
      num_samples: numSamples,
      num_bins: numBins,
    }),
  });
  if (!res.ok) throw new Error("Failed to compute distribution");
  return res.json();
}
