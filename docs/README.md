# Rwanda Government Data Intelligence — Docs

This folder contains the core human‑readable documentation for the MVP.

## Files
- `01-specify.md` — what we’re building and for whom
- `02-plan.md` — technical plan (architecture, modules, data model, prompts, budgets)
- `03-tasks.md` — phased, actionable task list to deliver the MVP

## Overview
RGDI is a “ChatGPT for Rwanda’s data” experience with fast search, role dashboards, and short natural‑language answers that always show sources. The MVP demonstrates a thin, working slice using two small datasets with strict performance and provenance.

## Performance targets
- Search metrics: <1s
- NL answers with provenance: <10s
- Dashboard load on 3G: <3s

## Quickstart (dev)
1) Install deps: `pnpm install`
2) Extract CSVs: `pnpm etl:excel` → `data/*.csv`
3) Seed JSON: `pnpm seed` → `data/seeded/*.json`
4) Run app: `pnpm dev:web` → open `/` and `/api/health`

## Data and provenance
- Prefer public/derived data for demo, no PII
- Every answer shows dataset, timestamp, record link, confidence, and short explanation

## Demo focus
Entrepreneur site selection in Gasabo: identify top underserved areas using population vs facility coverage; present top 5 with provenance, and allow creating a follow‑up task.