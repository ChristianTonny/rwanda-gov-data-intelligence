import { Router } from "express";
import { stats } from "../search/indexer.js";
import fs from "fs";
import path from "path";

const router = Router();

/**
 * Simple dashboard endpoints.
 * - GET /api/dashboards/summary
 */
router.get("/summary", async (req, res) => {
  try {
    const s = stats();
    res.json({ success: true, data: { docs_count: s.docs_count } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

function loadSeededJson(seededDir, filename) {
  try {
    const file = fs.readFileSync(path.join(seededDir, filename), "utf8");
    return JSON.parse(file || "[]");
  } catch (err) {
    return [];
  }
}

function buildSupplyCoverage(populations = [], supplies = []) {
  const populationByDistrict = new Map();
  populations.forEach((row) => {
    const key = String(row.district_name || "").toLowerCase();
    if (!key) return;
    populationByDistrict.set(key, (populationByDistrict.get(key) || 0) + (Number(row.population_total) || 0));
  });

  const suppliesByDistrict = new Map();
  supplies.forEach((row) => {
    const key = String(row.district_name || "").toLowerCase();
    if (!key) return;
    suppliesByDistrict.set(key, (suppliesByDistrict.get(key) || 0) + (Number(row.qty) || 0));
  });

  const coverage = [];
  populationByDistrict.forEach((population, district) => {
    const supply = suppliesByDistrict.get(district) || 0;
    const perCapita = population ? supply / population : 0;
    const underservedRatio = population ? population / (supply + 1) : 0;
    coverage.push({
      district,
      population,
      supply,
      perCapita,
      underservedRatio,
    });
  });

  return coverage.sort((a, b) => b.underservedRatio - a.underservedRatio);
}

function formatCurrency(amountRwf) {
  return `RWF ${Math.round(amountRwf / 1_000_000)}M`;
}

function buildResourceAllocationModule({ coverage, totalBudget = 320_000_000, executedPercent = 67 }) {
  const unspent = totalBudget * (1 - executedPercent / 100);
  const topGaps = coverage.slice(0, 3).map((item) => ({
    district: item.district,
    gapScore: Number(item.underservedRatio.toFixed(1)),
    population: item.population,
    supply: item.supply,
  }));

  return {
    id: "resource-allocation",
    title: "Resource Allocation Intelligence",
    persona: "minister",
    objective: "Redirect unspent ministry budgets to the highest-impact districts",
    insight: "Ministry of Health holds unspent funds that can close critical health facility gaps before fiscal year-end.",
    summary: `Budget execution is tracking at ${executedPercent}% with ${formatCurrency(unspent)} still available. Health facility coverage in eastern districts remains below national targets`,
    narrative: [
      `Financial execution data indicates ${formatCurrency(unspent)} remains unassigned with only 3 months left in the fiscal year. Ministries risk automatic reversion if action is not taken before Q4 reviews.`,
      `District demand analysis shows Gicumbi, Nyagatare, and Bugesera have the highest underserved ratios when comparing facility supplies to population demand. Reallocating even ${formatCurrency(unspent * 0.4)} could close 70% of the identified coverage gaps.`,
    ],
    timeframe: "Immediate (Q3 FY2025)",
    confidence: "high",
    keySignals: [
      {
        label: "Unspent funds",
        value: formatCurrency(unspent),
        trend: "down",
        impact: "high",
        rationale: "Budget execution needs to reach 92% to meet cabinet directive.",
      },
      {
        label: "District coverage gap",
        value: `${topGaps[0]?.district || ""}: ${topGaps[0]?.gapScore || 0}`,
        trend: "stable",
        impact: "high",
        rationale: "Population per facility supply remains 3x higher than recommended baseline.",
      },
      {
        label: "Historical reallocation efficiency",
        value: "+18%",
        trend: "up",
        impact: "medium",
        rationale: "Prior reallocations in FY2024 improved facility readiness within 45 days.",
      },
    ],
    recommendedActions: [
      {
        id: "generate-reallocation-proposal",
        label: "Generate Reallocation Proposal",
        description: "Draft memo reallocating RWF 15M to Gicumbi, Nyagatare, and Bugesera health facilities.",
        intent: "workflow",
      },
      {
        id: "view-historical-patterns",
        label: "View Historical Patterns",
        description: "Compare last 4 quarters of budget execution vs facility coverage performance.",
        intent: "analysis",
      },
      {
        id: "schedule-minister-review",
        label: "Schedule Minister Review",
        description: "Add briefing to ministerial calendar ahead of Q3 cabinet session.",
        intent: "coordination",
      },
    ],
    supportingEvidence: topGaps.map((gap) => ({
      label: `Coverage gap – ${gap.district}`,
      value: `${gap.population.toLocaleString()} people / ${gap.supply.toLocaleString()} critical supplies`,
      source: "Health facility supply inventory (2016 baseline)",
    })),
  };
}

function buildOpportunityModule({ coverage, populationGrowth = 3.2 }) {
  const opportunities = coverage.slice(0, 3).map((row) => ({
    title: `${row.district.charAt(0).toUpperCase()}${row.district.slice(1)} opportunity`,
    underserved: `${Math.round(row.population / 1000)}k residents underserved`,
    rationale: `Coverage ratio ${row.underservedRatio.toFixed(1)}x higher than national median`,
  }));

  return {
    id: "development-opportunity",
    title: "Development Opportunity Radar",
    persona: "investment-promoter",
    objective: "Surface investable projects aligned with demographic growth",
    insight: "Eastern Province demand spikes reveal three investable projects with double-digit ROI potential.",
    summary: `Population growth is trending at ${populationGrowth}% with three high-confidence opportunities ready for due diligence.`,
    narrative: [
      "Population inflows in Nyagatare, Bugesera, and Gatsibo are outpacing service provision. Combining supply data with growth projections suggests immediate private-sector entry points.",
      "Each opportunity includes government co-investment signals, reducing time-to-close for qualified investors.",
    ],
    timeframe: "Near-term (6-18 months)",
    confidence: "medium",
    keySignals: [
      {
        label: "ROI potential",
        value: "23% average",
        trend: "up",
        impact: "high",
        rationale: "Modeled on comparable facilities launched 2021-2023.",
      },
      {
        label: "Population pressure",
        value: `${opportunities[0]?.underserved || ""}`,
        trend: "up",
        impact: "high",
        rationale: "Population to facility ratio exceeds target by 2.8x.",
      },
      {
        label: "Government incentive readiness",
        value: "Tier 1",
        trend: "stable",
        impact: "medium",
        rationale: "Investment Promotion Agency confirmed fast-track permitting window.",
      },
    ],
    recommendedActions: [
      {
        id: "deep-dive-analysis",
        label: "Deep Dive Analysis",
        description: "Open opportunity brief with cost model and demographic overlays.",
        intent: "analysis",
      },
      {
        id: "contact-investment-promotion",
        label: "Contact Investment Promotion",
        description: "Send pre-filled inquiry to Rwanda Development Board.",
        intent: "coordination",
      },
      {
        id: "view-feasibility-data",
        label: "View Feasibility Data",
        description: "Review comparable case studies and supply chain assessment.",
        intent: "analysis",
      },
    ],
    supportingEvidence: opportunities.map((item) => ({
      label: item.title,
      value: `${item.underserved} • ${item.rationale}`,
      source: "Population & facility coverage fusion dataset",
    })),
  };
}

function buildRiskModule() {
  const delayedProjects = 31;
  const atRisk = 12;
  return {
    id: "risk-performance",
    title: "Risk & Performance Monitor",
    persona: "minister",
    objective: "Intervene early on infrastructure projects trending toward delay",
    insight: "Procurement bottlenecks persist in Q2, threatening 12 additional projects if unaddressed.",
    summary: `31 projects are delayed and ${atRisk} more exhibit early warning signals tied to procurement approval lag.`,
    narrative: [
      "Project telemetry highlights repeated procurement review overruns averaging 37 days above baseline.",
      "If left unresolved, transport and energy corridor timelines will slip past 2026 milestone commitments.",
    ],
    timeframe: "Within 30 days",
    confidence: "medium",
    keySignals: [
      {
        label: "Delayed projects",
        value: `${delayedProjects}`,
        trend: "up",
        impact: "high",
        rationale: "+4 vs last month, concentrated in procurement stage.",
      },
      {
        label: "At-risk forecast",
        value: `${atRisk}`,
        trend: "up",
        impact: "high",
        rationale: "Backlog indicates similar pattern to FY2023 delays.",
      },
      {
        label: "Average procurement lag",
        value: "+37 days",
        trend: "up",
        impact: "medium",
        rationale: "Threshold >21 days triggers cabinet review.",
      },
    ],
    recommendedActions: [
      {
        id: "launch-intervention-workflow",
        label: "Intervention Workflows",
        description: "Assign task force to expedite procurement approvals for 3 flagship projects.",
        intent: "workflow",
      },
      {
        id: "issue-stakeholder-alerts",
        label: "Stakeholder Alerts",
        description: "Notify MININFRA and RPPA leads about projects exceeding risk thresholds.",
        intent: "communication",
      },
      {
        id: "open-historical-analysis",
        label: "Historical Analysis",
        description: "Compare FY2022-2024 procurement cycle times to isolate systemic blockers.",
        intent: "analysis",
      },
    ],
    supportingEvidence: [
      {
        label: "Flagged projects",
        value: "12 projects entering critical risk window",
        source: "Project Management Office – Early Warning feed",
      },
      {
        label: "Common blocker",
        value: "RPPA approvals pending >30 days",
        source: "Procurement analytics",
      },
    ],
  };
}

function buildCrossMinistryModule() {
  return {
    id: "cross-ministry-intelligence",
    title: "Cross-Ministry Intelligence",
    persona: "policy-director",
    objective: "Coordinate infrastructure, education, and health investments",
    insight: "Education expansion in Musanze increases downstream demand for health and transport services by double digits.",
    summary: "Multi-sector dependencies indicate FY2025 road upgrades must align with education and health rollout schedules.",
    narrative: [
      "New secondary schools in Musanze correlate with a 23% uptick in outpatient visits, while local road projects remain unfunded.",
      "Coordinated sequencing could unlock RWF 2.3B in agricultural export value once the road corridor opens.",
    ],
    timeframe: "Strategic (12-24 months)",
    confidence: "medium",
    keySignals: [
      {
        label: "Education expansion",
        value: "+18 classrooms",
        trend: "up",
        impact: "medium",
        rationale: "FY2024 capex already approved.",
      },
      {
        label: "Health demand",
        value: "+23%",
        trend: "up",
        impact: "high",
        rationale: "Clinic visits tracked quarter-on-quarter.",
      },
      {
        label: "Export unlock",
        value: "RWF 2.3B",
        trend: "stable",
        impact: "high",
        rationale: "Agro-cooperatives awaiting road completion.",
      },
    ],
    recommendedActions: [
      {
        id: "open-coordination-dashboard",
        label: "Coordination Dashboard",
        description: "Align MINEDUC, MINISANTE, and MININFRA rollout timelines in a shared workspace.",
        intent: "coordination",
      },
      {
        id: "launch-impact-modeling",
        label: "Impact Modeling",
        description: "Simulate combined social and economic returns under different sequencing scenarios.",
        intent: "analysis",
      },
      {
        id: "map-stakeholders",
        label: "Stakeholder Mapping",
        description: "Identify district-level partners required to maintain cross-sector momentum.",
        intent: "workflow",
      },
    ],
    supportingEvidence: [
      {
        label: "Musanze site visit notes",
        value: "Health clinics operating at 118% of planned capacity",
        source: "Joint monitoring mission (Aug 2025)",
      },
      {
        label: "Road project stage",
        value: "Procurement stage – pending contractor award",
        source: "MININFRA project tracker",
      },
    ],
  };
}

function buildInstitutionalMemoryModule() {
  return {
    id: "institutional-memory",
    title: "Institutional Memory Engine",
    persona: "policy-director",
    objective: "Capture lessons from past rural electrification programs",
    insight: "2019-2021 rural electrification achieved 92% coverage when local cooperatives led maintenance planning.",
    summary: "Similarities with current connectivity push suggest replicating phased rollout and local partnership model.",
    narrative: [
      "Success factors included phased commissioning, community ownership, and maintenance funds earmarked at project start.",
      "Failure points involved inadequate spare part logistics and unclear O&M accountability.",
    ],
    timeframe: "Reference (apply to FY2025 projects)",
    confidence: "high",
    keySignals: [
      {
        label: "Best practice",
        value: "Local partnership MOUs",
        trend: "stable",
        impact: "high",
        rationale: "Reduced downtime by 28% in pilot districts.",
      },
      {
        label: "Known risk",
        value: "Maintenance funding gap",
        trend: "up",
        impact: "medium",
        rationale: "Projects without O&M plan failed within 14 months.",
      },
    ],
    recommendedActions: [
      {
        id: "view-case-study",
        label: "View Full Case Study",
        description: "Open 2019-2021 rural electrification dossier with implementation timeline.",
        intent: "analysis",
      },
      {
        id: "extract-best-practices",
        label: "Extract Best Practices",
        description: "Pull structured checklist to embed into current connectivity projects.",
        intent: "workflow",
      },
      {
        id: "compare-current-initiative",
        label: "Compare Current Initiative",
        description: "Run side-by-side comparison with FY2025 smart grid rollout.",
        intent: "analysis",
      },
    ],
    supportingEvidence: [
      {
        label: "Outcome",
        value: "92% coverage achieved in 18 months",
        source: "Energy Sector Performance Report (2021)",
      },
      {
        label: "Key pitfall",
        value: "Delayed maintenance planning in phase 2",
        source: "Internal audit memo (2022)",
      },
    ],
  };
}

function buildRealtimeModule() {
  return {
    id: "real-time-feed",
    title: "Real-Time Intelligence Feed",
    persona: "minister",
    objective: "Monitor live economic and operational signals",
    insight: "Customs throughput improvements could unlock a 15% revenue uplift within the next two quarters.",
    summary: "Live indicators highlight actionable tax and export opportunities requiring inter-agency execution.",
    narrative: [
      "Revenue Authority pilots at Kagitumba border reduced clearance time by 22%, signaling scalable gains.",
      "Coffee export orders up 11% month-on-month; logistics readiness is the limiting factor.",
    ],
    timeframe: "Continuous (refresh hourly)",
    confidence: "medium",
    keySignals: [
      {
        label: "Tax revenue potential",
        value: "+15%",
        trend: "up",
        impact: "high",
        rationale: "Projected from customs process optimization models.",
      },
      {
        label: "Market pulse",
        value: "+11% coffee exports",
        trend: "up",
        impact: "medium",
        rationale: "International demand index week 38.",
      },
      {
        label: "Alert queue",
        value: "5 active alerts",
        trend: "stable",
        impact: "medium",
        rationale: "Includes logistics, health supply, and education staffing signals.",
      },
    ],
    recommendedActions: [
      {
        id: "subscribe-feed",
        label: "Subscribe",
        description: "Receive hourly digest summarizing top signals and interventions.",
        intent: "communication",
      },
      {
        id: "create-alert",
        label: "Create Alert",
        description: "Set threshold-based notifications for customs throughput drops.",
        intent: "workflow",
      },
      {
        id: "open-recent",
        label: "Open in Recent",
        description: "View full audit trail in institutional memory workspace.",
        intent: "analysis",
      },
    ],
    supportingEvidence: [
      {
        label: "Customs pilot",
        value: "Clearance time reduced from 6h → 4.7h",
        source: "Rwanda Revenue Authority (Sep 2025)",
      },
      {
        label: "Coffee export orders",
        value: "USD 4M pipeline",
        source: "Market intelligence feed",
      },
    ],
  };
}

// GET /api/dashboards
router.get("/", async (req, res) => {
  try {
    const role = String(req.query.role || "analyst");
    const region = String(req.query.region || "gasabo").toLowerCase();
    const root = path.resolve(process.cwd(), "..");
    const seededDir = path.join(root, "data", "seeded");

    const populations = loadSeededJson(seededDir, "populations.json");
    const supplies = loadSeededJson(seededDir, "supplies.json");

    const coverage = buildSupplyCoverage(populations, supplies);

    const modules = [
      buildResourceAllocationModule({ coverage }),
      buildOpportunityModule({ coverage }),
      buildRiskModule(),
      buildCrossMinistryModule(),
      buildInstitutionalMemoryModule(),
      buildRealtimeModule(),
    ];

    res.json({
      role,
      region,
      modules,
      lastRefresh: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
