# Stat Lab — Statistical Distributions Visualizer

Interactive web application for exploring 11 common probability distributions
(binomial, Poisson, exponential, Weibull, gamma, beta, hypergeometric, normal,
Student's t, chi-squared, F). Pick a distribution, switch between three preset
variants, drag the parameter sliders and watch the PDF/PMF curve, the
histogram of generated samples, and the descriptive statistics update.

## Tech stack

- **Backend:** FastAPI (Python 3.13), NumPy, SciPy
- **Frontend:** React 19 + TypeScript, Vite, hand-rolled SVG charts
- **No state library, no router** — single-screen app, plain `useState` + props

## Running locally

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8001

# Frontend
cd frontend
npm install
npm run dev
```

Open http://localhost:5173.

## Project layout

```
demo/
  backend/                 FastAPI app
    main.py                entry point, CORS, /api endpoints
    distributions.py       per-distribution compute functions + schemas
    requirements.txt
  frontend/                React app (Vite)
    src/
      main.tsx             entry point
      App.tsx              layout + state
      api.ts               fetch wrapper
      types.ts             TypeScript types
      components/          UI components (Sidebar, Stage, DistChart, DataTable)
  Stat_distributions/      original Python reference scripts (read-only)
  design_handoff_stat_lab/ design tokens, screenshots, HTML prototype
  docs/                    architecture notes
```

## API

- `GET  /api/distributions` — list of distributions with metadata, params, default variants, examples
- `POST /api/compute` — for the given distribution and three variants returns samples, histogram, theoretical curve and stats

## Acknowledgements

The set of distributions and the educational angle of this project were inspired by
**Nail Sharipov's** Habr article and the accompanying Python reference scripts:

- Article (Russian): <https://habr.com/ru/articles/801101>
- Reference code: included in [`Stat_distributions/`](./Stat_distributions/), MIT License © Nail Sharipov

Our backend is a fresh implementation on top of `scipy.stats`, not a port of
those scripts, but the original work was the starting point for the catalogue
and many of the worked examples.

## License

This project is released under the [MIT License](./LICENSE) © Dmitry Vorobyev.
The reference scripts in `Stat_distributions/` retain their original MIT
license © Nail Sharipov.
