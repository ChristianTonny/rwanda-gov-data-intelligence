'use client'

import React from 'react'
import { Header } from '../components/layout/Header'
import { MainContent } from '../components/layout/MainContent'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { FloatingAIAssistant } from '../components/ui/FloatingAIAssistant'
import { fetchJson } from '../lib/api'

export default function RecentPage() {
  const [items, setItems] = React.useState<Array<{ id: string; ts: string; type: string; [k: string]: any }>>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let mounted = true
    async function load() {
      try {
        setLoading(true)
        const res = await fetchJson<{ items: any[] }>(`/api/events?limit=50`)
        if (mounted) setItems(res.items || [])
      } catch (e: any) {
        if (mounted) setError(e?.message || String(e))
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    const t = setInterval(load, 10000)
    return () => {
      mounted = false
      clearInterval(t)
    }
  }, [])

  return (
    <main className="min-h-screen">
      <Header />
      <div>
        <MainContent>
          <DashboardCard title="Recent Activity">
            {loading ? <p className="text-sm text-gray-600">Loading…</p> : null}
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            {!loading && !error && items.length === 0 ? (
              <p className="text-sm text-gray-600">No recent activity yet.</p>
            ) : (
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500">
                      <th className="py-2 pr-4">Time</th>
                      <th className="py-2 pr-4">Type</th>
                      <th className="py-2 pr-4">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((e) => (
                      <tr key={e.id} className="border-t">
                        <td className="py-2 pr-4 whitespace-nowrap">{new Date(e.ts).toLocaleString()}</td>
                        <td className="py-2 pr-4 capitalize">{e.type}</td>
                        <td className="py-2 pr-4 text-gray-600">{e.type === 'search' ? `q=${e.q} results=${e.results}` : e.type === 'query' ? `tokens=${e.tokens}` : ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DashboardCard>
        </MainContent>
      </div>
      <FloatingAIAssistant />
    </main>
  )
}


