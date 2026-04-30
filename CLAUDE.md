# Statistical Distributions Visualizer

Web-application for interactive visualization of statistical distributions.
Reimplementation of `Stat_distributions/` Python scripts as a modern web app.

## Tech Stack

- **Backend**: FastAPI (Python 3.13), scipy, numpy
- **Frontend**: React 18 + TypeScript, Vite, Consta UI Kit (@consta/uikit), react-plotly.js
- **No Redux, no React Router** — useState + props, tab switching

## Project Structure

```
demo/
  Stat_distributions/    # original Python scripts (read-only reference)
  backend/               # FastAPI app
    main.py              # app entry, CORS, endpoints
    distributions.py     # computation functions (one per distribution)
    requirements.txt
  frontend/              # React app (Vite)
    src/
      main.tsx           # entry point, Consta Theme
      App.tsx            # layout + navigation
      api.ts             # fetch wrapper
      types.ts           # TypeScript types
      components/        # UI components
      distributions/     # distribution configs (params, defaults)
```

## Running

```bash
# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## API

- `POST /api/compute` — compute distribution samples + theoretical curves
- `GET /api/distributions` — list available distributions with param schemas

## Code Style

- Simple functions, no unnecessary classes or abstractions
- KISS, YAGNI
- English in code/comments, Russian in UI labels and documentation
