'use client'

import { ReactNode, createContext, useContext, useMemo } from 'react'
import { useSiwe } from './useSiwe'
import { Strategy, StrategySchema } from '@/lib/types/Strategy'
import useSWR from 'swr'

export interface UserContext {
  address: `0x${string}` | undefined
  strategies: Strategy[] | undefined
  hasStrategies: boolean
  fetchStrategies: () => Promise<void>
}

const context = createContext<UserContext>({} as UserContext)

export const useUser = () => useContext(context)

export default function UserProvider({ children }: { children: ReactNode }) {
  const { whoami } = useSiwe()
  const { strategies, fetchStrategies } = useStrategies()
  const hasStrategies = useMemo(() => (strategies?.length || 0) > 0, [strategies])
  return <context.Provider value={{
    address: whoami, strategies, hasStrategies, fetchStrategies
  }}>{children}</context.Provider>
}

function useStrategies() {
  const { signedIn } = useSiwe()

  const { data, mutate } = useSWR(
    signedIn ? '/api/user/strategies' : null,
    (...args) => fetch(...args, { method: 'POST' }).then(res => res.json())
  )

  const strategies = useMemo(() => {
    const result = StrategySchema.array().safeParse(data?.strategies)
    if(result.success) return result.data
    return undefined
  }, [data])

  return { strategies, fetchStrategies: mutate }
}
