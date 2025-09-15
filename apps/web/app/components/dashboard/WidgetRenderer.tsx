import React from 'react'
import type { DashboardWidget } from '../../types/api'
import { KpiWidget } from './KpiWidget'
import { ChartWidget } from './ChartWidget'
import { AlertWidget } from './AlertWidget'
import { PopulationChart } from './PopulationChart'

export function WidgetRenderer({ widgets }: { widgets: DashboardWidget[] | undefined }) {
  if (!widgets || widgets.length === 0) return null
  return (
    <>
      {widgets.map((w, idx) => {
        if (w.type === 'kpi') return <KpiWidget key={idx} label={w.title} value={w.value} source={w.source} />
        if (w.type === 'alerts') return <AlertWidget key={idx} title={w.title} alerts={w.items.map(i => i.text)} count={w.items.length} />
        if (w.type === 'chart') {
          const series = normalizeChartData(w)
          return (
            <ChartWidget key={idx} title={w.title}>
              {series.length > 0 ? <PopulationChart data={series} /> : null}
            </ChartWidget>
          )
        }
        return null
      })}
    </>
  )
}

function normalizeChartData(w: Extract<DashboardWidget, { type: 'chart' }>): Array<{ name: string; value: number }> {
  const xKey = (w as any).xKey || 'name'
  const yKey = (w as any).yKey || 'value'
  // Support array of numbers or array of objects
  if (Array.isArray(w.data) && typeof w.data[0] === 'number') {
    return (w.data as number[]).map((v, i) => ({ name: String(i + 1), value: v }))
  }
  return (w.data as any[]).map((row) => ({ name: String(row[xKey] ?? row.name ?? ''), value: Number(row[yKey] ?? row.value ?? 0) }))
}


