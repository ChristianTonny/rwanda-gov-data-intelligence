"use client"

import React from 'react'

type Region = {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
}

const regions: Region[] = [
  { id: 'rubavu', name: 'Rubavu', x: 20, y: 25, width: 60, height: 35 },
  { id: 'musanze', name: 'Musanze', x: 90, y: 20, width: 70, height: 35 },
  { id: 'nyabihu', name: 'Nyabihu', x: 55, y: 70, width: 55, height: 35 },
  { id: 'nyarugenge', name: 'Nyarugenge', x: 120, y: 100, width: 35, height: 35 },
  { id: 'gasabo', name: 'Gasabo', x: 160, y: 60, width: 80, height: 40 },
  { id: 'kicukiro', name: 'Kicukiro', x: 160, y: 110, width: 80, height: 40 },
  { id: 'rwamagana', name: 'Rwamagana', x: 250, y: 110, width: 80, height: 35 },
  { id: 'nyagatare', name: 'Nyagatare', x: 300, y: 40, width: 80, height: 35 },
  { id: 'huye', name: 'Huye', x: 140, y: 170, width: 60, height: 35 }
]

export default function RwandaMap({ onSelect }: { onSelect?: (id: string) => void }) {
  const [selected, setSelected] = React.useState<string | null>(null)

  const handleSelect = (id: string) => {
    setSelected(id)
    if (onSelect) onSelect(id)
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <svg
        viewBox="0 0 400 260"
        className="w-full h-auto border rounded-md bg-white"
        aria-labelledby="rwanda-map-title"
        role="img"
      >
        <title id="rwanda-map-title">Rwanda districts (placeholder map)</title>
        <desc>Clickable simplified regions. Not geographically accurate.</desc>
        <g aria-label="Rwanda districts">
          {regions.map((r) => {
            const isActive = selected === r.id
            const fill = isActive ? '#2563eb' : '#e5e7eb'
            const textFill = isActive ? '#ffffff' : '#111827'
            return (
              <g
                key={r.id}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                aria-label={`${r.name} region`}
                onClick={() => handleSelect(r.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleSelect(r.id)
                  }
                }}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.width}
                  height={r.height}
                  fill={fill}
                  stroke="#111827"
                  strokeWidth={1.5}
                  rx={6}
                  ry={6}
                />
                <title>{r.name}</title>
                <text
                  x={r.x + r.width / 2}
                  y={r.y + r.height / 2}
                  dominantBaseline="middle"
                  textAnchor="middle"
                  fontSize={10}
                  fill={textFill}
                >
                  {r.name}
                </text>
              </g>
            )
          })}
        </g>
      </svg>
      <div className="mt-3 text-sm text-gray-700">
        {selected ? (
          <span>
            Selected region: <span className="font-medium">{regions.find((r) => r.id === selected)?.name}</span>
          </span>
        ) : (
          <span>Click a region to select</span>
        )}
      </div>
    </div>
  )
}


