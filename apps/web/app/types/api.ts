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

export type KpiWidgetData = {
  type: 'kpi'
  title: string
  value: string | number
  source?: string
}

export type ChartWidgetData = {
  type: 'chart'
  title: string
  data: Array<Record<string, string | number>>
  xKey?: string
  yKey?: string
}

export type AlertsWidgetData = {
  type: 'alerts'
  title: string
  items: Array<{ text: string }>
}

export type DashboardWidget = KpiWidgetData | ChartWidgetData | AlertsWidgetData

export type DashboardResponse = {
  role: Role
  region: string
  widgets: DashboardWidget[]
}

export type PopulationDataPoint = {
  district_name: string
  population_total: number
  source_year?: number | string
}


