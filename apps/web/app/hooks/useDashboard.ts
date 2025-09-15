'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchJson } from '../lib/api'
import type { DashboardResponse, Role } from '../types/api'

export function useDashboard(role: Role, region: string) {
  const query = useQuery({
    queryKey: ['dashboards', role, region],
    queryFn: () => fetchJson<DashboardResponse>(`/api/dashboards?role=${role}&region=${encodeURIComponent(region)}`)
  })
  return { data: query.data, isLoading: query.isLoading, error: query.error as Error | null }
}


