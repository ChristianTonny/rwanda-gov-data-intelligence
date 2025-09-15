import React from 'react'

export function KpiWidget({ label, value, source }: { label: string; value: string | number; source?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-3xl font-bold mt-2">{value}</div>
      {source ? <div className="text-xs text-gray-400 mt-1">Source: {source}</div> : null}
    </div>
  )}
