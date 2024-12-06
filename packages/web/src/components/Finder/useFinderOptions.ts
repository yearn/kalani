import { create } from 'zustand'
import { z } from 'zod'

export const FinderOptionsSchema = z.object({
  query: z.string(),
  setQuery: z.function().args(z.string()).returns(z.void()),
  sortKey: z.enum(['tvl', 'apy']),
  setSortKey: z.function().args(z.enum(['tvl', 'apy'])).returns(z.void()),
  sortDirection: z.enum(['asc', 'desc'])
})

export type FinderOptions = z.infer<typeof FinderOptionsSchema>

export const useFinderOptions = create<FinderOptions>(set => ({
  query: '',
  setQuery: (query: string) => set({ query }),
  sortKey: 'tvl',
  setSortKey: (sortKey: 'tvl' | 'apy') => {
    return set(current => ({ 
      sortKey,
      sortDirection: sortKey === current.sortKey ? current.sortDirection === 'asc' ? 'desc' : 'asc' : 'desc'
    }))
  },
  sortDirection: 'desc'
}))
