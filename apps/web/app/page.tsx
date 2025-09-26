"use client"
import { Header } from './components/layout/Header'
import { MainContent } from './components/layout/MainContent'
import { WidgetRenderer } from './components/dashboard/WidgetRenderer'
import { FloatingAIAssistant } from './components/ui/FloatingAIAssistant'
import { useRoleContext } from './context/RoleContext'
import { useRegionContext } from './context/RegionContext'
import { useDashboard } from './hooks/useDashboard'
import React from 'react'
import { OnboardingModal } from './components/onboarding/OnboardingModal'

export default function HomePage() {
  const { role } = useRoleContext()
  const { region } = useRegionContext()
  const { data, isLoading: dashboardsLoading, error: dashboardsError } = useDashboard(role, region)

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <div>
        <MainContent>
          <OnboardingModal />
          {/* Intelligence module grid */}
          {dashboardsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-64 bg-white border border-gray-200 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : dashboardsError ? (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
              <p className="font-semibold">Failed to load intelligence modules.</p>
              <p className="text-sm mt-1">{dashboardsError.message}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              <WidgetRenderer modules={data?.modules} />
            </div>
          )}
        </MainContent>
      </div>
      <FloatingAIAssistant />
    </main>
  )
}




