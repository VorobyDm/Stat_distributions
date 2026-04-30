export interface DistributionParam {
  name: string;
  label: string;
  type: "int" | "float";
  default: number;
  min: number;
  max: number;
  step?: number;
}

export interface DistributionConfig {
  id: string;
  name: string;
  type: "discrete" | "continuous";
  params: DistributionParam[];
  default_variants: Record<string, number>[];
}

export interface VariantResult {
  label: string;
  color: string;
  samples: number[];
  histogram: { bin_edges: number[]; counts: number[] };
  theoretical: { x: number[]; y: number[] };
}

export interface ComputeResponse {
  variants: VariantResult[];
}
