'use client'

import * as React from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '../lib/api'
import type { SearchResponse } from '../types/api'

export function useSearch() {
  const [q, setQ] = React.useState('')
  const [activeIndex, setActiveIndex] = React.useState(0)

  const debounced = useDebounced(q, 300)

  const query = useQuery({
    queryKey: ['search', debounced],
    queryFn: () => fetchJson<SearchResponse>(`/api/search?q=${encodeURIComponent(debounced)}`),
    enabled: debounced.trim().length > 0
  })

  React.useEffect(() => {
    setActiveIndex(0)
  }, [debounced])

  return { q, setQ, results: query.data?.results ?? [], isLoading: query.isLoading, error: query.error as Error | null, activeIndex, setActiveIndex }
}

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}


