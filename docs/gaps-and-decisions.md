## Gaps and Decisions — Rwanda Government Data Intelligence

Last updated: 2025-09-26

### Scope
This note captures missing pieces, out-of-scope-but-needed items, duplications, and decisions to align the MVP with the long‑term goal (central, intelligent interface over government data — not just a chatbot).

### High‑priority gaps (MVP viability)
- API duplication: Two backends exist in parallel
  - Next.js `pages/api/*` (TypeScript)
  - `backend/` Express server (JavaScript)
  Decision: unify on one API layer (recommend Next.js for deploy simplicity), or keep Express behind a single gateway. Avoid dual sources of truth.

- LLM adapter duplication and env mismatch
  - `services/llm/adapter.ts` (uses `GEMINI_KEY`, `MODEL_PROVIDER`)
  - `backend/src/llm/geminiAdapter.js` (uses `GEMINI_API_KEY`)
  Decision: keep the TypeScript adapter; remove/port Express adapter. Normalize env naming.

- Search duplication and capability
  - `services/search/index.ts`: simple substring scoring
  - `backend/src/search/indexer.js`: FlexSearch with field store and provenance map
  Decision: standardize on FlexSearch (short‑term) or adopt Meilisearch/pgvector later. Provide one query API.

- ETL duplication
  - `services/etl/excel_to_csv.ts` (Next.js ingest path)
  - `backend/src/etl/*` (Express ingest path with multer)
  Decision: consolidate ETL in `services/etl/` and have one ingest API. If file uploads are required, implement upload handling in the unified API.

- Provenance completeness
  - Current answer includes dataset/timestamp; record links and row IDs are inconsistent.
  Need: stable record identifiers, direct row links (file + line or persisted ID), and confidence/explanation.

- Data persistence
  - All indexes/seeds are transient; no DB.
  Decision: for MVP demo keep in‑memory with seeds; for next phase, plan Postgres + pgvector or Meilisearch; define schemas.

### Product and UX gaps
- Auth and roles
  - No signup/login; role/region stored in localStorage only.
  Decisions: add Clerk/Auth.js post‑MVP; define roles/permissions (Analyst, Citizen, Admin).

- Admin/data ops
  - Missing admin dashboard for datasets (catalog, upload, mapping preview, reindex, health).
  - No dataset metadata model (source, update cadence, owner, license, schema).

- Onboarding
  - UI shell present; flow and persistence not fully wired. Should feed defaults into dashboards and search.

- Help and guidance
  - No help/FAQ, prompt examples, or walkthrough.

- Exports
  - Buttons stubbed; implement PDF/CSV exports with provenance section.

### Engineering and platform gaps
- Observability and operations
  - No structured logging, metrics, tracing, or error tracking. No rate limiting.
  Decision: add minimal logging + Sentry for FE/BE; add simple request budget caps.

- Testing and CI/CD
  - No automated tests or CI. Add smoke tests for ETL mapping, search results, query schema, and API health. Wire GitHub Actions.

- Security and data hygiene
  - PII masking mentioned, not implemented. Add guardrails in ETL, ingestion validation, and output filters.

- Performance budgets
  - Targets documented; no automated checks. Add simple perf assertions in tests and dashboard prefetching/caching.

### Not originally planned (but recommended)
- Dataset catalog UI and API (browse datasets, schema, freshness, owner)
- Source lineage and refresh jobs (cron or webhook)
- Access control per dataset (public/internal/restricted)
- Feature flag service for experimental pages
- Background workers/queues if ingestion grows (BullMQ/Cloud Tasks)

### Keep
- Next.js app router + React Query + shadcn UI
- In‑memory seeds for a fast, demoable slice
- FlexSearch (or similar) as short‑term search while scoping proper retrieval
- Entrepreneur page behind a feature flag

### Cut or consolidate now
- Dual backends (Express and Next.js APIs) — pick one
- Duplicate LLM/search/ETL implementations — unify in `services/*`
- Unused DB/env hints in README until a real DB is introduced

### Rethink
- Retrieval approach: move from keyword search to lightweight RAG (vector store or reranker)
- Provenance model: design first‑class provenance objects with stable IDs and deep links
- API boundary: consider keeping all APIs in Next.js route handlers for Vercel deploy; re‑introduce a separate service only if needed

### Proposed near‑term plan (1–2 days)
1) Unify APIs in Next.js; remove `backend/` from the demo path
2) Standardize LLM adapter (`services/llm/adapter.ts`), normalize env vars
3) Use one search implementation (prefer FlexSearch) via a single `/api/search`
4) Consolidate ETL in `services/etl`, wire `/api/ingest` to generate seeds + index
5) Enrich provenance with recordId and file link; show in UI panel
6) Add smoke tests + GitHub Actions; add Sentry (optional)

### Open decisions
- Production search: Meilisearch vs Postgres+pgvector
- Auth provider: Clerk vs Auth.js; role/permission model depth
- Deployment: single Next.js app vs split services; data persistence timeline


