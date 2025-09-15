'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '../lib/api'

type EntrepreneurResponse = {
  region: string
  items: Array<{ district_name: string; score: number; population?: number; supplies?: number }>
}

export function useEntrepreneur(region: string) {
  const query = useQuery({
    queryKey: ['entrepreneur', region],
    queryFn: () => fetchJson<EntrepreneurResponse>(`/api/entrepreneur?region=${encodeURIComponent(region)}`)
  })
  return { data: query.data, isLoading: query.isLoading, error: query.error as Error | null }
}



