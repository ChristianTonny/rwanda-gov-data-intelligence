'use client'

import * as React from 'react'

type RegionContextValue = {
  region: string
  setRegion: (r: string) => void
}

const RegionContext = React.createContext<RegionContextValue | undefined>(undefined)

const STORAGE_KEY = 'rdi-region'

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = React.useState<string>('gasabo')

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved && typeof saved === 'string') setRegionState(saved)
    } catch {}
  }, [])

  const setRegion = React.useCallback((r: string) => {
    setRegionState(r)
    try {
      window.localStorage.setItem(STORAGE_KEY, r)
    } catch {}
  }, [])

  const value = React.useMemo(() => ({ region, setRegion }), [region, setRegion])
  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegionContext() {
  const ctx = React.useContext(RegionContext)
  if (!ctx) throw new Error('useRegionContext must be used within RegionProvider')
  return ctx
}



