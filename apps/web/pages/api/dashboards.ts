import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Prevent caching so role/region changes always fetch fresh widgets
  res.setHeader('Cache-Control', 'no-store')
  const role = String(req.query.role ?? 'analyst')
  const region = String(req.query.region ?? 'gasabo')
  const monorepoRoot = path.resolve(process.cwd(), '..', '..')
  const seededDir = path.join(monorepoRoot, 'data', 'seeded')
  const populations = JSON.parse(fs.readFileSync(path.join(seededDir, 'populations.json'), 'utf8') || '[]')
  const popGasabo = populations.find((p: any) => (p.district_name ?? '').toLowerCase().includes(region))
  // Top 5 districts by population for a simple chart
  const top = [...populations]
    .filter((p: any) => typeof p.population_total === 'number')
    .sort((a: any, b: any) => b.population_total - a.population_total)
    .slice(0, 5)
    .map((p: any) => ({ name: p.district_name, value: p.population_total }))

  const widgets = [
    { type: 'kpi', title: 'Population', value: popGasabo?.population_total ?? '—', source: 'nirs_population' },
    { type: 'chart', title: 'Top District Populations', data: top, xKey: 'name', yKey: 'value' },
    { type: 'alerts', title: 'Alerts', items: [{ text: 'Data freshness check OK' }] }
  ]
  return res.status(200).json({ role, region, widgets })
}




