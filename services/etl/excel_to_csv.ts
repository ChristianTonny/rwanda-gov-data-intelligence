import fs from 'fs'
import path from 'path'
import xlsx from 'xlsx'

function writeCsv(filePath: string, rows: Array<Record<string, string | number | null>>) {
  const headers = Object.keys(rows[0] ?? {})
  const lines = [headers.join(','), ...rows.map(r => headers.map(h => `${r[h] ?? ''}`).join(','))]
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8')
}                   

export function extractPopulationToCsv(inputXlsx: string, outCsv: string) {
  const wb = xlsx.readFile(inputXlsx)
  const sheetName = wb.SheetNames[0]
  const sheet = wb.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json<Record<string, any>>(sheet)
  const rows = data.map(r => ({
    district_name: String(r['District'] ?? r['district'] ?? r['DISTRICT'] ?? '').trim(),
    population_total: Number(r['Population'] ?? r['population'] ?? r['Total'] ?? 0),
    source_year: String(r['Year'] ?? r['year'] ?? '2016')
  })).filter(r => r.district_name)
  writeCsv(outCsv, rows)
}

export function extractSuppliesToCsv(inputXlsx: string, outCsv: string) {
  const wb = xlsx.readFile(inputXlsx)
  const sheetName = wb.SheetNames[0]
  const sheet = wb.Sheets[sheetName]
  const data = xlsx.utils.sheet_to_json<Record<string, any>>(sheet)
  const rows = data.map(r => ({
    facility_code: String(r['Facility Code'] ?? r['facility_code'] ?? r['Code'] ?? '').trim(),
    facility_name: String(r['Facility Name'] ?? r['facility_name'] ?? r['Name'] ?? '').trim(),
    district_name: String(r['District'] ?? r['district'] ?? '').trim(),
    item_name: String(r['Item'] ?? r['item_name'] ?? r['Commodity'] ?? '').trim(),
    qty: Number(r['Quantity'] ?? r['qty'] ?? 0),
    last_updated: String(r['Last Updated'] ?? r['Date'] ?? '').trim()
  })).filter(r => r.facility_code)
  writeCsv(outCsv, rows)
}

if (require.main === module) {
  const root = process.cwd()
  const book = path.join(root, '2016_Annual_Statistical_booklets_V9_08_03_2018.xlsx')
  const gasabo = path.join(root, 'Gasabo.xlsx')
  const outDir = path.join(root, 'data')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
  extractPopulationToCsv(book, path.join(outDir, 'nirs_population.csv'))
  extractSuppliesToCsv(gasabo, path.join(outDir, 'ministry_supplies.csv'))
  console.log('Extracted CSVs to data/ folder')
}




