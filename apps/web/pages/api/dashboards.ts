import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const role = String(req.query.role ?? 'analyst')
  const region = String(req.query.region ?? 'gasabo')
  const root = process.cwd()
  const seededDir = path.join(root, 'data', 'seeded')
  const populations = JSON.parse(fs.readFileSync(path.join(seededDir, 'populations.json'), 'utf8') || '[]')
  const popGasabo = populations.find((p: any) => (p.district_name ?? '').toLowerCase().includes(region))
  const widgets = [
    { type: 'kpi', title: 'Population', value: popGasabo?.population_total ?? '—', source: 'nirs_population' },
    { type: 'chart', title: 'Coverage vs Demand (stub)', data: [10, 12, 9, 15] },
    { type: 'alerts', title: 'Alerts', items: [{ text: 'Data freshness check OK' }] }
  ]
  return res.status(200).json({ role, region, widgets })
}




