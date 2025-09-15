"use client"

import * as React from 'react'

export type Role = 'analyst' | 'citizen'

type RoleContextValue = {
  role: Role
  setRole: (r: Role) => void
}

const RoleContext = React.createContext<RoleContextValue | undefined>(undefined)

const STORAGE_KEY = 'rdi-role'

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = React.useState<Role>('analyst')

  React.useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved === 'analyst' || saved === 'citizen') setRoleState(saved)
    } catch {}
  }, [])

  const setRole = React.useCallback((r: Role) => {
    setRoleState(r)
    try {
      window.localStorage.setItem(STORAGE_KEY, r)
    } catch {}
  }, [])

  const value = React.useMemo(() => ({ role, setRole }), [role, setRole])
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>
}

export function useRoleContext() {
  const ctx = React.useContext(RoleContext)
  if (!ctx) throw new Error('useRoleContext must be used within RoleProvider')
  return ctx
}


