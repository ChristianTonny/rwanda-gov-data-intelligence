import React from 'react'
import { notFound } from 'next/navigation'

export default function WorkspacePage() {
  const enabled = process.env.NEXT_PUBLIC_FEATURE_WORKSPACE === 'true'
  if (!enabled) return notFound()
  return (
    <main className="min-h-screen">
      <div className="flex">
        <aside className="hidden md:block w-56 lg:w-64 bg-gray-50 border-r p-4">
          <nav className="space-y-1">
            <a href="#" className="block px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Documents</a>
            <a href="#" className="block px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">Datasets</a>
            <a href="#" className="block px-3 py-2 text-sm rounded-md text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">People</a>
          </nav>
        </aside>
        <section className="flex-1 p-4 md:p-6 lg:p-8 space-y-6">
          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">Collaboration Workspace</h1>
            <p className="text-sm text-gray-600 mt-1">UI-only scaffold. No backend yet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div className="md:col-span-2 bg-white border rounded-xl p-4 shadow-sm min-h-[300px]">
              <h2 className="text-lg font-semibold text-gray-900">Document</h2>
              <div className="mt-2 text-sm text-gray-600">Placeholder content area.</div>
            </div>
            <div className="bg-white border rounded-xl p-4 shadow-sm min-h-[300px]">
              <h2 className="text-lg font-semibold text-gray-900">Comments</h2>
              <ul className="mt-2 space-y-2">
                <li className="text-sm text-gray-700 bg-gray-50 p-2 rounded">No comments yet.</li>
                <li className="text-sm text-gray-700 bg-gray-50 p-2 rounded">Add your thoughts here…</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}


