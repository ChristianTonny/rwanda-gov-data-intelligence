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




