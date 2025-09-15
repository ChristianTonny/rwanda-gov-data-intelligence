import type { NextApiRequest, NextApiResponse } from 'next'
import { extractPopulationToCsv, extractSuppliesToCsv } from '../../../../services/etl/excel_to_csv'
import path from 'path'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const root = process.cwd()
  extractPopulationToCsv(path.join(root, '2016_Annual_Statistical_booklets_V9_08_03_2018.xlsx'), path.join(root, 'data', 'nirs_population.csv'))
  extractSuppliesToCsv(path.join(root, 'Gasabo.xlsx'), path.join(root, 'data', 'ministry_supplies.csv'))
  return res.status(200).json({ status: 'ok' })
}




