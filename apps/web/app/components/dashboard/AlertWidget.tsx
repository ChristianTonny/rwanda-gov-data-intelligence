import React from 'react'
import { AlertCircle } from 'lucide-react'

interface AlertWidgetProps {
  title: string
  alerts: string[]
  count: number
}

export function AlertWidget({ title, alerts, count }: AlertWidgetProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <AlertCircle className="h-5 w-5 text-gray-400" />
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{count}</div>
      {alerts.length > 0 && (
        <div className="space-y-1">
          {alerts.map((alert, index) => (
            <div key={index} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              {alert}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
