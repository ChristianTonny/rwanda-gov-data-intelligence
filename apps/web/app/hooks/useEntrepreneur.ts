'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '../lib/api'
import type { EntrepreneurIntelligenceResponse } from '../types/api'

export function useEntrepreneur(region: string) {
  const query = useQuery({
    queryKey: ['entrepreneur', region],
    queryFn: () => fetchJson<EntrepreneurIntelligenceResponse>(`/api/entrepreneur?region=${encodeURIComponent(region)}`)
  })
  return { data: query.data, isLoading: query.isLoading, error: query.error as Error | null }
}



