import { useSuspenseQuery } from '@tanstack/react-query'
import { AutomationStatsSchema } from '@kalani/lib/types'
import { useMemo } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export function useYhaasStats() {
  const query = useSuspenseQuery({
    queryKey: ['yhaas-stats'],
    queryFn: () => fetch(`${API}/api/yhaas/stats`).then(r => r.json())
  })

  const stats = useMemo(() => AutomationStatsSchema.parse(query.data), [query])
  return { ...query, stats }
}
