import fs from 'fs'
import path from 'path'

function parseCsv(file: string) {
  if (!fs.existsSync(file)) return []
  const text = fs.readFileSync(file, 'utf8')
  const linesAll = text.split(/\r?\n/)
  const lines = linesAll.filter(l => l.length > 0)
  if (lines.length === 0) return []
  const [headerLine, ...rows] = lines
  if (!headerLine) return []
  const headers = headerLine.length ? headerLine.split(',') : []
  if (headers.length === 0) return []
  return rows.map(l => {
    const parts = l.split(',')
    const row: Record<string, string> = {}
    headers.forEach((h, i) => (row[h] = parts[i] ?? ''))
    return row
  })
}

export async function seedLocalJson() {
  const root = process.cwd()
  const dataDir = path.join(root, 'data')
  const outDir = path.join(root, 'data', 'seeded')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const popCsv = path.join(dataDir, 'nirs_population.csv')
  const supCsv = path.join(dataDir, 'ministry_supplies.csv')
  const populations = fs.existsSync(popCsv) ? parseCsv(popCsv) : []
  const supplies = fs.existsSync(supCsv) ? parseCsv(supCsv) : []

  fs.writeFileSync(path.join(outDir, 'populations.json'), JSON.stringify(populations, null, 2))
  fs.writeFileSync(path.join(outDir, 'supplies.json'), JSON.stringify(supplies, null, 2))
  console.log('Seeded local JSON to data/seeded')
}

if (require.main === module) {
  seedLocalJson()
}




