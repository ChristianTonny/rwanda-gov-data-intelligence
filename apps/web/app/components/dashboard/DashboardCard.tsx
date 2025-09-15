import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Download } from 'lucide-react'
import { useToast } from '../../toast/ToastProvider'

export function DashboardCard({ title, children, showExport }: { title: string; children: React.ReactNode; showExport?: boolean }) {
  const { show } = useToast()
  const handleExport = (type: 'pdf' | 'csv') => {
    show({ title: 'Coming soon', description: `Export to ${type.toUpperCase()} is coming soon.` })
  }
  return (
    <Card className="transition-all duration-200 hover:shadow-md focus-within:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showExport ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => handleExport('pdf')} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                <Download className="h-3.5 w-3.5" /> PDF
              </button>
              <button type="button" onClick={() => handleExport('csv')} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-gray-200 hover:bg-gray-50 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2">
                <Download className="h-3.5 w-3.5" /> CSV
              </button>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
