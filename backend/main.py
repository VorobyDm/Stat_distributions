"""FastAPI backend for statistical distributions visualization."""

import os
from collections import Counter

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from scipy import stats as scipy_stats

from distributions import DISTRIBUTIONS, DISTRIBUTION_SCHEMAS

app = FastAPI(title="Stat Distributions API")

# CORS origins come from env so prod and dev have different lists.
# Comma-separated list, e.g. "https://ungservice.com,http://localhost:5173".
_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174")
ALLOWED_ORIGINS = [o.strip() for o in _origins_env.split(",") if o.strip()]

# Regex covers Netlify previews (xxxx--site.netlify.app) and main subdomains.
# Override via ALLOWED_ORIGIN_REGEX env if needed.
ALLOWED_ORIGIN_REGEX = os.getenv(
    "ALLOWED_ORIGIN_REGEX",
    r"https://([a-z0-9-]+\.)?(netlify\.app|ungservice\.com)",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=ALLOWED_ORIGIN_REGEX,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


class ComputeRequest(BaseModel):
    distribution: str
    variants: list[dict]
    num_samples: int = Field(default=500, ge=10, le=10000)
    num_bins: int = Field(default=30, ge=5, le=100)


@app.get("/health")
def health():
    return {"status": "ok"}


def compute_stats(samples: list, discrete: bool) -> dict:
    arr = np.array(samples, dtype=float)
    mean = float(np.mean(arr))
    variance = float(np.var(arr))
    std = float(np.std(arr))
    median = float(np.median(arr))
    q25 = float(np.percentile(arr, 25))
    q75 = float(np.percentile(arr, 75))
    sample_min = float(np.min(arr))
    sample_max = float(np.max(arr))
    skewness = float(scipy_stats.skew(arr))
    kurtosis = float(scipy_stats.kurtosis(arr))  # excess kurtosis

    # Mode: for discrete — most frequent integer; for continuous — middle of densest bin
    if discrete:
        rounded = [int(round(s)) for s in samples]
        mode_val = float(Counter(rounded).most_common(1)[0][0])
    else:
        counts, edges = np.histogram(arr, bins=20)
        idx = int(np.argmax(counts))
        mode_val = float((edges[idx] + edges[idx + 1]) / 2)

    return {
        "mean": round(mean, 3),
        "variance": round(variance, 3),
        "std": round(std, 3),
        "median": round(median, 3),
        "mode": round(mode_val, 3),
        "min": round(sample_min, 3),
        "max": round(sample_max, 3),
        "range": round(sample_max - sample_min, 3),
        "q25": round(q25, 3),
        "q75": round(q75, 3),
        "iqr": round(q75 - q25, 3),
        "skewness": round(skewness, 3),
        "kurtosis": round(kurtosis, 3),
    }


@app.get("/api/distributions")
def get_distributions():
    return DISTRIBUTION_SCHEMAS


@app.post("/api/compute")
def compute(request: ComputeRequest):
    if request.distribution not in DISTRIBUTIONS:
        raise HTTPException(status_code=400, detail=f"Unknown distribution: {request.distribution}")

    schema = next((d for d in DISTRIBUTION_SCHEMAS if d["id"] == request.distribution), None)
    discrete = schema["type"] == "discrete" if schema else False

    compute_fn = DISTRIBUTIONS[request.distribution]
    results = []

    for i, variant in enumerate(request.variants):
        # Variant may include label + numeric params; pass only params to compute_fn
        params = {k: v for k, v in variant.items() if k != "label"}
        result = compute_fn(params, request.num_samples, request.num_bins)
        result["label"] = variant.get("label", f"Вариант {i + 1}")
        result["stats"] = compute_stats(result["samples"], discrete)
        results.append(result)

    return {"variants": results}
