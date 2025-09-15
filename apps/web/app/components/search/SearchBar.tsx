import React from 'react'
import { Search as SearchIcon } from 'lucide-react'

export function SearchBar({ value, onChange, onSubmit, placeholder }: { value: string; onChange: (v: string) => void; onSubmit?: () => void; placeholder?: string }) {
  return (
    <div className="relative w-full max-w-xl">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <input
        className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 outline-none focus:border-brand"
        placeholder={placeholder ?? 'Ask anything about Rwanda...'}
        aria-label="Search Rwanda data"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit?.()
        }}
      />
    </div>
  )
}
