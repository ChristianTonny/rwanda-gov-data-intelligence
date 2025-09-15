import React from 'react'

type Row = { facility?: string; item?: string; qty?: number; district?: string }

export function SuppliesTable({ rows }: { rows: Row[] }) {
  if (!rows || rows.length === 0) return <div className="text-sm text-gray-500">No data</div>
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500">
            <th className="py-2 pr-4">Facility</th>
            <th className="py-2 pr-4">Item</th>
            <th className="py-2 pr-4">Qty</th>
            <th className="py-2 pr-4">District</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t">
              <td className="py-2 pr-4">{r.facility ?? '—'}</td>
              <td className="py-2 pr-4">{r.item ?? '—'}</td>
              <td className="py-2 pr-4">{r.qty ?? '—'}</td>
              <td className="py-2 pr-4">{r.district ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}


