# 02 — Dashboard Intelligence (Palantir-Grade)

Goal: Shift from passive status widgets to decision intelligence modules with guided actions. Each module contains persona targeting, insight, confidence, key signals, recommended workflows, and evidence trails.

## Module Catalogue (Phase 1 delivered)

### 1) Resource Allocation Intelligence
- **Persona:** Minister / budget owner
- **Insight:** Ministry of Health underspend can be reallocated to close critical facility gaps in Eastern Province.
- **Signals:** Remaining budget, coverage gap ratios, historical reallocation efficiency.
- **Actions:** `Generate Reallocation Proposal`, `View Historical Patterns`, `Schedule Minister Review`.
- **Data fused:** Budget execution (mock), population vs supply coverage (seeded data).

### 2) Development Opportunity Radar
- **Persona:** Investment promoter / RDB analyst
- **Insight:** Population growth hotspots produce three investable opportunities with double-digit ROI.
- **Signals:** ROI model, population pressure, incentive readiness.
- **Actions:** `Deep Dive Analysis`, `Contact Investment Promotion`, `View Feasibility Data`.
- **Data fused:** Population baselines, supply coverage, mock ROI assumptions.

### 3) Risk & Performance Monitor
- **Persona:** Minister / PMO
- **Insight:** Procurement lags pushing 31 projects into delay with 12 more at risk.
- **Signals:** Delayed projects count, at-risk forecast, procurement lag delta.
- **Actions:** `Intervention Workflows`, `Stakeholder Alerts`, `Historical Analysis`.
- **Data fused:** Mock project telemetry, procurement analytics narratives.

### 4) Cross-Ministry Intelligence (Preview)
- **Persona:** Policy director / cabinet
- **Insight:** Education build-out in Musanze increases health demand and ties to export logistics value.
- **Signals:** Classroom expansion, health demand lift, export unlock value.
- **Actions:** `Coordination Dashboard`, `Impact Modeling`, `Stakeholder Mapping`.
- **Status:** Narrative + mocked correlations pending data graph integration.

### 5) Institutional Memory Engine (Preview)
- **Persona:** Policy director / knowledge manager
- **Insight:** Rural electrification lessons (2019-2021) inform current connectivity rollout.
- **Signals:** Best practice adoption, maintenance risk, phase success ratios.
- **Actions:** `View Full Case Study`, `Extract Best Practices`, `Compare Current Initiative`.
- **Status:** Mocked evidence referencing curated archival docs.

### 6) Real-Time Intelligence Feed
- **Persona:** Minister / operations lead
- **Insight:** Customs throughput improvements unlock 15% revenue uplift; coffee export surge flagged.
- **Signals:** Tax revenue potential, market pulse, alert queue volume.
- **Actions:** `Subscribe`, `Create Alert`, `Open in Recent`.
- **Status:** Mocked live feed until event stream integration.

## API Contract

`GET /api/dashboards`
- Returns `{ role, region, modules[], lastRefresh }`.
- `modules[]` conforms to `IntelligenceModule` schema (persona, insight, signals, actions, evidence).
- Data sources: seeded population/supply files + mocked narratives.

## UI Contract
- `WidgetRenderer` replaced by `IntelligenceModuleCard` component.
- Grid layout: 1×N mobile, 2×N tablet, 3×N desktop with responsive cards.
- Cards show persona targeting, insight, timeframe, confidence, signals, actions, and supporting evidence.
- CTA buttons future-connect to Phase 2 workflows (modal/panels pending).

## Phase Plan
- **Phase 1 (complete):** Six modules rendered with actionable narratives and signal scaffolding.
- **Phase 2:** Attach workflow orchestrators, drilldowns, and data fetchers for historical analysis.
- **Phase 3:** Integrate cross-ministry knowledge graph and institutional memory datastore.
