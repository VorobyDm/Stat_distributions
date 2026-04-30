"""Computation functions for all 11 statistical distributions."""

import numpy as np
from scipy import stats



def compute_binomial(params: dict, num_samples: int, num_bins: int) -> dict:
    n, p = params["n"], params["p"]
    samples = stats.binom.rvs(n=n, p=p, size=num_samples).tolist()
    x_theory = np.arange(0, n + 1)
    y_theory = (stats.binom.pmf(x_theory, n=n, p=p).tolist())
    # Integer bins for discrete distribution (width=1)
    bins = np.arange(-0.5, n + 1.5, 1)
    counts, bin_edges = np.histogram(samples, bins=bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_poisson(params: dict, num_samples: int, num_bins: int) -> dict:
    mu = params["mu"]
    samples = stats.poisson.rvs(mu=mu, size=num_samples).tolist()
    x_max = max(samples) + 1
    x_theory = np.arange(0, x_max + 1)
    y_theory = (stats.poisson.pmf(x_theory, mu=mu).tolist())
    # Integer bins for discrete distribution (width=1)
    bins = np.arange(-0.5, x_max + 1.5, 1)
    counts, bin_edges = np.histogram(samples, bins=bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_exponential(params: dict, num_samples: int, num_bins: int) -> dict:
    lam = params["lambda"]
    scale = 1.0 / lam
    samples = stats.expon.rvs(scale=scale, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = (stats.expon.pdf(x_theory, scale=scale).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_weibull(params: dict, num_samples: int, num_bins: int) -> dict:
    beta = params["beta"]  # shape
    lam = params["lambda"]  # scale
    samples = stats.weibull_min.rvs(c=beta, scale=lam, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = (stats.weibull_min.pdf(x_theory, c=beta, scale=lam).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_gamma(params: dict, num_samples: int, num_bins: int) -> dict:
    k = params["k"]  # shape
    theta = params["theta"]  # scale
    samples = stats.gamma.rvs(a=k, scale=theta, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = (stats.gamma.pdf(x_theory, a=k, scale=theta).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_beta(params: dict, num_samples: int, num_bins: int) -> dict:
    a = params["alpha"]
    b = params["beta"]
    samples = stats.beta.rvs(a=a, b=b, size=num_samples).tolist()
    x_theory = np.linspace(0.001, 0.999, 200)
    y_theory = (stats.beta.pdf(x_theory, a=a, b=b).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_hypergeometric(params: dict, num_samples: int, num_bins: int) -> dict:
    N = params["N"]  # population size
    K = params["K"]  # success states in population
    n = params["n"]  # draws
    samples = stats.hypergeom.rvs(M=N, n=K, N=n, size=num_samples).tolist()
    x_theory = np.arange(0, min(K, n) + 1)
    y_theory = (stats.hypergeom.pmf(x_theory, M=N, n=K, N=n).tolist())
    # Integer bins for discrete distribution (width=1)
    bins = np.arange(-0.5, min(K, n) + 1.5, 1)
    counts, bin_edges = np.histogram(samples, bins=bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_normal(params: dict, num_samples: int, num_bins: int) -> dict:
    mu = params["mu"]
    sigma = params["sigma"]
    samples = stats.norm.rvs(loc=mu, scale=sigma, size=num_samples).tolist()
    x_theory = np.linspace(min(samples), max(samples), 200)
    y_theory = (stats.norm.pdf(x_theory, loc=mu, scale=sigma).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_t(params: dict, num_samples: int, num_bins: int) -> dict:
    df = params["df"]
    samples = stats.t.rvs(df=df, size=num_samples).tolist()
    x_theory = np.linspace(min(samples), max(samples), 200)
    y_theory = (stats.t.pdf(x_theory, df=df).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_chi_squared(params: dict, num_samples: int, num_bins: int) -> dict:
    k = params["k"]
    samples = stats.chi2.rvs(df=k, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = (stats.chi2.pdf(x_theory, df=k).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_f(params: dict, num_samples: int, num_bins: int) -> dict:
    dfn = params["dfn"]
    dfd = params["dfd"]
    samples = stats.f.rvs(dfn=dfn, dfd=dfd, size=num_samples).tolist()
    x_theory = np.linspace(0.001, np.percentile(samples, 99), 200)
    y_theory = (stats.f.pdf(x_theory, dfn=dfn, dfd=dfd).tolist())
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


DISTRIBUTIONS = {
    "binomial": compute_binomial,
    "poisson": compute_poisson,
    "exponential": compute_exponential,
    "weibull": compute_weibull,
    "gamma": compute_gamma,
    "beta": compute_beta,
    "hypergeometric": compute_hypergeometric,
    "normal": compute_normal,
    "t": compute_t,
    "chi_squared": compute_chi_squared,
    "f": compute_f,
}

DISTRIBUTION_SCHEMAS = [
    {
        "id": "binomial",
        "name": "Биномиальное B(n, p)",
        "type": "discrete",
        "params": [
            {"name": "n", "label": "n (испытания)", "type": "int", "default": 20, "min": 1, "max": 200},
            {"name": "p", "label": "p (вероятность)", "type": "float", "default": 0.5, "min": 0.01, "max": 0.99, "step": 0.05},
        ],
        "default_variants": [{"n": 20, "p": 0.1}, {"n": 20, "p": 0.5}, {"n": 20, "p": 0.8}],
    },
    {
        "id": "poisson",
        "name": "Пуассона Pois(μ)",
        "type": "discrete",
        "params": [
            {"name": "mu", "label": "μ (среднее)", "type": "float", "default": 5, "min": 0.1, "max": 100, "step": 0.5},
        ],
        "default_variants": [{"mu": 1}, {"mu": 5}, {"mu": 10}],
    },
    {
        "id": "exponential",
        "name": "Экспоненциальное Exp(λ)",
        "type": "continuous",
        "params": [
            {"name": "lambda", "label": "λ (интенсивность)", "type": "float", "default": 1, "min": 0.1, "max": 10, "step": 0.1},
        ],
        "default_variants": [{"lambda": 0.5}, {"lambda": 1}, {"lambda": 2}],
    },
    {
        "id": "weibull",
        "name": "Вейбулла W(β, λ)",
        "type": "continuous",
        "params": [
            {"name": "beta", "label": "β (форма)", "type": "float", "default": 1.5, "min": 0.1, "max": 10, "step": 0.1},
            {"name": "lambda", "label": "λ (масштаб)", "type": "float", "default": 1, "min": 0.1, "max": 10, "step": 0.1},
        ],
        "default_variants": [{"beta": 0.9, "lambda": 1}, {"beta": 1.5, "lambda": 1}, {"beta": 3.0, "lambda": 1}],
    },
    {
        "id": "gamma",
        "name": "Гамма Γ(k, θ)",
        "type": "continuous",
        "params": [
            {"name": "k", "label": "k (форма)", "type": "float", "default": 2, "min": 0.1, "max": 20, "step": 0.5},
            {"name": "theta", "label": "θ (масштаб)", "type": "float", "default": 2, "min": 0.1, "max": 10, "step": 0.1},
        ],
        "default_variants": [{"k": 1, "theta": 2}, {"k": 2, "theta": 2}, {"k": 3, "theta": 2}],
    },
    {
        "id": "beta",
        "name": "Бета Beta(α, β)",
        "type": "continuous",
        "params": [
            {"name": "alpha", "label": "α (форма 1)", "type": "float", "default": 2, "min": 0.1, "max": 20, "step": 0.1},
            {"name": "beta", "label": "β (форма 2)", "type": "float", "default": 5, "min": 0.1, "max": 20, "step": 0.1},
        ],
        "default_variants": [{"alpha": 0.5, "beta": 0.5}, {"alpha": 2, "beta": 4}, {"alpha": 1, "beta": 9}],
    },
    {
        "id": "hypergeometric",
        "name": "Гипергеометрическое H(N, K, n)",
        "type": "discrete",
        "params": [
            {"name": "N", "label": "N (популяция)", "type": "int", "default": 52, "min": 2, "max": 500},
            {"name": "K", "label": "K (успехов в популяции)", "type": "int", "default": 8, "min": 1, "max": 250},
            {"name": "n", "label": "n (выборка)", "type": "int", "default": 10, "min": 1, "max": 250},
        ],
        "default_variants": [{"N": 52, "K": 8, "n": 5}, {"N": 52, "K": 8, "n": 15}, {"N": 52, "K": 8, "n": 25}],
    },
    {
        "id": "normal",
        "name": "Нормальное N(μ, σ)",
        "type": "continuous",
        "params": [
            {"name": "mu", "label": "μ (среднее)", "type": "float", "default": 0, "min": -100, "max": 100, "step": 1},
            {"name": "sigma", "label": "σ (стд. откл.)", "type": "float", "default": 1, "min": 0.1, "max": 50, "step": 0.1},
        ],
        "default_variants": [{"mu": 0, "sigma": 1}, {"mu": 0, "sigma": 2}, {"mu": 2, "sigma": 1}],
    },
    {
        "id": "t",
        "name": "Стьюдента t(df)",
        "type": "continuous",
        "params": [
            {"name": "df", "label": "df (степени свободы)", "type": "int", "default": 5, "min": 1, "max": 200},
        ],
        "default_variants": [{"df": 2}, {"df": 5}, {"df": 30}],
    },
    {
        "id": "chi_squared",
        "name": "Хи-квадрат χ²(k)",
        "type": "continuous",
        "params": [
            {"name": "k", "label": "k (степени свободы)", "type": "int", "default": 3, "min": 1, "max": 50},
        ],
        "default_variants": [{"k": 2}, {"k": 3}, {"k": 8}],
    },
    {
        "id": "f",
        "name": "Фишера F(dfn, dfd)",
        "type": "continuous",
        "params": [
            {"name": "dfn", "label": "dfn (ст. св. числителя)", "type": "int", "default": 5, "min": 1, "max": 100},
            {"name": "dfd", "label": "dfd (ст. св. знаменателя)", "type": "int", "default": 10, "min": 1, "max": 100},
        ],
        "default_variants": [{"dfn": 1, "dfd": 9}, {"dfn": 2, "dfd": 4}, {"dfn": 3, "dfd": 5}],
    },
]
