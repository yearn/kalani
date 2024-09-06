import React, { createContext, useContext, useMemo, useState } from 'react'
import { EvmAddress, EvmAddressSchema } from '../../../../lib/types'

type Context = {
  target?: string,
  setTarget: React.Dispatch<React.SetStateAction<string | undefined>>,
  targetOrUndefined: EvmAddress | undefined,
  repo?: string,
  setRepo: React.Dispatch<React.SetStateAction<string | undefined>>,
  frequency?: number,
  setFrequency: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const WhitelistContext = createContext<Context>({} as Context)

export function WhitelistProvider({ children }: { children: React.ReactNode }) {
  const [target, setTarget] = useState<string | undefined>()
  const targetOrUndefined = useMemo(() => {
    const parsed = EvmAddressSchema.safeParse(target)
    if (parsed.success) return parsed.data
    return undefined
  }, [target])

  const [repo, setRepo] = useState<string | undefined>()
  const [frequency, setFrequency] = useState<number | undefined>()

  return <WhitelistContext.Provider value={{
    target, setTarget, targetOrUndefined,
    repo, setRepo,
    frequency, setFrequency
    }}>
    {children}
  </WhitelistContext.Provider>
}

export function useWhitelist() {
  const context = useContext(WhitelistContext)
  if (context === undefined) {
    throw new Error('useWhitelist must be used within a WhitelistProvider')
  }
  return context
}
