import type { NextApiRequest, NextApiResponse } from 'next'

let tasks: Array<{ id: string; title: string; entityId?: string }> = []

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, entityId } = req.body as { title?: string; entityId?: string }
    if (!title) return res.status(400).json({ error: 'Missing title' })
    const id = String(tasks.length + 1)
    const t = { id, title, entityId }
    tasks.push(t)
    return res.status(200).json(t)
  }
  if (req.method === 'GET') return res.status(200).json({ tasks })
  return res.status(405).end()
}




