'use client'

import React from 'react'
import { Download } from 'lucide-react'

export function ExportButtons({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const base = size === 'md' ? 'text-sm px-3 py-1.5' : 'text-xs px-2 py-1'
  const onClick = (t: 'PDF' | 'CSV') => {
    if (typeof window !== 'undefined') window.alert(`Export to ${t} is coming soon.`)
  }
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onClick('PDF')}
        className={`inline-flex items-center gap-1 rounded border border-gray-200 hover:bg-gray-50 ${base}`}
        aria-label="Export PDF"
      >
        <Download className={size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'} /> PDF
      </button>
      <button
        type="button"
        onClick={() => onClick('CSV')}
        className={`inline-flex items-center gap-1 rounded border border-gray-200 hover:bg-gray-50 ${base}`}
        aria-label="Export CSV"
      >
        <Download className={size === 'md' ? 'h-4 w-4' : 'h-3.5 w-3.5'} /> CSV
      </button>
    </div>
  )
}


