import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Row = { district_name: string; score: number; population?: number; supplies?: number }

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store')
  const region = String(req.query.region ?? 'gasabo').toLowerCase()
  const monorepoRoot = path.resolve(process.cwd(), '..', '..')
  const seededDir = path.join(monorepoRoot, 'data', 'seeded')
  const populations: Array<{ district_name?: string; population_total?: number }> = JSON.parse(
    fs.readFileSync(path.join(seededDir, 'populations.json'), 'utf8') || '[]'
  )
  const supplies: Array<{ district_name?: string; qty?: number; facility_name?: string; item_name?: string }> = JSON.parse(
    fs.readFileSync(path.join(seededDir, 'supplies.json'), 'utf8') || '[]'
  )

  const popByDistrict = new Map<string, number>()
  for (const p of populations) {
    const key = String(p.district_name ?? '').toLowerCase()
    if (!key) continue
    const prev = popByDistrict.get(key) ?? 0
    popByDistrict.set(key, prev + (Number(p.population_total ?? 0) || 0))
  }

  const suppliesByDistrict = new Map<string, number>()
  for (const s of supplies) {
    const key = String(s.district_name ?? '').toLowerCase()
    if (!key) continue
    const prev = suppliesByDistrict.get(key) ?? 0
    suppliesByDistrict.set(key, prev + (Number(s.qty ?? 0) || 0))
  }

  // Heuristic: underserved score = population / (supplies + 1)
  const rows: Row[] = []
  for (const [district, pop] of popByDistrict) {
    const sup = suppliesByDistrict.get(district) ?? 0
    const score = pop / (sup + 1)
    rows.push({ district_name: district, score, population: pop, supplies: sup })
  }

  // If a region is provided, prioritize exact match to appear first (but still return top 5 by score)
  const sorted = rows.sort((a, b) => b.score - a.score)
  const top = sorted.slice(0, 5)

  return res.status(200).json({ region, items: top })
}



