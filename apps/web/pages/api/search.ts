import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { InMemorySearch } from '../../../../services/search/index'

const search = new InMemorySearch()
function ensureIndex() {
  if ((search as any)._ready) return
  const monorepoRoot = path.resolve(process.cwd(), '..', '..')
  const seededDir = path.join(monorepoRoot, 'data', 'seeded')
  const populations = JSON.parse(fs.readFileSync(path.join(seededDir, 'populations.json'), 'utf8') || '[]')
  const supplies = JSON.parse(fs.readFileSync(path.join(seededDir, 'supplies.json'), 'utf8') || '[]')
  const docs = [
    ...populations.map((p: any, i: number) => ({ id: `pop-${i}`, text: `${p.district_name} population ${p.population_total} (${p.source_year})`, dataset: 'nirs_population' })),
    ...supplies.map((s: any, i: number) => ({ id: `sup-${i}`, text: `${s.district_name} ${s.facility_name} ${s.item_name} qty:${s.qty}`, dataset: 'ministry_supplies' }))
  ]
  search.index(docs)
  ;(search as any)._ready = true
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const q = String(req.query.q ?? '')
  ensureIndex()
  if (!q) return res.status(400).json({ error: 'Missing q' })
  const results = search.query(q, 5)
  return res.status(200).json({ results })
}




