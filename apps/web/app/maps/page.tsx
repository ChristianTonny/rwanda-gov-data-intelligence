import { notFound } from 'next/navigation'
import dynamic from 'next/dynamic'

const RwandaMap = dynamic(() => import('../components/maps/RwandaMap'), { ssr: false })

export default function MapsPage() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_MAPS === '1' || process.env.NEXT_PUBLIC_ENABLE_MAPS === 'true'
  if (!enabled) {
    notFound()
  }
  return (
    <main className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto space-y-4">
        <h1 className="text-2xl font-semibold">Maps</h1>
        <p className="text-sm text-gray-600">Feature preview: Rwanda districts (placeholder). Click a region.</p>
        <RwandaMap />
      </div>
    </main>
  )
}


