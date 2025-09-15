## Rwanda Government Data Intelligence (MVP)

Quick start for the hackathon MVP. Minimal working slice with docs and planning.

### Docs
- `docs/prd.md` — product requirements and scope
- `docs/demo-script.md` — walkthrough and recording checklist
- `docs/acceptance.md` — acceptance tests and QA

### Next steps
1) Scaffold the app (Next.js + tRPC + Tailwind + shadcn/ui)
2) Create services for ETL, search, and LLM adapter
3) Seed small dataset extracted from provided Excel files
4) Implement endpoints: health, ingest, search, query, dashboards, tasks

### Env
Copy `.env.example` and set values:
```
DATABASE_URL=postgresql://user:pass@localhost:5432/rgdi
MODEL_PROVIDER=gemini
GEMINI_KEY=your_key_here
GEMINI_MODEL=gemini-2.5-flash
SEARCH_URL=http://localhost:7700
UPSTASH_URL=https://global.upstash.io
```

## 🚀 Implementation Progress

### ✅ Phase 1: Foundation (COMPLETED)
- Next.js 14 app with Tailwind v4 and shadcn-style components
- Search interface (icon, loading/provenance placeholders)
- Role dashboard layout with KPI widgets and chart placeholder
- Responsive, Rwanda-themed design system (colors/typography)

### 🔄 Phase 2: Data Integration (IN PROGRESS)
- UI now has tabs: Dashboard, Entrepreneur (flagged), Recent, Settings
- Dashboard renders KPI/Chart/Alerts shells + Key Trends; export buttons visible
- Role selector (Analyst/Citizen) present; UI update is pending binding to response
- Entrepreneur page behind feature flag notice
- Recent shows an empty "Recent Activity" card
- Settings lets you choose role and default region

Back-end wiring status
- Endpoints respond: `/api/dashboards`, `/api/search`, `/api/query`, `/api/health`
- Front-end binding to show live data is partially pending (charts, KPIs)
- Next.js monorepo imports fixed with `experimental.externalDir`

Test locally (PowerShell):
- `pnpm dev:web` → open `http://localhost:3000`
- `Invoke-RestMethod 'http://localhost:3000/api/health'`
- `Invoke-RestMethod 'http://localhost:3000/api/search?q=gasabo' | ConvertTo-Json -Depth 4`
- `Invoke-RestMethod 'http://localhost:3000/api/dashboards?role=analyst&region=gasabo' | ConvertTo-Json -Depth 4`
- `Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"question":"Population of Gasabo"}' -Uri 'http://localhost:3000/api/query' | ConvertTo-Json -Depth 4`

### 📋 Phase 3: Polish & Demo Ready (NEW)

Feature flag:
- Set `NEXT_PUBLIC_FEATURE_ENTREPRENEUR=1` to enable the Entrepreneur page.

Steps to validate:
1) Start dev: `pnpm dev:web` → open `http://localhost:3000`.
2) On first load, a 4‑step onboarding modal appears.
   - Step 2: choose role (Analyst/Citizen)
   - Step 3: set region (e.g., "gasabo")
   - Preferences persist in localStorage; change later via header.
3) AI Answer placement: Ask a query, answer renders full‑width above charts with skeletons and inline error banner if needed.
4) Entrepreneur view: visit `/entrepreneur` (with the feature flag set).
   - Shows “Top 5 underserved areas” table using heuristic population / (supplies + 1)
   - Includes loading skeletons and inline error states.




