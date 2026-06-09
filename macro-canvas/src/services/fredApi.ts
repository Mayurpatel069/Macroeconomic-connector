import type { DataPoint } from '../types'

// Requests go to Vite's local proxy (/fred-api/*) which forwards to api.stlouisfed.org
// This bypasses browser-level geo-blocking on the FRED server
const FRED_BASE = '/fred-api'
const STORAGE_KEY = 'fred_api_key'

export function getApiKey(): string | null {
  return localStorage.getItem(STORAGE_KEY)
}

export function setApiKey(key: string): void {
  localStorage.setItem(STORAGE_KEY, key)
}

export function removeApiKey(): void {
  localStorage.removeItem(STORAGE_KEY)
}

interface FredObservation {
  date: string
  value: string
}

interface FredResponse {
  observations: FredObservation[]
}

export async function fetchSeriesData(
  seriesId: string,
  options: {
    startDate?: string
    endDate?: string
    limit?: number
    frequency?: string
  } = {}
): Promise<DataPoint[]> {
  const apiKey = getApiKey()
  if (!apiKey) throw new Error('NO_API_KEY')

  // When startDate is provided, use a high limit to capture all data in range
  const limit = options.limit ?? (options.startDate ? 10000 : 120)

  const params = new URLSearchParams({
    series_id: seriesId,
    api_key: apiKey,
    file_type: 'json',
    sort_order: 'asc',
    limit: String(limit),
  })

  if (options.startDate) params.set('observation_start', options.startDate)
  if (options.endDate) params.set('observation_end', options.endDate)
  if (options.frequency) params.set('frequency', options.frequency)

  const url = `${FRED_BASE}/series/observations?${params.toString()}`
  const res = await fetch(url)

  if (!res.ok) {
    const text = await res.text()
    if (res.status === 400 && text.includes('api_key')) throw new Error('INVALID_API_KEY')
    throw new Error(`FRED API error ${res.status}`)
  }

  const json: FredResponse = await res.json()

  return json.observations
    .filter((o) => o.value !== '.' && o.value !== '')
    .map((o) => ({ date: o.date, value: parseFloat(o.value) }))
}

export async function validateApiKey(key: string): Promise<boolean> {
  const params = new URLSearchParams({
    series_id: 'FEDFUNDS',
    api_key: key,
    file_type: 'json',
    limit: '1',
  })
  try {
    const res = await fetch(`${FRED_BASE}/series/observations?${params.toString()}`)
    return res.ok
  } catch {
    return false
  }
}
