import fetch from 'node-fetch'

type Answer = {
  answer: string
  provenance: Array<{ dataset: string; timestamp?: string; recordId?: string; link?: string; confidence: number; explanation?: string }>
  tokens?: number
  cost?: number
}

export async function answerQuery({ question, contextDocs }: { question: string; contextDocs: Array<{ text: string; link?: string; dataset?: string; timestamp?: string }> }): Promise<Answer> {
  const provider = process.env.MODEL_PROVIDER ?? 'gemini'
  if (provider !== 'gemini') {
    return { answer: 'Mock: no provider configured', provenance: [], tokens: 0, cost: 0 }
  }
  const key = process.env.GEMINI_KEY
  const model = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash'
  const prompt = [
    'System: You are an assistant that answers factual governance queries using only provided data.',
    'Always include source name, timestamp, and data row link. If missing data, say you do not have enough evidence and suggest next steps.',
    `Context: ${JSON.stringify(contextDocs.slice(0, 5))}`,
    `Question: ${question}`,
    'Instruction: Keep answer short (1-2 sentences), then bullet provenance list, then a link to dashboard.'
  ].join('\n')
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-goog-api-key': key ?? '' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  })
  const json: any = await res.json()
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No answer.'
  return {
    answer: text,
    provenance: contextDocs.map(d => ({ dataset: d.dataset ?? 'unknown', timestamp: d.timestamp, link: d.link, confidence: 0.7 }))
  }
}




