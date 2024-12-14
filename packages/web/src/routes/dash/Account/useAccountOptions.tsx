import { create } from 'zustand'
import { z } from 'zod'

export const AccountOptionsSchema = z.object({
  sortKey: z.enum(['tvl', 'apy']),
  setSortKey: z.function().args(z.enum(['tvl', 'apy'])).returns(z.void()),
  sortDirection: z.enum(['asc', 'desc'])
})

export type AccountOptions = z.infer<typeof AccountOptionsSchema>

export const useAccountOptions = create<AccountOptions>(set => ({
  sortKey: 'tvl',
  setSortKey: (sortKey: 'tvl' | 'apy') => 
    set(current => ({ 
      sortKey,
      sortDirection: sortKey === current.sortKey ? current.sortDirection === 'asc' ? 'desc' : 'asc' : 'desc'
    })),
  sortDirection: 'desc'
}))
