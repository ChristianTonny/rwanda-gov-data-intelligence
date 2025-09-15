import React from 'react'
import { useRoleContext } from '../../context/RoleContext'

export function RoleSelector({ className }: { className?: string }) {
  const { role, setRole } = useRoleContext()

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.currentTarget.value === 'analyst' ? 'analyst' : 'citizen'
    setRole(next)
  }, [setRole])

  return (
    <div className={className}>
      <label className="sr-only" htmlFor="role-select">Role</label>
      <select
        id="role-select"
        className="h-9 rounded-md border border-gray-200 bg-white px-3 text-sm"
        value={role}
        onChange={handleChange}
        aria-label="Select role"
      >
        <option value="analyst">Analyst</option>
        <option value="citizen">Citizen</option>
      </select>
    </div>
  )
}


