import { useSuspenseQuery } from '@tanstack/react-query'
import { AutomationStatsSchema } from '@kalani/lib/types'
import { useMemo } from 'react'
import { API_URL } from '../../../lib/env'

export function useYhaasStats() {
  const query = useSuspenseQuery({
    queryKey: ['yhaas-stats'],
    queryFn: () => fetch(`${API_URL}/api/yhaas/stats`).then(r => r.json())
  })

  const stats = useMemo(() => AutomationStatsSchema.parse(query.data), [query])
  return { ...query, stats }
}
