'use client'

import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RoleProvider } from './context/RoleContext'
import { ToastProvider } from './toast/ToastProvider'
import { RegionProvider } from './context/RegionContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <RoleProvider>
        <RegionProvider>
          <ToastProvider>{children}</ToastProvider>
        </RegionProvider>
      </RoleProvider>
    </QueryClientProvider>
  )
}
