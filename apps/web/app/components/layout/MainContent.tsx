import React from 'react'

export function MainContent({ children }: { children: React.ReactNode }) {
  return <section className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">{children}</section>
}
