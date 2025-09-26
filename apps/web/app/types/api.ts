export type Role = 'analyst' | 'citizen'

export type SearchDoc = {
  id: string
  text: string
  link?: string
  dataset?: string
  timestamp?: string
}

export type SearchResponse = {
  results: SearchDoc[]
}

export type ProvenanceItem = {
  dataset: string
  timestamp?: string
  recordId?: string
  link?: string
  confidence: number
  explanation?: string
}

export type QueryAnswer = {
  answer: string
  provenance: ProvenanceItem[]
  tokens?: number
  cost?: number
}

export type SignalTrend = 'up' | 'down' | 'stable'
export type SignalImpact = 'low' | 'medium' | 'high'
export type ActionIntent = 'workflow' | 'analysis' | 'coordination' | 'communication'

export type IntelligenceAction = {
  id: string
  label: string
  description: string
  intent: ActionIntent
}

export type IntelligenceSignal = {
  label: string
  value: string
  trend: SignalTrend
  impact: SignalImpact
  rationale: string
}

export type IntelligenceEvidence = {
  label: string
  value: string
  source?: string
}

export type IntelligenceModule = {
  id: string
  title: string
  persona: string
  objective: string
  insight: string
  summary: string
  narrative: string[]
  timeframe: string
  confidence: string
  keySignals: IntelligenceSignal[]
  recommendedActions: IntelligenceAction[]
  supportingEvidence?: IntelligenceEvidence[]
}

export type DashboardResponse = {
  role: Role
  region: string
  modules: IntelligenceModule[]
  lastRefresh: string
}

export type PopulationDataPoint = {
  district_name: string
  population_total: number
  source_year?: number | string
}

export type InvestmentRiskProfile = 'conservative' | 'moderate' | 'aggressive'
export type InvestmentOpportunityCategory = 'high-confidence' | 'market-gap' | 'infrastructure'

export type InvestmentProfile = {
  capital: number
  sector: string
  risk: InvestmentRiskProfile
  timeline: number
}

export type OpportunityDueDiligence = {
  marketSize: string
  regulation: string
  incentives: string
  partnerships: string
  precedent: string
}

export type OpportunityContact = {
  name: string
  title: string
  email: string
  phone?: string
}

export type InvestmentOpportunity = {
  id: string
  name: string
  district: string
  sector: string
  category: InvestmentOpportunityCategory
  investmentRequired: number
  paybackMonths: number
  roi: number
  impactNarrative: string
  confidence: 'high' | 'medium' | 'low'
  summary: string
  matchScore: number
  riskProfile: InvestmentRiskProfile
  timelineMonths: number
  actions: IntelligenceAction[]
  dueDiligence: OpportunityDueDiligence
  governmentContact: OpportunityContact
  supportingData: string[]
}

export type OpportunityBucket = {
  id: InvestmentOpportunityCategory
  title: string
  narrative: string
  opportunities: InvestmentOpportunity[]
}

export type DueDiligenceHighlight = {
  label: string
  detail: string
}

export type GovernmentContact = OpportunityContact & { ministry: string }

export type InvestorNetworkContact = {
  name: string
  stage: string
  focus: string
  contact?: string
}

export type EntrepreneurIntelligenceResponse = {
  region: string
  profile: InvestmentProfile
  headline: string
  summary: string
  keySignals: IntelligenceSignal[]
  buckets: OpportunityBucket[]
  dueDiligenceHighlights: DueDiligenceHighlight[]
  recommendedNextSteps: IntelligenceAction[]
  governmentContacts: GovernmentContact[]
  investorNetwork: InvestorNetworkContact[]
  lastRefresh: string
}


