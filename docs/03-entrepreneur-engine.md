### Investment Intelligence Engine: Entrepreneur Workflow

- **Vision**: Transform the entrepreneur tab from a static underserved table into a Palantir-grade investment intelligence workflow that matches investors with high-impact opportunities.
- **Core Outcome**: Provide guided opportunity discovery, due diligence automation, and execution pathways tailored to investor profiles.

#### 1. Investor Profile Capture (Week 1)
- Build profile schema: capital range, sector interests, risk tolerance, timeline.
- Store profile in state with optional persistence (localStorage) for repeat visits.
- Expose `POST /api/entrepreneur/profile` for future personalization (mock adoption now).

#### 2. Opportunity Intelligence Modules (Week 1-2)
- Replace table with buckets: high-confidence, market gap, infrastructure plays.
- For each module display: insight summary, ROI/payback, impact narrative, due diligence snapshot.
- Provide fast-actions: generate feasibility brief, connect with government liaison, coordinate site visit.

#### 3. Due Diligence & Execution (Week 2)
- Auto-generate due diligence highlights (regulation, incentives, partnerships, precedent).
- Government contact directory with ministry, title, email, optional phone.
- Investor network sidebar showing potential co-investors / mentors.

#### 4. API Contract (Phase 1)
- `GET /api/entrepreneur?region=<slug>` returns `EntrepreneurIntelligenceResponse`.
- Response fields: profile, keySignals, buckets[], dueDiligenceHighlights[], recommendedNextSteps[], governmentContacts[], investorNetwork[], lastRefresh.

#### 5. UI Contract (Phase 1)
- Main layout: profile summary, key signals, opportunity buckets, due diligence, execution network.
- Interaction: CTA buttons (non-functional) represent future workflow integration.
- Responsive design with grid cards, highlight states, and action buttons.

#### 6. Future Enhancements (Phase 2+)
- Export feasibility brief (PDF/Slide) with data provenance.
- Matchmaking engine using actual investment datasets and ROI modeling.
- Workflow integration: book government briefings, submit incentive applications.
- Feedback loop: entrepreneurs rate opportunities, refine scoring model.
