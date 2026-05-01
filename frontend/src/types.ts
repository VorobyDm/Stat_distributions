export interface DistributionParam {
  name: string;
  label: string;
  type: "int" | "float";
  default: number;
  min: number;
  max: number;
  step?: number;
  effect: string;
}

export interface DistributionVariant {
  label: string;
  [paramName: string]: number | string;
}

export interface DistributionConfig {
  id: string;
  num: string;
  name: string;
  type: "discrete" | "continuous";
  tagline: string;
  formula: string;
  about: string;
  params: DistributionParam[];
  default_variants: DistributionVariant[];
  examples: string[];
}

export interface VariantStats {
  mean: number;
  variance: number;
  std: number;
  median: number;
  mode: number;
  min: number;
  max: number;
  range: number;
  q25: number;
  q75: number;
  iqr: number;
  skewness: number;
  kurtosis: number;
}

export interface VariantResult {
  label: string;
  samples: number[];
  histogram: { bin_edges: number[]; counts: number[] };
  theoretical: { x: number[]; y: number[] };
  stats: VariantStats;
}

export interface ComputeResponse {
  variants: VariantResult[];
}
