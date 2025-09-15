import React from 'react'
import type { SearchDoc } from '../../types/api'

export function SearchDropdown({ items, activeIndex, onSelect, loading, error }: { items: SearchDoc[]; activeIndex: number; onSelect: (item: SearchDoc) => void; loading?: boolean; error?: string }) {
  return (
    <div className="absolute left-0 right-0 top-11 z-50 bg-white border border-gray-200 rounded-lg shadow-md max-h-80 overflow-auto">
      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">Documents</div>
      {loading ? (
        <div className="p-3 text-sm text-gray-500">Searching…</div>
      ) : error ? (
        <div className="p-3 text-sm text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="p-3 text-sm text-gray-500">No documents found. Try "Gasabo population"</div>
      ) : (
        <ul className="py-1">
          {items.map((it, idx) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => onSelect(it)}
                className={`w-full text-left px-3 py-2 text-sm ${idx === activeIndex ? 'bg-gray-50' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800 truncate">{truncate(it.text, 120)}</span>
                  {it.dataset ? <span className="ml-2 inline-flex items-center rounded bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">{it.dataset}</span> : null}
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function truncate(s: string, n: number) {
  if (s.length <= n) return s
  return s.slice(0, n - 1) + '…'
}


