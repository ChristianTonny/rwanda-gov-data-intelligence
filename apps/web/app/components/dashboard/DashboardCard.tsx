import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'

export function DashboardCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
