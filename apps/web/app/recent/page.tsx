'use client'

import React from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { MainContent } from '../components/layout/MainContent'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { useSearch } from '../hooks/useSearch'
import { useQueryAnswer } from '../hooks/useQueryAnswer'

export default function RecentPage() {
  const { q, setQ } = useSearch()
  const { setQuestion, submit } = useQueryAnswer()

  React.useEffect(() => {
    setQuestion(q)
  }, [q, setQuestion])

  return (
    <main className="min-h-screen">
      <Header searchValue={q} onSearchChange={setQ} onSearchSubmit={submit} />
      <div className="flex">
        <Sidebar />
        <MainContent>
          <DashboardCard title="Recent Activity">
            <p className="text-sm text-gray-600">No recent activity yet.</p>
          </DashboardCard>
        </MainContent>
      </div>
    </main>
  )
}


