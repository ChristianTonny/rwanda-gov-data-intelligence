import React from 'react'
import type { ProvenanceItem } from '../../types/api'
import { ProvenancePanel } from './ProvenancePanel'
import { useToast } from '../../toast/ToastProvider'
import { Download } from 'lucide-react'

export function SearchResults({ results, loading, provenance, error }: { results?: { answer: string }; loading?: boolean; provenance?: ProvenanceItem[]; error?: string }) {
  const { show } = useToast()
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="bg-white p-6 rounded-lg border">
          <div className="h-5 w-48 bg-gray-100 rounded skeleton" />
          <div className="h-4 w-64 bg-gray-100 rounded skeleton mt-3" />
          <div className="h-4 w-56 bg-gray-100 rounded skeleton mt-2" />
        </div>
      </div>
    )
  }
  if (!results) return null
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border transition-shadow duration-200 hover:shadow-md">
        {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold flex-1 text-gray-900">{results.answer}</h3>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => show({ title: 'Coming soon', description: 'Export to PDF is coming soon.' })} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              <Download className="h-3.5 w-3.5" /> PDF
            </button>
            <button type="button" onClick={() => show({ title: 'Coming soon', description: 'Export to CSV is coming soon.' })} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
              <Download className="h-3.5 w-3.5" /> CSV
            </button>
          </div>
        </div>
        {provenance ? <ProvenancePanel sources={provenance} /> : null}
      </div>
    </div>
  )
}
