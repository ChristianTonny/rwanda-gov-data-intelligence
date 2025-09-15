"use client"
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { MainContent } from './components/layout/MainContent'
import { ChartWidget } from './components/dashboard/ChartWidget'
import { DashboardCard } from './components/dashboard/DashboardCard'
import { WidgetRenderer } from './components/dashboard/WidgetRenderer'
import { SearchResults } from './components/search/SearchResults'
import { useRoleContext } from './context/RoleContext'
import { useRegionContext } from './context/RegionContext'
import { useDashboard } from './hooks/useDashboard'
import { useSearch } from './hooks/useSearch'
import type { SearchDoc } from './types/api'
import { useQueryAnswer } from './hooks/useQueryAnswer'
import React from 'react'
import { OnboardingModal } from './components/onboarding/OnboardingModal'
import { ExportButtons } from './components/common/ExportButtons'

export default function HomePage() {
  const { role } = useRoleContext()
  const { region } = useRegionContext()
  const { data, isLoading: dashboardsLoading } = useDashboard(role, region)
  const { q, setQ, results, isLoading: searching, error: searchError, activeIndex, setActiveIndex } = useSearch()
  const { question, setQuestion, submit, answer, isLoading: queryLoading, error } = useQueryAnswer()

  React.useEffect(() => {
    // Keep NL question in sync with the same input value
    setQuestion(q)
  }, [q, setQuestion])

  const onSelectDoc = (item: SearchDoc) => {
    setQ(item.text)
    setQuestion(item.text)
    submit()
  }

  const hasAnswer = !!answer

  return (
    <main className="min-h-screen">
      <Header
        searchValue={q}
        onSearchChange={setQ}
        onSearchSubmit={submit}
        searchItems={results}
        searchActiveIndex={activeIndex}
        onSearchActiveIndex={setActiveIndex}
        onSearchSelect={onSelectDoc}
        isSearching={searching}
        searchError={searchError?.message}
      />
      <div className="flex">
        <Sidebar />
        <MainContent>
          <OnboardingModal />
          <div className="flex items-center justify-end"><ExportButtons size="md" /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <WidgetRenderer widgets={data?.widgets?.slice(0, 3)} />
          </div>
          {hasAnswer ? (
            <div className="space-y-6">
              <DashboardCard title="AI Answer" showExport>
                <SearchResults results={answer ? { answer: answer.answer } : undefined} loading={queryLoading} provenance={answer?.provenance} error={error?.message} />
              </DashboardCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <ChartWidget title="Key Trends" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <ChartWidget title="Key Trends" />
            </div>
          )}
        </MainContent>
      </div>
    </main>
  )
}




