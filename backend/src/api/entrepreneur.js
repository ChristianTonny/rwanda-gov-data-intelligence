import { Router } from "express";
import fs from "fs";
import path from "path";

const router = Router();

function loadSeededJson(seededDir, filename) {
  try {
    const file = fs.readFileSync(path.join(seededDir, filename), "utf8");
    return JSON.parse(file || "[]");
  } catch (err) {
    return [];
  }
}

function normalizeDistrictKey(name = "") {
  return String(name).trim().toLowerCase();
}

function buildPopulationMap(populations = []) {
  const map = new Map();
  populations.forEach((row) => {
    const key = normalizeDistrictKey(row.district_name);
    if (!key) return;
    map.set(key, (map.get(key) || 0) + (Number(row.population_total) || 0));
  });
  return map;
}

function buildSupplyMap(supplies = []) {
  const map = new Map();
  supplies.forEach((row) => {
    const key = normalizeDistrictKey(row.district_name);
    if (!key) return;
    map.set(key, (map.get(key) || 0) + (Number(row.qty) || 0));
  });
  return map;
}

function calculateCoverage(populations, supplies) {
  const coverage = [];
  populations.forEach((population, district) => {
    const supply = supplies.get(district) || 0;
    const underservedRatio = population ? population / (supply + 1) : 0;
    const perCapitaSupply = population ? supply / population : 0;
    coverage.push({ district, population, supply, underservedRatio, perCapitaSupply });
  });
  return coverage.sort((a, b) => b.underservedRatio - a.underservedRatio);
}

function buildInvestmentProfile(region) {
  return {
    capital: 1_500_000,
    sector: "health",
    risk: "moderate",
    timeline: 24,
    region,
  };
}

function buildKeySignals(coverage) {
  const top = coverage[0];
  const avgRatio = coverage.reduce((sum, row) => sum + row.underservedRatio, 0) / (coverage.length || 1);
  return [
    {
      label: "Highest demand district",
      value: top ? `${top.district} (${Math.round(top.population / 1000)}k residents)` : "--",
      trend: "up",
      impact: "high",
      rationale: top ? `Coverage ratio ${top.underservedRatio.toFixed(1)}x national baseline.` : "Demand signal pending.",
    },
    {
      label: "Average coverage gap",
      value: avgRatio ? `${avgRatio.toFixed(1)}x` : "n/a",
      trend: "stable",
      impact: "medium",
      rationale: "Compared against population-weighted supply distribution.",
    },
    {
      label: "Government incentives",
      value: "Health PPP tier 1",
      trend: "stable",
      impact: "medium",
      rationale: "PPP program provides 40% capex co-financing for district clinics.",
    },
  ];
}

function buildOpportunity(id, overrides) {
  return {
    id,
    name: "",
    district: "",
    sector: "health",
    category: "high-confidence",
    investmentRequired: 0,
    paybackMonths: 24,
    roi: 0,
    impactNarrative: "",
    confidence: "medium",
    summary: "",
    matchScore: 0,
    riskProfile: "moderate",
    timelineMonths: 24,
    actions: [],
    dueDiligence: {
      marketSize: "",
      regulation: "",
      incentives: "",
      partnerships: "",
      precedent: "",
    },
    governmentContact: {
      name: "",
      title: "",
      email: "",
    },
    supportingData: [],
    ...overrides,
  };
}

function formatCurrency(amount) {
  if (!amount) return "RWF 0";
  return `RWF ${Math.round(amount / 1_000_000)}M`;
}

function buildOpportunities(coverage) {
  const [first, second, third] = coverage;
  const buckets = [
    {
      id: "high-confidence",
      title: "High-Confidence Investments",
      narrative: "Opportunities with validated demand, policy alignment, and fast-track approvals.",
      opportunities: [
        buildOpportunity("health-clinic-gicumbi", {
          name: "Private Health Clinic Expansion",
          district: first ? first.district : "gicumbi",
          sector: "health",
          category: "high-confidence",
          investmentRequired: 800_000,
          paybackMonths: 28,
          roi: 23,
          impactNarrative: "Serves 45k underserved residents with Ministry support for procurement.",
          confidence: "high",
          summary: "Medical services gap with guaranteed patient volume and subsidy support.",
          matchScore: 92,
          actions: [
            {
              id: "generate-feasibility",
              label: "Generate Feasibility Brief",
              description: "Compile demand, cost, and regulatory checklist for investor review.",
              intent: "analysis",
            },
            {
              id: "connect-ministry",
              label: "Connect with Ministry Liaison",
              description: "Schedule call with Health PPP desk for incentive alignment.",
              intent: "coordination",
            },
          ],
          dueDiligence: {
            marketSize: "Estimated 45k residents with no private facility within 15km.",
            regulation: "Health PPP tier 1, licensing turnaround 45 days.",
            incentives: "40% capex subsidy, VAT exemption for medical equipment.",
            partnerships: "District hospital ready to share diagnostics lab.",
            precedent: "Similar clinic in Nyagatare reached breakeven in 22 months.",
          },
          governmentContact: {
            name: "Claudine Nyirabagenzi",
            title: "Director of Investment Promotion",
            email: "c.nyirabagenzi@mineco.gov.rw",
            phone: "+250 788 000 123",
          },
          supportingData: [
            "Population to facility ratio 3.2x national baseline",
            "Project site adjacent to existing health post infrastructure",
            "Ministry procurement pipeline includes bundled equipment pricing",
          ],
        }),
      ],
    },
    {
      id: "market-gap",
      title: "Market Gap Plays",
      narrative: "Spaces where demand is high but operating models require targeted support.",
      opportunities: [
        buildOpportunity("agro-processing-nyagatare", {
          name: "Agricultural Processing Hub",
          district: second ? second.district : "nyagatare",
          sector: "agriculture",
          category: "market-gap",
          investmentRequired: 1_200_000,
          paybackMonths: 32,
          roi: 21,
          impactNarrative: "Unlocks market access for 2,400 farmers with cold chain integration.",
          confidence: "medium",
          summary: "Demand secured via cooperative off-take agreements and export buyers.",
          matchScore: 86,
          riskProfile: "moderate",
          actions: [
            {
              id: "review-offtake",
              label: "Review Off-take Agreements",
              description: "Validate long-term commitments with two agribusiness buyers.",
              intent: "analysis",
            },
            {
              id: "visit-site",
              label: "Book Site Visit",
              description: "Coordinate district-led visit to confirm land availability and utilities.",
              intent: "coordination",
            },
          ],
          dueDiligence: {
            marketSize: "RWF 6.5B in annual maize and soy output within 40km radius.",
            regulation: "Export licensing handled by RDB one-stop center.",
            incentives: "5-year corporate tax holiday under manufacturing incentive.",
            partnerships: "Co-investment from Eastern Province Cooperative Union under negotiation.",
            precedent: "Bugesera agro-park saw 18% ROI in first 2 years.",
          },
          governmentContact: {
            name: "Eric Habimana",
            title: "Provincial Investment Lead",
            email: "e.habimana@rdb.rw",
          },
          supportingData: [
            "Population increasing 3.2% YoY",
            "Road upgrade scheduled Q1 2026 reducing logistics costs by 14%",
            "Climate adaptation fund eligible for cold chain subsidy",
          ],
        }),
      ],
    },
    {
      id: "infrastructure",
      title: "Strategic Infrastructure Bets",
      narrative: "Capital-intensive projects with strong government backing and blended finance options.",
      opportunities: [
        buildOpportunity("solar-mini-grid-bugesera", {
          name: "Solar Mini-Grid Expansion",
          district: third ? third.district : "bugesera",
          sector: "energy",
          category: "infrastructure",
          investmentRequired: 1_800_000,
          paybackMonths: 48,
          roi: 17,
          impactNarrative: "Electrifies 18 villages aligned with smart irrigation program.",
          confidence: "medium",
          summary: "Blended finance stack leveraging 89% government subsidy and green bonds.",
          matchScore: 78,
          riskProfile: "conservative",
          actions: [
            {
              id: "structure-financing",
              label: "Structure Financing Stack",
              description: "Coordinate Development Bank of Rwanda and green bond tranche.",
              intent: "workflow",
            },
            {
              id: "align-irrigation",
              label: "Align with Irrigation Program",
              description: "Sync rollout with Ministry of Agriculture smart irrigation timeline.",
              intent: "coordination",
            },
          ],
          dueDiligence: {
            marketSize: "Projected 15% increase in agro-processing capacity post electrification.",
            regulation: "Energy regulation fast-track for mini-grids under 2MW.",
            incentives: "Up to 89% capital subsidy through REFIT program.",
            partnerships: "Local cooperatives ready to manage billing via mobile money.",
            precedent: "Nyamata mini-grid achieved 98% uptime with similar model in 2024.",
          },
          governmentContact: {
            name: "Fidele Mugabo",
            title: "Energy Sector Program Manager",
            email: "f.mugabo@mininfra.gov.rw",
          },
          supportingData: [
            "New feeder road approved unlocking market access",
            "REFIT subsidy confirmed in 2025 budget",
            "Mobile payment adoption exceeds 82% in target villages",
          ],
        }),
      ],
    },
  ];

  const enrich = (opportunity) => ({
    ...opportunity,
    summary: opportunity.summary || "No summary provided",
    actions: opportunity.actions.map((action) => ({
      ...action,
      description: action.description || "",
    })),
  });

  return buckets.map((bucket) => ({
    ...bucket,
    opportunities: bucket.opportunities.map(enrich),
  }));
}

function buildDueDiligenceHighlights() {
  return [
    { label: "Regulatory", detail: "Investment code guarantees 10-year stability for approved PPPs." },
    { label: "Data Confidence", detail: "Supply coverage derived from 2016 baseline; refresh scheduled Q1 2026." },
    { label: "Execution Window", detail: "Cabinet targeting investment approvals before FY2025 mid-year review." },
  ];
}

function buildGovernmentContacts() {
  return [
    {
      name: "Claudine Nyirabagenzi",
      title: "Director, Investment Promotion",
      email: "c.nyirabagenzi@mineco.gov.rw",
      ministry: "MINICOM",
      phone: "+250 788 000 123",
    },
    {
      name: "Samuel Rwema",
      title: "PPP Unit Lead",
      email: "s.rwema@minecofin.gov.rw",
      ministry: "MINECOFIN",
    },
  ];
}

function buildInvestorNetwork() {
  return [
    { name: "Kigali Health Ventures", stage: "Series A", focus: "Primary care expansion", contact: "invest@khv.rw" },
    { name: "Eastern Province Coop Fund", stage: "Growth", focus: "Agro-processing and cold chain" },
    { name: "Africa Green Energy Fund", stage: "Infrastructure", focus: "Distributed solar" },
  ];
}

router.get("/", (req, res) => {
  try {
    const region = normalizeDistrictKey(req.query.region || "gasabo");
    const root = path.resolve(process.cwd(), "..");
    const seededDir = path.join(root, "data", "seeded");

    const populations = loadSeededJson(seededDir, "populations.json");
    const supplies = loadSeededJson(seededDir, "supplies.json");

    const populationMap = buildPopulationMap(populations);
    const supplyMap = buildSupplyMap(supplies);
    const coverage = calculateCoverage(populationMap, supplyMap);

    const profile = buildInvestmentProfile(region);
    const keySignals = buildKeySignals(coverage);
    const buckets = buildOpportunities(coverage);
    const dueDiligenceHighlights = buildDueDiligenceHighlights();
    const recommendedNextSteps = [
      {
        id: "define-investment-profile",
        label: "Refine Investment Profile",
        description: "Adjust capital, risk tolerance, and timeline to personalize opportunity scoring.",
        intent: "analysis",
      },
      {
        id: "schedule-briefing",
        label: "Schedule Government Briefing",
        description: "Book a joint session with Investment Promotion and relevant ministry leads.",
        intent: "coordination",
      },
      {
        id: "generate-brief",
        label: "Generate Investment Brief",
        description: "Export structured report covering financials, demand signals, and risks.",
        intent: "workflow",
      },
    ];

    res.json({
      region,
      profile,
      headline: "Investment Intelligence Engine",
      summary: `Opportunities prioritized for ${formatCurrency(profile.capital)} deployment in ${region || "selected"} districts.`,
      keySignals,
      buckets,
      dueDiligenceHighlights,
      recommendedNextSteps,
      governmentContacts: buildGovernmentContacts(),
      investorNetwork: buildInvestorNetwork(),
      lastRefresh: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

