import React from 'react'
import type { ProvenanceItem } from '../../types/api'

export function ProvenancePanel({ sources }: { sources: ProvenanceItem[] }) {
  if (!sources || sources.length === 0) return null
  return (
    <div className="mt-3 border-t pt-3">
      <div className="text-sm font-medium text-gray-700 mb-2">Provenance</div>
      <ul className="space-y-1">
        {sources.map((s, i) => (
          <li key={i} className="text-xs text-gray-600 flex items-center justify-between gap-2">
            <span>
              <span className="font-medium">{s.dataset}</span>
              {s.timestamp ? <span className="text-gray-400"> · {s.timestamp}</span> : null}
              {s.recordId ? <span className="text-gray-400"> · {s.recordId}</span> : null}
              {s.link ? (
                <a href={s.link} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline ml-2">
                  View
                </a>
              ) : null}
            </span>
            <span className="text-gray-400">{Math.round((s.confidence ?? 0) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


