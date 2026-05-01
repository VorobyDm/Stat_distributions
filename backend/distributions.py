"""Computation functions for all 11 statistical distributions."""

import numpy as np
from scipy import stats


def compute_binomial(params: dict, num_samples: int, num_bins: int) -> dict:
    n, p = params["n"], params["p"]
    samples = stats.binom.rvs(n=n, p=p, size=num_samples).tolist()
    x_theory = np.arange(0, n + 1)
    y_theory = stats.binom.pmf(x_theory, n=n, p=p).tolist()
    bins = np.arange(-0.5, n + 1.5, 1)
    counts, bin_edges = np.histogram(samples, bins=bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_poisson(params: dict, num_samples: int, num_bins: int) -> dict:
    lam = params["lambda"]
    samples = stats.poisson.rvs(mu=lam, size=num_samples).tolist()
    x_max = max(samples) + 1
    x_theory = np.arange(0, x_max + 1)
    y_theory = stats.poisson.pmf(x_theory, mu=lam).tolist()
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
    y_theory = stats.expon.pdf(x_theory, scale=scale).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_weibull(params: dict, num_samples: int, num_bins: int) -> dict:
    k = params["k"]  # shape
    lam = params["lambda"]  # scale
    samples = stats.weibull_min.rvs(c=k, scale=lam, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = stats.weibull_min.pdf(x_theory, c=k, scale=lam).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_gamma(params: dict, num_samples: int, num_bins: int) -> dict:
    k = params["k"]
    theta = params["theta"]
    samples = stats.gamma.rvs(a=k, scale=theta, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = stats.gamma.pdf(x_theory, a=k, scale=theta).tolist()
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
    y_theory = stats.beta.pdf(x_theory, a=a, b=b).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_hypergeometric(params: dict, num_samples: int, num_bins: int) -> dict:
    N = params["N"]
    K = params["K"]
    n = params["n"]
    samples = stats.hypergeom.rvs(M=N, n=K, N=n, size=num_samples).tolist()
    x_theory = np.arange(0, min(K, n) + 1)
    y_theory = stats.hypergeom.pmf(x_theory, M=N, n=K, N=n).tolist()
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
    y_theory = stats.norm.pdf(x_theory, loc=mu, scale=sigma).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_t(params: dict, num_samples: int, num_bins: int) -> dict:
    nu = params["nu"]
    samples = stats.t.rvs(df=nu, size=num_samples).tolist()
    x_theory = np.linspace(min(samples), max(samples), 200)
    y_theory = stats.t.pdf(x_theory, df=nu).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_chi2(params: dict, num_samples: int, num_bins: int) -> dict:
    k = params["k"]
    samples = stats.chi2.rvs(df=k, size=num_samples).tolist()
    x_theory = np.linspace(0.001, max(samples), 200)
    y_theory = stats.chi2.pdf(x_theory, df=k).tolist()
    counts, bin_edges = np.histogram(samples, bins=num_bins, density=True)
    return {
        "samples": samples,
        "histogram": {"bin_edges": bin_edges.tolist(), "counts": counts.tolist()},
        "theoretical": {"x": x_theory.tolist(), "y": y_theory},
    }


def compute_f(params: dict, num_samples: int, num_bins: int) -> dict:
    d1 = params["d1"]
    d2 = params["d2"]
    samples = stats.f.rvs(dfn=d1, dfd=d2, size=num_samples).tolist()
    x_theory = np.linspace(0.001, np.percentile(samples, 99), 200)
    y_theory = stats.f.pdf(x_theory, dfn=d1, dfd=d2).tolist()
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
    "chi2": compute_chi2,
    "f": compute_f,
}

DISTRIBUTION_SCHEMAS = [
    {
        "id": "binomial",
        "num": "01",
        "name": "Биномиальное",
        "type": "discrete",
        "tagline": "Сколько успехов в n независимых испытаниях?",
        "formula": "P(X = k) = C(n,k) · pᵏ · (1−p)ⁿ⁻ᵏ",
        "about": "Модель повторяемого опыта с двумя исходами — успех или неудача. Считает, сколько раз из n попыток выпадет успех, если каждая попытка независима и вероятность успеха одна и та же.",
        "params": [
            {"name": "n", "label": "n — число испытаний", "type": "int", "default": 20, "min": 1, "max": 100,
             "effect": "Растягивает распределение по горизонтали — больше возможных значений k. Среднее = n·p растёт линейно."},
            {"name": "p", "label": "p — вероятность успеха", "type": "float", "default": 0.5, "min": 0.01, "max": 0.99, "step": 0.05,
             "effect": "Сдвигает пик. При p<0.5 хвост уходит вправо, при p>0.5 — влево. При p=0.5 распределение симметрично."},
        ],
        "default_variants": [
            {"label": "n=20, p=0.5", "n": 20, "p": 0.5},
            {"label": "n=20, p=0.25", "n": 20, "p": 0.25},
            {"label": "n=40, p=0.5", "n": 40, "p": 0.5},
        ],
        "examples": [
            "Сколько из 100 писем дойдут до получателя при доставляемости 95%",
            "Сколько из 50 пользователей кликнут на кнопку (CTR = 8%)",
            "A/B-тест: сколько конверсий из N посетителей",
            "Контроль качества: число брака в партии из n деталей",
        ],
    },
    {
        "id": "poisson",
        "num": "02",
        "name": "Пуассон",
        "type": "discrete",
        "tagline": "Число редких событий за фиксированный интервал.",
        "formula": "P(X = k) = (λᵏ · e⁻λ) / k!",
        "about": "Когда событий много, но каждое редкое и независимое от других — Пуассон описывает, сколько их случится за единицу времени или пространства. Среднее и дисперсия равны λ.",
        "params": [
            {"name": "lambda", "label": "λ — интенсивность", "type": "float", "default": 4, "min": 0.1, "max": 50, "step": 0.5,
             "effect": "Среднее число событий за интервал. Чем больше λ, тем правее и шире пик; при λ ≳ 10 распределение становится почти симметричным колоколом."},
        ],
        "default_variants": [
            {"label": "λ = 2", "lambda": 2},
            {"label": "λ = 5", "lambda": 5},
            {"label": "λ = 10", "lambda": 10},
        ],
        "examples": [
            "Звонки в колл-центр за час",
            "Опечатки на странице книги",
            "Землетрясения в регионе за год",
            "Запросы к серверу в секунду",
        ],
    },
    {
        "id": "exponential",
        "num": "03",
        "name": "Экспоненциальное",
        "type": "continuous",
        "tagline": "Время до следующего события в потоке Пуассона.",
        "formula": "f(x) = λ · e⁻λˣ,  x ≥ 0",
        "about": "Описывает интервалы между независимыми событиями, происходящими с постоянной интенсивностью. Главное свойство — отсутствие памяти: вероятность дождаться события не зависит от того, сколько уже ждали.",
        "params": [
            {"name": "lambda", "label": "λ — интенсивность", "type": "float", "default": 1, "min": 0.1, "max": 10, "step": 0.1,
             "effect": "Скорость событий. Среднее время ожидания = 1/λ. При большой λ кривая «прижимается» к нулю — события случаются часто."},
        ],
        "default_variants": [
            {"label": "λ = 0.5", "lambda": 0.5},
            {"label": "λ = 1", "lambda": 1},
            {"label": "λ = 2", "lambda": 2},
        ],
        "examples": [
            "Время до следующего звонка в колл-центр",
            "Срок службы лампочки или электронной детали",
            "Интервал между поездами в метро",
            "Время до следующей покупки в e-commerce",
        ],
    },
    {
        "id": "weibull",
        "num": "04",
        "name": "Вейбулла",
        "type": "continuous",
        "tagline": "Время до отказа: износ, усталость, надёжность.",
        "formula": "f(x) = (k/λ) · (x/λ)ᵏ⁻¹ · e⁻⁽ˣ/λ⁾^k",
        "about": "Гибкая модель времени до отказа. Параметр k показывает, как меняется интенсивность отказов: k<1 — детская смертность (приработка), k=1 — постоянный риск (это экспоненциальное), k>1 — износ нарастает со временем.",
        "params": [
            {"name": "k", "label": "k — форма", "type": "float", "default": 1.5, "min": 0.1, "max": 10, "step": 0.1,
             "effect": "Тип отказа. k<1: чаще ломается новое; k≈1: случайные отказы; k>1: износ. При k≈3.4 форма очень близка к нормальной."},
            {"name": "lambda", "label": "λ — масштаб", "type": "float", "default": 1, "min": 0.1, "max": 10, "step": 0.1,
             "effect": "Характерное время жизни. Растягивает или сжимает распределение по оси x, не меняя форму."},
        ],
        "default_variants": [
            {"label": "k=0.7, λ=1", "k": 0.7, "lambda": 1},
            {"label": "k=1.5, λ=1", "k": 1.5, "lambda": 1},
            {"label": "k=3, λ=1", "k": 3, "lambda": 1},
        ],
        "examples": [
            "Срок службы подшипников и других механических деталей",
            "Скорость ветра на ветроэлектростанциях",
            "Время жизни электронных компонентов",
            "Усталостная прочность материалов",
        ],
    },
    {
        "id": "gamma",
        "num": "05",
        "name": "Гамма",
        "type": "continuous",
        "tagline": "Сумма k независимых экспоненциальных интервалов.",
        "formula": "f(x) = (1 / (Γ(k)·θᵏ)) · xᵏ⁻¹ · e⁻ˣ/θ",
        "about": "Если экспоненциальное — это время до одного события, то Гамма — время до k-го. Универсальная модель положительных величин со «скошенным» хвостом справа.",
        "params": [
            {"name": "k", "label": "k — форма", "type": "float", "default": 2, "min": 0.1, "max": 20, "step": 0.5,
             "effect": "Сколько экспоненциальных интервалов суммируется. При k=1 это экспоненциальное; чем больше k, тем симметричнее становится кривая."},
            {"name": "theta", "label": "θ — масштаб", "type": "float", "default": 1, "min": 0.1, "max": 10, "step": 0.1,
             "effect": "Средняя длительность одного интервала. Среднее всего распределения = k·θ."},
        ],
        "default_variants": [
            {"label": "k=1, θ=2", "k": 1, "theta": 2},
            {"label": "k=3, θ=1", "k": 3, "theta": 1},
            {"label": "k=7, θ=0.5", "k": 7, "theta": 0.5},
        ],
        "examples": [
            "Время до выхода из строя k-й детали",
            "Размер страховых выплат",
            "Размер осадков за период",
            "Длительность болезни от заражения до выздоровления",
        ],
    },
    {
        "id": "beta",
        "num": "06",
        "name": "Бета",
        "type": "continuous",
        "tagline": "Распределение на [0,1]: доли, вероятности, рейтинги.",
        "formula": "f(x) = xᵅ⁻¹·(1−x)ᵝ⁻¹ / B(α,β)",
        "about": "Распределение долей и вероятностей. α можно интерпретировать как «число успехов + 1», β — как «число неудач + 1». Часто используется в байесовской статистике как априорное для вероятности.",
        "params": [
            {"name": "alpha", "label": "α — псевдо-успехи", "type": "float", "default": 2, "min": 0.1, "max": 20, "step": 0.1,
             "effect": "Тянет массу к 1. При α=β распределение симметрично; при α>β пик смещён вправо."},
            {"name": "beta", "label": "β — псевдо-неудачи", "type": "float", "default": 2, "min": 0.1, "max": 20, "step": 0.1,
             "effect": "Тянет массу к 0. Чем больше α+β, тем уже распределение — вы «уверены» в своей оценке."},
        ],
        "default_variants": [
            {"label": "α=2, β=5", "alpha": 2, "beta": 5},
            {"label": "α=2, β=2", "alpha": 2, "beta": 2},
            {"label": "α=5, β=1", "alpha": 5, "beta": 1},
        ],
        "examples": [
            "Конверсия на сайте (доля кликнувших)",
            "Рейтинг товара или фильма (доля положительных)",
            "Доля голосов за кандидата",
            "A/B-тест в байесовской постановке",
        ],
    },
    {
        "id": "hypergeometric",
        "num": "07",
        "name": "Гипергеометрическое",
        "type": "discrete",
        "tagline": "Выборка без возвращения: успехов в k из N.",
        "formula": "P(X=k) = C(K,k)·C(N−K,n−k) / C(N,n)",
        "about": "Биномиальное считает успехи, когда мы возвращаем шар обратно. Гипергеометрическое — когда не возвращаем. Поэтому каждая следующая попытка влияет на следующую: вынул успех — стало меньше успехов в популяции.",
        "params": [
            {"name": "N", "label": "N — размер популяции", "type": "int", "default": 50, "min": 2, "max": 200,
             "effect": "Общее число объектов. При N → ∞ распределение становится биномиальным."},
            {"name": "K", "label": "K — успехов в популяции", "type": "int", "default": 20, "min": 0, "max": 200,
             "effect": "Сколько «успехов» всего. Доля K/N — аналог p в биномиальном."},
            {"name": "n", "label": "n — размер выборки", "type": "int", "default": 10, "min": 1, "max": 200,
             "effect": "Сколько вынимаем. Чем больше n относительно N, тем сильнее эффект «без возвращения»."},
        ],
        "default_variants": [
            {"label": "N=50, K=20, n=10", "N": 50, "K": 20, "n": 10},
            {"label": "N=50, K=10, n=10", "N": 50, "K": 10, "n": 10},
            {"label": "N=50, K=35, n=10", "N": 50, "K": 35, "n": 10},
        ],
        "examples": [
            "Выборочный контроль качества партии",
            "Карточные игры — вероятность собрать комбинацию",
            "Социология: опрос K из N людей с признаком",
            "Лотерея: совпадения номеров",
        ],
    },
    {
        "id": "normal",
        "num": "08",
        "name": "Нормальное",
        "type": "continuous",
        "tagline": "Колокол Гаусса: сумма многих малых независимых шумов.",
        "formula": "f(x) = (1 / (σ√(2π))) · exp(−(x−μ)²/2σ²)",
        "about": "Самое известное распределение. По центральной предельной теореме сумма большого числа независимых случайных величин стремится к нормальному — поэтому оно повсюду в природе и в данных.",
        "params": [
            {"name": "mu", "label": "μ — среднее", "type": "float", "default": 0, "min": -100, "max": 100, "step": 1,
             "effect": "Положение пика. Сдвигает всю кривую влево или вправо без изменения формы."},
            {"name": "sigma", "label": "σ — стд. отклонение", "type": "float", "default": 1, "min": 0.01, "max": 50, "step": 0.1,
             "effect": "Ширина колокола. ±1σ покрывает ≈68% значений, ±2σ ≈95%, ±3σ ≈99.7%."},
        ],
        "default_variants": [
            {"label": "μ=0, σ=1", "mu": 0, "sigma": 1},
            {"label": "μ=0, σ=2", "mu": 0, "sigma": 2},
            {"label": "μ=2, σ=0.7", "mu": 2, "sigma": 0.7},
        ],
        "examples": [
            "Рост, вес, IQ — биометрические признаки",
            "Шум измерений в физике и инженерии",
            "Доходности активов на коротких горизонтах",
            "Ошибки моделей машинного обучения",
        ],
    },
    {
        "id": "t",
        "num": "09",
        "name": "Стьюдент (t)",
        "type": "continuous",
        "tagline": "Похоже на нормальное, но с более тяжёлыми хвостами.",
        "formula": "f(x) ∝ (1 + x²/ν)⁻⁽ᵛ⁺¹⁾/²",
        "about": "Возникает, когда среднее малой выборки делим на оценку стандартного отклонения. Тяжелее хвосты у нормального — то есть «удивительные» значения встречаются чаще, что важно учитывать на маленьких выборках.",
        "params": [
            {"name": "nu", "label": "ν — степени свободы", "type": "int", "default": 5, "min": 1, "max": 100,
             "effect": "Размер выборки минус один. При малых ν хвосты тяжелее; при ν → ∞ распределение совпадает со стандартным нормальным."},
        ],
        "default_variants": [
            {"label": "ν = 1", "nu": 1},
            {"label": "ν = 5", "nu": 5},
            {"label": "ν = 30", "nu": 30},
        ],
        "examples": [
            "t-тест на сравнение средних малых выборок",
            "Доверительные интервалы для среднего",
            "Финансы: моделирование «жирных хвостов» доходностей",
            "Регрессия: проверка значимости коэффициентов",
        ],
    },
    {
        "id": "chi2",
        "num": "10",
        "name": "Хи-квадрат",
        "type": "continuous",
        "tagline": "Сумма квадратов k стандартных нормальных.",
        "formula": "f(x) ∝ x^(k/2−1) · e^(−x/2)",
        "about": "Если сложить квадраты k независимых стандартных нормальных — получится χ². Используется в тестах согласия и оценке дисперсии.",
        "params": [
            {"name": "k", "label": "k — степени свободы", "type": "int", "default": 4, "min": 1, "max": 50,
             "effect": "Число складываемых слагаемых. Среднее = k, дисперсия = 2k. С ростом k форма приближается к нормальной."},
        ],
        "default_variants": [
            {"label": "k = 2", "k": 2},
            {"label": "k = 5", "k": 5},
            {"label": "k = 10", "k": 10},
        ],
        "examples": [
            "χ²-тест на согласие наблюдаемых частот с теоретическими",
            "Тест независимости в таблицах сопряжённости",
            "Доверительные интервалы для дисперсии",
            "Тестирование качества моделей",
        ],
    },
    {
        "id": "f",
        "num": "11",
        "name": "Фишера (F)",
        "type": "continuous",
        "tagline": "Отношение двух нормированных хи-квадрат.",
        "formula": "f(x) ∝ x^(d₁/2−1) · (1 + d₁x/d₂)^−(d₁+d₂)/2",
        "about": "Возникает при сравнении дисперсий двух выборок. Если две группы имеют одинаковую дисперсию, отношение их выборочных дисперсий распределено по F.",
        "params": [
            {"name": "d1", "label": "d₁ — числитель", "type": "int", "default": 5, "min": 1, "max": 100,
             "effect": "Степени свободы числителя (объём первой выборки минус 1)."},
            {"name": "d2", "label": "d₂ — знаменатель", "type": "int", "default": 10, "min": 1, "max": 100,
             "effect": "Степени свободы знаменателя. С ростом d₂ распределение становится уже и симметричнее."},
        ],
        "default_variants": [
            {"label": "d₁=5, d₂=10", "d1": 5, "d2": 10},
            {"label": "d₁=10, d₂=20", "d1": 10, "d2": 20},
            {"label": "d₁=2, d₂=50", "d1": 2, "d2": 50},
        ],
        "examples": [
            "ANOVA — сравнение средних в нескольких группах",
            "Сравнение точности двух измерительных приборов",
            "Тесты значимости регрессионных моделей",
            "Сравнение дисперсий в эксперименте",
        ],
    },
]
