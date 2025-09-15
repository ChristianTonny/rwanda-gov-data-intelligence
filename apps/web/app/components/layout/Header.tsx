"use client"
import React from 'react'
import { SearchBar } from '../search/SearchBar'
import { RoleSelector } from './RoleSelector'
import { SearchDropdown } from '../search/SearchDropdown'
import type { SearchDoc } from '../../types/api'
import { CommandPalette } from '../../command/CommandPalette'

export function Header({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  searchItems,
  searchActiveIndex,
  onSearchActiveIndex,
  onSearchSelect,
  isSearching,
  searchError
}: {
  searchValue: string
  onSearchChange: (v: string) => void
  onSearchSubmit?: () => void
  searchItems?: SearchDoc[]
  searchActiveIndex?: number
  onSearchActiveIndex?: (i: number) => void
  onSearchSelect?: (item: SearchDoc) => void
  isSearching?: boolean
  searchError?: string
}) {
  return (
    <header className="border-b bg-white px-4 md:px-6 py-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-xl font-semibold text-gray-900">🇷🇼 Rwanda Data Intelligence</div>
        <div className="relative w-full flex-1 min-w-0 md:max-w-xl">
          <SearchBar value={searchValue} onChange={onSearchChange} onSubmit={onSearchSubmit} />
          {searchValue?.trim() && searchItems ? (
            <SearchDropdown
              items={searchItems}
              activeIndex={searchActiveIndex ?? 0}
              onSelect={(item) => onSearchSelect?.(item)}
              loading={isSearching}
              error={searchError}
            />
          ) : null}
        </div>
        <RoleSelector />
      </div>
      <CommandPalette />
    </header>
  )
}
