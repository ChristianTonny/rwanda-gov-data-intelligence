export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const base = (process.env.NEXT_PUBLIC_API_BASE ?? 'http://localhost:4000').replace(/\/$/, '')
  const fullUrl = url.startsWith('http') ? url : `${base}${url.startsWith('/') ? url : `/${url}`}`
  const res = await fetch(fullUrl, init)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed: ${res.status}`)
  }
  return (await res.json()) as T
}


