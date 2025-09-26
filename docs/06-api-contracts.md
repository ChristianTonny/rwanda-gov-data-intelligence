### API Contracts — Government Intelligence Platform

#### 1. Dashboard Intelligence
- **Endpoint:** `GET /api/dashboards?role=<role>&region=<region>`
- **Response:**
  - `role`: echoed role (default `analyst`)
  - `region`: slug (lowercase)
  - `modules`: `IntelligenceModule[]`
    - fields: `id, title, persona, objective, insight, summary, narrative[], timeframe, confidence, keySignals[], recommendedActions[], supportingEvidence[]`
  - `lastRefresh`: ISO timestamp
- **Notes:** Uses seeded population/supply data + mocked narratives; future integration with live datasets.

#### 2. Entrepreneur Investment Intelligence
- **Endpoint:** `GET /api/entrepreneur?region=<region>`
- **Response:** `EntrepreneurIntelligenceResponse`
  - `profile`: `capital, sector, risk, timeline, region`
  - `headline`, `summary`
  - `keySignals[]`
  - `buckets[]` (opportunity categories → opportunities with ROI, payback, actions, due diligence)
  - `dueDiligenceHighlights[]`, `recommendedNextSteps[]`
  - `governmentContacts[]`, `investorNetwork[]`
  - `lastRefresh`
- **Future:** `POST /api/entrepreneur/profile` to store investor preferences; `POST /api/entrepreneur/opportunities/:id/actions` for workflow logging.

#### 3. Decision Workflows (Planned)
- **Phase 2** endpoints (draft):
  - `POST /api/workflows/impact-simulator` → scenario analysis results.
  - `POST /api/workflows/resource-optimizer` → allocation recommendation.
  - `POST /api/workflows/stakeholder-impact` → communication matrix.
- Responses include recommended actions, confidence, and supporting evidence references.

#### 4. Institutional Memory (Planned)
- Draft endpoints mirrored in `docs/05-institutional-memory.md`.
- Ensure provenance metadata and access controls considered before implementation.

#### General Guidelines
- All responses JSON, UTF-8.
- Ensure CORS headers for web app consumption.
- Provide error structure `{ error: string }` on non-2xx.
- Capture `lastRefresh` for client-side freshness checks.
