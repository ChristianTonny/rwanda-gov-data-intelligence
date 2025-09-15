"use client"
import React from 'react'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { MainContent } from '../components/layout/MainContent'
import { useRegionContext } from '../context/RegionContext'
import { useEntrepreneur } from '../hooks/useEntrepreneur'
import { useSearch } from '../hooks/useSearch'
import type { SearchDoc } from '../types/api'

const FEATURE_FLAG = process.env.NEXT_PUBLIC_FEATURE_ENTREPRENEUR === '1'

export default function EntrepreneurPage() {
  const { region } = useRegionContext()
  const { data, isLoading, error } = useEntrepreneur(region)
  const { q, setQ, results, isLoading: searching, error: searchError, activeIndex, setActiveIndex } = useSearch()

  const onSelectDoc = (item: SearchDoc) => {
    setQ(item.text)
  }

  if (!FEATURE_FLAG) {
    return (
      <main className="min-h-screen">
        <Header
          searchValue={q}
          onSearchChange={setQ}
          searchItems={results}
          searchActiveIndex={activeIndex}
          onSearchActiveIndex={setActiveIndex}
          onSearchSelect={onSelectDoc}
          isSearching={searching}
          searchError={searchError?.message}
        />
        <div className="flex">
          <Sidebar />
          <MainContent>
            <div className="text-sm text-gray-600">This page is behind a feature flag. Set NEXT_PUBLIC_FEATURE_ENTREPRENEUR=1 to enable.</div>
          </MainContent>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header
        searchValue={q}
        onSearchChange={setQ}
        searchItems={results}
        searchActiveIndex={activeIndex}
        onSearchActiveIndex={setActiveIndex}
        onSearchSelect={onSelectDoc}
        isSearching={searching}
        searchError={searchError?.message}
      />
      <div className="flex">
        <Sidebar />
        <MainContent>
          <h1 className="text-xl font-semibold">Top 5 underserved areas</h1>
          {isLoading ? (
            <div className="mt-4 space-y-2">
              <div className="h-8 bg-gray-100 rounded skeleton" />
              <div className="h-8 bg-gray-100 rounded skeleton" />
              <div className="h-8 bg-gray-100 rounded skeleton" />
            </div>
          ) : error ? (
            <div className="mt-4 text-sm text-red-600">{error.message}</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-4">District</th>
                    <th className="py-2 pr-4">Population</th>
                    <th className="py-2 pr-4">Supplies</th>
                    <th className="py-2 pr-4">Underserved score</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.map((r, i) => (
                    <tr key={i} className="border-t">
                      <td className="py-2 pr-4 capitalize">{r.district_name}</td>
                      <td className="py-2 pr-4">{r.population ?? '—'}</td>
                      <td className="py-2 pr-4">{r.supplies ?? '—'}</td>
                      <td className="py-2 pr-4">{r.score.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3">Heuristic: population / (supplies + 1). Demo only.</p>
        </MainContent>
      </div>
    </main>
  )
}



