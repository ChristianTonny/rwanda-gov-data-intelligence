import React from 'react'

export function MainContent({ children }: { children: React.ReactNode }) {
  return <section className="flex-1 p-6 space-y-6">{children}</section>
}
