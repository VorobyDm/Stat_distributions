"""FastAPI backend for statistical distributions visualization."""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from distributions import DISTRIBUTIONS, DISTRIBUTION_SCHEMAS

app = FastAPI(title="Stat Distributions API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

VARIANT_COLORS = ["#e53935", "#43a047", "#1e88e5"]


class ComputeRequest(BaseModel):
    distribution: str
    variants: list[dict]
    num_samples: int = 1000
    num_bins: int = 30


@app.get("/api/distributions")
def get_distributions():
    return DISTRIBUTION_SCHEMAS


@app.post("/api/compute")
def compute(request: ComputeRequest):
    if request.distribution not in DISTRIBUTIONS:
        raise HTTPException(status_code=400, detail=f"Unknown distribution: {request.distribution}")

    compute_fn = DISTRIBUTIONS[request.distribution]
    results = []

    for i, variant_params in enumerate(request.variants):
        result = compute_fn(variant_params, request.num_samples, request.num_bins)
        result["label"] = f"Выборка {i + 1}"
        result["color"] = VARIANT_COLORS[i % len(VARIANT_COLORS)]
        results.append(result)

    return {"variants": results}
