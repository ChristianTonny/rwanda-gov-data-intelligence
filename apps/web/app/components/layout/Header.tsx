'use client'
import React, { useState, useEffect, useRef } from 'react'
import { Search, Settings } from 'lucide-react'
import { useSearch } from '../../hooks/useSearch'
import { SearchDropdown } from '../search/SearchDropdown'
import type { SearchDoc } from '../../types/api'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const { q, setQ, results, isLoading: searching, error: searchError } = useSearch()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()

  // Global search keyboard shortcut
  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setIsSearchFocused(true)
      }
    }
    window.addEventListener('keydown', handleKeydown)
    return () => window.removeEventListener('keydown', handleKeydown)
  }, [])

  const onSelectDoc = (item: SearchDoc) => {
    setQ(item.text)
    setIsSearchFocused(false)
    searchInputRef.current?.blur()
  }

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <a href="/" className="flex items-center gap-2 text-lg font-bold text-gray-900 hover:text-blue-600 transition-colors">
            🇷🇼 <span className="hidden sm:inline">Data Intelligence</span>
          </a>

          {/* Centered Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={searchInputRef}
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 150)}
                placeholder="Search Rwanda's data... (Ctrl+K)"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            
            {/* Search Dropdown */}
            {(isSearchFocused && q.trim()) && (
              <div className="absolute top-full left-0 right-0 mt-1">
                <SearchDropdown
                  items={results}
                  activeIndex={0}
                  onSelect={onSelectDoc}
                  loading={searching}
                  error={searchError?.message}
                />
              </div>
            )}
          </div>

          {/* Settings */}
          <a 
            href="/settings" 
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <Link
              href="/"
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname === '/' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/entrepreneur"
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname?.startsWith('/entrepreneur')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover-border-gray-300'
              }`}
            >
              Entrepreneur
            </Link>
            <Link
              href="/recent"
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                pathname?.startsWith('/recent')
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover-border-gray-300'
              }`}
            >
              Recent
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
