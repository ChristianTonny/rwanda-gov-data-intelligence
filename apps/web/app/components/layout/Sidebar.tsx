import React from 'react'

const NavigationItem = ({ label, active, href }: { label: string; active?: boolean; href: string }) => (
  <a
    href={href}
    className={
      'block px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-gray-50 ' +
      (active
        ? 'text-blue-700'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900')
    }
  >
    {label}
  </a>
)

export function Sidebar() {
  const items = [
    { label: 'Dashboard', href: '/', active: true },
    { label: 'Entrepreneur', href: '/entrepreneur' },
    { label: 'Recent', href: '/recent' },
    { label: 'Settings', href: '/settings' }
  ]
  return (
    <aside className="hidden md:block w-56 lg:w-60 bg-gray-50 border-r p-3">
      <nav className="space-y-1">
        {items.map((it) => (
          <NavigationItem key={it.label} label={it.label} href={it.href} active={it.active} />
        ))}
      </nav>
    </aside>
  )
}
