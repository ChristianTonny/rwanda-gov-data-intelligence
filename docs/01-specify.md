# Rwanda Government Data Intelligence — Specification

## What we’re building
A unified platform where anyone can ask questions about Rwanda and get fast, trusted answers with visuals and source links. Think “ChatGPT for Rwanda’s data,” focused on real decisions for entrepreneurs, government officials, and citizens.

## Who it serves
- Entrepreneurs: site selection, demand sizing, competition scan, permits readiness
- Government officials: budget execution, service coverage, project risk, staffing needs
- Citizens: nearest services, project status, local development updates

## The problem
Critical data is scattered across censuses, surveys, and administrative systems. Users spend days stitching sources, rely on outdated reports, and struggle to trust numbers.

## The solution
- Natural-language queries (English) with automatic routing: fast lookup vs analysis
- Always-on provenance: dataset, timestamp, record link, confidence, short explanation
- Role-based dashboards with KPIs, charts/maps, and alerts
- Predictive and recommendations path for higher-value questions

## MVP scope (2–3 weeks)
1) Data: Ingest two small datasets (NISR population + one ministry/facility sheet) into a simple ontology: districts, facilities, supplies, projects
2) Dashboards: Analyst and Citizen role templates (3 widgets each)
3) Search: Indexed simple metrics in <1s
4) NL answers: Short answer with provenance in <10s (Gemini 2.5 Flash)
5) Onboarding: 4-question flow to personalize defaults
6) Tasks: Create a follow-up task from an alert/recommendation

## Example queries
- Entrepreneur: “Top 5 areas in Gasabo with high population but low pharmacy coverage”
- Official: “Which districts need more teachers based on enrollment trends?”
- Citizen: “Nearest clinic that’s open today”

## Output format requirements
- Answers include: short text, visualization suggestion, and provenance bullets
- Provenance per item: dataset name, timestamp, record link, confidence (0–1), explanation
- If evidence missing: clearly state insufficiency + suggest next steps

## Performance targets
- Search: <1 second
- NL answer + provenance: <10 seconds
- Dashboard load on 3G: <3 seconds

## Data principles
- Prefer public data (e.g., NISR) and derived aggregates for demo
- No PII; mask sensitive fields (e.g., national_id)
- Keep a single canonical model for simplicity

## Success criteria
- Demo completes the entrepreneur site-selection story end‑to‑end
- Users see sources and can click through to raw rows
- Basic smoke tests pass for ingest, search, NL structure, and dashboards