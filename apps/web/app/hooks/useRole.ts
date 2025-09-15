'use client'

import * as React from 'react'
import type { Role } from '../types/api'

const STORAGE_KEY = 'rdi-role'

export function useRole() {
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

  return { role, setRole }
}


