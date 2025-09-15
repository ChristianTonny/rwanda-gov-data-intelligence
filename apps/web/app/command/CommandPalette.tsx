'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'

type Command = { label: string; href: string };

const DEFAULT_COMMANDS: Command[] = [
  { label: 'Go to Dashboard', href: '/' },
  { label: 'Open Recent', href: '/recent' },
  { label: 'Open Settings', href: '/settings' }
]

export function CommandPalette() {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return DEFAULT_COMMANDS
    return DEFAULT_COMMANDS.filter(c => c.label.toLowerCase().includes(q) || c.href.toLowerCase().includes(q))
  }, [query])

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (!open) return
      if (e.key === 'Escape') {
        e.preventDefault()
        setOpen(false)
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex(i => Math.min(i + 1, Math.max(0, filtered.length - 1)))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex(i => Math.max(i - 1, 0))
      }
      if (e.key === 'Enter') {
        const cmd = filtered[activeIndex]
        if (cmd) {
          e.preventDefault()
          setOpen(false)
          router.push(cmd.href)
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, filtered, activeIndex, router])

  React.useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[1000] bg-black/40" onClick={() => setOpen(false)}>
      <div className="mx-auto mt-24 w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b">
            <SearchIcon className="h-4 w-4 text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type a command or search..."
              className="w-full h-9 outline-none text-sm"
              aria-label="Command search"
            />
          </div>
          <div className="max-h-80 overflow-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-sm text-gray-500">No results</div>
            ) : (
              <ul>
                {filtered.map((c, idx) => (
                  <li key={c.href}>
                    <button
                      type="button"
                      onClick={() => { setOpen(false); router.push(c.href) }}
                      className={`w-full text-left px-3 py-2 text-sm ${idx === activeIndex ? 'bg-gray-50' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-gray-800">{c.label}</span>
                        <span className="text-[10px] text-gray-500">{c.href}</span>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="px-3 py-2 border-t text-[11px] text-gray-500 flex items-center justify-between">
            <span>Navigate with ↑ ↓, Enter to open</span>
            <span>Press Esc to close • Cmd/Ctrl+K to toggle</span>
          </div>
        </div>
      </div>
    </div>
  )
}



