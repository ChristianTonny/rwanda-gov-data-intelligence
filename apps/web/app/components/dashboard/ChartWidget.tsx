import React from 'react'

export function ChartWidget({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm transition-shadow duration-200 hover:shadow-md">
      <div className="text-lg font-semibold mb-4">{title}</div>
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        {children ?? 'Chart coming in Phase 2'}
      </div>
    </div>
  )
}
