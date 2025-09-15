# Technical Plan

## Architecture overview
- Frontend: Next.js 14 + TypeScript + Tailwind + shadcn/ui (app router)
- Backend: Next.js API routes (with a simple typed layer); optional tRPC later
- Data layer: Local CSV/JSON seeds for MVP; Convex for persistence if/when required
- Search: In-memory index for speed; optional Meilisearch next
- LLM: Gemini 2.5 Flash via adapter with provider switcher
- Auth & billing (future): Clerk for authentication and billing
- Deploy: Vercel (web). Dev runs locally with `.env`.

## Key modules
- UI: Search bar, role dashboards (Analyst, Citizen), entrepreneur view (site selection)
- API: `/api/health`, `/api/ingest`, `/api/search`, `/api/query`, `/api/dashboards`, `/api/tasks`
- ETL: Excel→CSV extraction, CSV→seeded JSON, simple ontology mapping
- Search: Index seeded docs; fast metric path for keywords (population, qty)
- LLM adapter: Build prompt, call Gemini, return `{answer, provenance, tokens, cost}`

## Data model (MVP)
- `districts(id, name, region, population_total)`
- `facilities(id, name, district_id, type)`
- `supplies(id, facility_id, item, quantity, last_updated)`
- `projects(id, name, district_id, budget, status, last_update)`

## Prompts and provenance
System: “Answer only from provided data. Include source name, timestamp, and row link. If missing, say so and suggest next steps.”
Instruction: “Short answer (1–2 sentences), then bullet provenance, then dashboard link.”

## Performance budgets
- Search <1s: in-memory index; small doc set
- NL <10s: Gemini call with 5-doc context, 8s timeout, fallback notice
- Dashboard <3s: prefetch seed data; minimal UI

## Security and data hygiene
- No PII in demo; mask `national_id` if found
- Log ingest and query events; keep artifacts local for demo

## Local development
1) Install deps: `pnpm install`
2) Extract: `pnpm etl:excel` → `data/*.csv`
3) Seed: `pnpm seed` → `data/seeded/*.json`
4) Run: `pnpm dev:web` → open `/` and hit `/api/*`

## Phased delivery
Week 1: scaffold, ETL, seed, health/search/dashboards endpoints
Week 2: LLM adapter + `/api/query` with provenance; onboarding; wire widgets
Week 3: entrepreneur view (top 5 areas), provenance panel, smoke tests, demo polish

## Risks and mitigations
- Excel schema variance → conservative column detection, manual override if needed
- LLM latency/cost → timeout, budget cap, cached fast metrics
- Search infra missing → in-memory fallback
- Future persistence → plan Convex integration (schema/functions) when moving beyond seeds