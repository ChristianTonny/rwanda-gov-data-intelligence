# Tasks — Phased Breakdown

Scope: deliver a demo-ready MVP in 2–3 weeks with fast search, NL answers with provenance, and role dashboards using two small datasets.

## Phase 1 — Foundation (Week 1)
1. Initialize repo structure and Next.js app (app router, TS, Tailwind, shadcn/ui)
2. Add API routes: `health`, `ingest`, `search`, `query`, `dashboards`, `tasks` (stubs)
3. Implement Excel→CSV extraction and CSV→JSON seed scripts
4. Define ontology and seed minimal datasets (districts, facilities, supplies, projects)
5. Build in-memory search index; return simple metrics in <1s
6. Create Analyst and Citizen dashboard skeletons (3 widgets each)
7. Write smoke tests: ETL mapping, search correctness, API health

## Phase 2 — Intelligence (Week 2) 🚧 IN PROGRESS
8. Implement Gemini adapter with provider switcher and strict prompt ✅ (mock/fallback ready)
9. Implement `/api/query` to return `{answer, provenance[], tokens, cost}` ✅
10. Add onboarding (4 questions) to set role/region defaults ⏱️
11. Wire dashboards to seeded data (KPI, chart, alerts) ✅
12. Add provenance panel and link-through to raw rows ✅
13. Add task creation from recommendation card ⏱️

## Phase 3 — Demo polish (Week 3)
14. Entrepreneur view: rank top 5 underserved areas (table/map stub)
15. Export stub (PDF/CSV) including sources
16. Performance hardening: ensure search<1s, NL<10s, dashboard<3s
17. Acceptance runbook and demo script finalization

## Stretch (post-MVP)
18. Meilisearch wrapper; Postgres migration; TRPC; Clerk auth; CI/CD

## Testing checklist
- ETL unit tests (column mapping → ontology)
- Search smoke tests (keyword → metric)
- Query schema test (answer/provenance keys)
- Dashboard load time check under throttle

## Deliverables per phase
- Phase 1: running app with ingest/search/dashboards; seeded data
- Phase 2: NL answers with provenance; role switching UI; search dropdown; charts
- Phase 3: entrepreneur view; export; demo assets

---

## Phase 1: Foundation (Week 1) ✅ COMPLETED

**Goal:** Basic working UI with search and role dashboards

### ✅ Completed Tasks:
- [x] Install UI Framework dependencies (Tailwind, shadcn/ui, lucide-react)
- [x] Install Charts & Data Viz (Recharts)
- [x] Install State Management (@tanstack/react-query)
- [x] Create Layout Shell (Header, Sidebar, MainContent)
- [x] Implement Search Interface (SearchBar, SearchResults with loading states)
- [x] Build Role Dashboard Components (DashboardCard, KpiWidget, ChartWidget, AlertWidget)
- [x] Set up proper file structure following specification
- [x] Implement Rwanda color palette and typography system
- [x] Add hover effects and responsive design
- [x] Fix sidebar navigation visibility issues

### 📁 File Structure Implemented:
```
apps/web/
├── app/
│   ├── globals.css (Tailwind imports) ✅
│   ├── layout.tsx (root layout with providers) ✅
│   ├── page.tsx (dashboard page) ✅
│   └── components/
│       ├── ui/ (shadcn/ui components) ✅
│       ├── layout/
│       │   ├── Header.tsx ✅
│       │   ├── Sidebar.tsx ✅
│       │   └── MainContent.tsx ✅
│       ├── search/
│       │   ├── SearchBar.tsx ✅
│       │   └── SearchResults.tsx ✅
│       └── dashboard/
│           ├── DashboardCard.tsx ✅
│           ├── KpiWidget.tsx ✅
│           ├── ChartWidget.tsx ✅
│           └── AlertWidget.tsx ✅
```

### 🎯 Phase 1 Success Criteria - STATUS:
- [x] Basic layout shell with header, sidebar, main content
- [x] Search interface with icon, loading states, provenance display
- [x] Dashboard cards with KPI widgets and chart placeholders
- [x] Rwanda color palette and typography implemented
- [x] Responsive design (desktop + mobile breakpoints)
- [x] shadcn/ui component integration
- [x] Hover effects and micro-interactions

**Phase 1 Completion:** 100% ✅
**Ready for Phase 2:** Data Integration