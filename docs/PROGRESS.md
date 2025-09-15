# Project Progress — Rwanda Government Data Intelligence (RGDI)

Last updated: 2025-09-15

## What we’re building
A unified platform where anyone can ask questions about Rwanda and get fast, trusted answers with visuals and source links. MVP focuses on two personas (Analyst, Citizen) and demonstrates an entrepreneur site‑selection scenario for Gasabo. Performance targets: search <1s, NL answer <10s, dashboard <3s.

See also: `docs/01-specify.md`, `docs/02-plan.md`, `docs/03-tasks.md`, `docs/README.md`.

## Decisions and setup
- Personas: Analyst, Citizen (entrepreneur scenario showcased via NL path)
- Model provider: Gemini 2.5 Flash (adapter supports provider switch)
- Data for MVP: `2016_Annual_Statistical_booklets_V9_08_03_2018.xlsx`, `Gasabo.xlsx` → derived CSVs/JSON
- Ontology (MVP): `districts`, `facilities`, `supplies`, `projects`
- Performance targets enforced in docs and design

## Repo structure (current)
- `apps/web` — Next.js 14 app (app router)
  - `app/` minimal layout and landing page
  - `pages/api/` endpoints: `health`, `ingest`, `search`, `query`, `dashboards`, `tasks`
- `services/`
  - `etl/excel_to_csv.ts` — extract Excel→CSV
  - `etl/seed.ts` — CSV→`data/seeded/*.json`
  - `search/index.ts` — in-memory index and query
  - `llm/adapter.ts` — Gemini adapter returning `{answer, provenance}`
- `data/` — generated: `nirs_population.csv`, `ministry_supplies.csv`
- `data/seeded/` — generated: `populations.json`, `supplies.json`
- `docs/` — core documentation (spec, plan, tasks, overview, progress)

## Implemented so far
- Monorepo config: `package.json` (workspaces), `pnpm-workspace.yaml`
- Next.js app scaffold with health endpoint and landing page
- API endpoints (runnable):
  - `GET /api/health` → `{status: 'ok'}`
  - `POST /api/ingest` → runs Excel→CSV extraction
  - `GET /api/search` → in-memory index over seeded JSON
  - `POST /api/query` → Gemini adapter (env‑driven), returns `{answer, provenance}`
  - `GET /api/dashboards` → 3 widget stubs (KPI, chart, alerts)
  - `GET/POST /api/tasks` → in‑memory tasks
- ETL + Seed:
  - Extracted CSVs from provided Excel files into `data/`
  - Generated JSON seeds in `data/seeded/`
- Dev environment:
  - `pnpm` installed, workspaces resolved, server runs
  - Health endpoint verified at `http://localhost:3000/api/health`
- Documentation:
  - Rewrote normal docs: specification, plan, tasks, overview (README)
  - This progress log

## What remains (near term)
- UI scaffold:
  - Add Tailwind + shadcn/ui
  - Build role dashboards (Analyst, Citizen): 3 widgets each wired to seeded data
  - Entrepreneur view: show top 5 underserved areas (table/map stub) with provenance
- Onboarding flow (4 questions) and persisted defaults
- Tests:
  - ETL mapping unit tests; search smoke; NL response schema
- Optional infra:
  - Provider budget cap, timeout messaging; Meili wrapper; Postgres migrations and seed

## How to run locally
1. Install: `pnpm install`
2. Extract: `pnpm etl:excel` → `data/*.csv`
3. Seed: `pnpm seed` → `data/seeded/*.json`
4. Dev: `pnpm dev:web` → open `/` and `/api/health`

## Env (demo)
- `MODEL_PROVIDER=gemini`
- `GEMINI_KEY=...`
- `GEMINI_MODEL=gemini-2.5-flash`

## Notes and caveats
- Search is in‑memory; adequate for seeded demo size
- NL answers rely on environment key; in dev, prefer mock or low‑cost settings
- Excel column heuristics may need minor adjustments per sheet naming
- Persistence: if needed post‑MVP, we will adopt Convex for DB/state
- Auth & billing: future integration with Clerk

## Acceptance targets (MVP)
- Dashboard load <3s on 3G throttle
- Search metric <1s on seeded data
- NL answer + provenance JSON <10s
- Onboarding stores defaults
- Analyst can upload a CSV and publish a dashboard in <10 minutes
