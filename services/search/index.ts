export type SearchDoc = { id: string; text: string; link?: string; dataset?: string; timestamp?: string }

export class InMemorySearch {
  private docs: SearchDoc[] = []
  index(docs: SearchDoc[]) {
    this.docs = docs
  }
  query(q: string, limit = 5) {
    const terms = q.toLowerCase().split(/\s+/)
    const scored = this.docs.map(d => ({
      d,
      score: terms.reduce((s, t) => s + (d.text.toLowerCase().includes(t) ? 1 : 0), 0)
    }))
    return scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(s => s.d)
  }
}




