import React from 'react'
import type { ProvenanceItem } from '../../types/api'
import { ProvenancePanel } from './ProvenancePanel'

export function SearchResults({ results, loading, provenance, error }: { results?: { answer: string }; loading?: boolean; provenance?: ProvenanceItem[]; error?: string }) {
  if (loading) return <div className="text-sm text-gray-500">Loading...</div>
  if (!results) return null
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        {error ? <div className="text-sm text-red-600 mb-2">{error}</div> : null}
        <h3 className="text-lg font-semibold">{results.answer}</h3>
        {provenance ? <ProvenancePanel sources={provenance} /> : null}
      </div>
    </div>
  )
}
