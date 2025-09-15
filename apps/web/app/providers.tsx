'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RoleProvider } from './context/RoleContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>{children}</RoleProvider>
    </QueryClientProvider>
  )
}
