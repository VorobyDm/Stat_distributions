# Stat Distributions — Архитектура

Как устроено взаимодействие Frontend и Backend, и как работает анимация.

## 1. Взаимодействие Frontend и Backend

```mermaid
flowchart LR
    subgraph Frontend["Frontend (React + Vite :5173)"]
        UI[UI на Consta UI Kit]
        Charts[Графики на Plotly.js]
        Anim[Анимация progressive reveal]
        Stats[Статистики в сайдбаре]
    end

    subgraph Backend["Backend (FastAPI :8001)"]
        Scipy["scipy.stats — генерация выборок"]
        Theory["scipy.stats — теоретические PDF/PMF"]
        Numpy["numpy — гистограммы, статистики"]
        Funcs["11 функций распределений"]
    end

    Frontend -- "GET /api/distributions" --> Backend
    Frontend -- "POST /api/compute\n{distribution, variants, num_samples}" --> Backend
    Backend -- "JSON: samples[] + theoretical + stats" --> Frontend
```

## 2. Как работает анимация

```mermaid
sequenceDiagram
    participant User as Пользователь
    participant FE as Frontend (React)
    participant BE as Backend (FastAPI)

    User->>FE: Задаёт параметры 3 вариантов
    User->>FE: Нажимает «Сгенерировать»

    FE->>BE: POST /api/compute
    Note right of BE: scipy.stats.*.rvs()<br/>Генерирует ВСЕ N сэмплов сразу
    Note right of BE: scipy.stats.*.pdf()<br/>Считает теоретическую кривую
    Note right of BE: np.histogram() + статистики
    BE-->>FE: JSON: samples[1000], theoretical{x,y}, stats{...}

    FE->>FE: Сохраняет results, step = 0

    loop setInterval(100ms)
        FE->>FE: step += speed (от 1 до 500)
        FE->>FE: samples.slice(0, step)
        Note left of FE: SampleTraceChart:<br/>линии растут слева направо
        Note left of FE: HistogramChart:<br/>бары перестраиваются,<br/>приближаясь к теории
    end

    FE->>FE: step >= totalSamples → стоп
    User->>FE: Видит итоговый результат
```

## 3. Формат данных (API)

### POST /api/compute — Request

```json
{
  "distribution": "binomial",
  "variants": [
    { "n": 20, "p": 0.1 },
    { "n": 20, "p": 0.5 },
    { "n": 20, "p": 0.8 }
  ],
  "num_samples": 1000,
  "num_bins": 30
}
```

### POST /api/compute — Response (per variant)

```json
{
  "label": "Выборка 1",
  "color": "#e53935",
  "samples": [2, 1, 3, 0, ...],           // N случайных значений
  "histogram": {
    "bin_edges": [-0.5, 0.5, 1.5, ...],   // границы бинов
    "counts": [0.12, 0.28, ...]            // density-normalized
  },
  "theoretical": {
    "x": [0, 1, 2, ..., 20],              // точки теоретической кривой
    "y": [0.12, 0.27, ...]                // PMF или PDF
  },
  "stats": {
    "mean": 2.01,
    "variance": 1.82,
    "std": 1.35,
    "median": 2.0,
    "min": 0.0,
    "max": 7.0
  }
}
```

## 4. Дерево компонентов React

```mermaid
graph TD
    App["App — layout, загрузка списка"]
    App --> Nav["DistributionNav — навигация (11 кнопок)"]
    App --> StatsPanel["StatsPanel — статистики 3 выборок"]
    App --> Page["DistributionPage — основная страница, state анимации"]
    Page --> Form["ParamForm — параметры + размер выборки + анимация"]
    Page --> Trace["SampleTraceChart — линейный график выборок"]
    Page --> Hist["HistogramChart — гистограмма + теоретическая кривая"]

    style App fill:#e8f4fd,stroke:#4a9fd5,color:#1a1a2e
    style Nav fill:#eafaf1,stroke:#43a047,color:#1a1a2e
    style StatsPanel fill:#eafaf1,stroke:#43a047,color:#1a1a2e
    style Page fill:#e8f4fd,stroke:#4a9fd5,color:#1a1a2e
    style Form fill:#fff3e0,stroke:#fb8c00,color:#1a1a2e
    style Trace fill:#fce4ec,stroke:#e53935,color:#1a1a2e
    style Hist fill:#fce4ec,stroke:#e53935,color:#1a1a2e
```

## 5. Потоки данных в анимации

```mermaid
stateDiagram-v2
    [*] --> Idle: Страница загружена

    Idle --> Loading: Нажата «Сгенерировать»
    Loading --> Animating: Backend вернул данные<br/>step=0, playing=true

    Animating --> Animating: setInterval(100ms)<br/>step += speed
    Animating --> Paused: Нажата «Пауза»
    Animating --> Done: step >= totalSamples

    Paused --> Animating: Нажата «Старт»
    Paused --> Paused: Перемотка слайдером

    Done --> Animating: Нажата «Сначала»
    Done --> Loading: Нажата «Сгенерировать»
```
