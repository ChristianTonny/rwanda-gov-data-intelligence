import React from 'react'
import type { IntelligenceModule } from '../../types/api'
import { IntelligenceModuleCard } from '../ui/IntelligenceModuleCard'

export function WidgetRenderer({ modules }: { modules: IntelligenceModule[] | undefined }) {
  if (!modules || modules.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <div className="text-gray-400 mb-2">📊</div>
        <p className="text-gray-500">Loading intelligence modules...</p>
      </div>
    )
  }

  return (
    <>
      {modules.map((module) => (
        <IntelligenceModuleCard key={module.id} module={module} />
      ))}
    </>
  )
}


