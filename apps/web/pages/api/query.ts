import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'
import { answerQuery } from '../../../services/llm/adapter'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { question } = req.body as { question?: string }
  if (!question) return res.status(400).json({ error: 'Missing question' })

  const root = process.cwd()
  const seededDir = path.join(root, 'data', 'seeded')
  const populations = JSON.parse(fs.readFileSync(path.join(seededDir, 'populations.json'), 'utf8') || '[]')
  const supplies = JSON.parse(fs.readFileSync(path.join(seededDir, 'supplies.json'), 'utf8') || '[]')
  const context = [
    ...populations.slice(0, 5).map((p: any) => ({ text: `${p.district_name} population ${p.population_total} (${p.source_year})`, dataset: 'nirs_population' })),
    ...supplies.slice(0, 5).map((s: any) => ({ text: `${s.district_name} ${s.facility_name} ${s.item_name} qty:${s.qty}`, dataset: 'ministry_supplies' }))
  ]

  const ans = await answerQuery({ question, contextDocs: context })
  return res.status(200).json(ans)
}




