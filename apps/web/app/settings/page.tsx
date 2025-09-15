'use client'

import React from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { MainContent } from '../components/layout/MainContent'
import { DashboardCard } from '../components/dashboard/DashboardCard'
import { RoleSelector } from '../components/layout/RoleSelector'
import { useRoleContext } from '../context/RoleContext'

export default function SettingsPage() {
  const { role } = useRoleContext()
  const [region, setRegion] = React.useState('gasabo')
  const [q, setQ] = React.useState('')

  return (
    <main className="min-h-screen">
      <Header searchValue={q} onSearchChange={setQ} />
      <div className="flex">
        <Sidebar />
        <MainContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardCard title="Role">
              <RoleSelector />
              <div className="text-xs text-gray-500 mt-2">Current: {role}</div>
            </DashboardCard>
            <DashboardCard title="Region">
              <label className="text-sm text-gray-600">Default region</label>
              <input className="mt-2 w-full h-9 rounded border border-gray-200 px-3" value={region} onChange={(e) => setRegion(e.target.value)} />
            </DashboardCard>
          </div>
        </MainContent>
      </div>
    </main>
  )
}


