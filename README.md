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
- Role switching wired in header (Analyst ↔ Citizen) → `/api/dashboards?role=...`
- Search dropdown shows document snippets from `/api/search` (debounced 300ms)
- Press Enter triggers `/api/query`; full-width “AI Answer” with provenance
- Charts render Top District Populations from `/api/dashboards` via Recharts
- Monorepo path fixes and Next.js `experimental.externalDir` enabled

Test locally (PowerShell):
- `pnpm dev:web` → open `http://localhost:3000`
- `Invoke-RestMethod 'http://localhost:3000/api/health'`
- `Invoke-RestMethod 'http://localhost:3000/api/search?q=gasabo' | ConvertTo-Json -Depth 4`
- `Invoke-RestMethod 'http://localhost:3000/api/dashboards?role=analyst&region=gasabo' | ConvertTo-Json -Depth 4`
- `Invoke-RestMethod -Method Post -ContentType 'application/json' -Body '{"question":"Population of Gasabo"}' -Uri 'http://localhost:3000/api/query' | ConvertTo-Json -Depth 4`

### 📋 Phase 3: Polish & Demo Ready (PLANNED)
- Entrepreneur view with site recommendations
- Demo polish, error handling, and performance improvements




