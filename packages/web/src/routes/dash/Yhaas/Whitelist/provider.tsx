import { EvmAddress } from '@kalani/lib/types'
import React, { createContext, useContext, useState } from 'react'

type Context = {
  targetsRaw: string,
  setTargetsRaw: React.Dispatch<React.SetStateAction<string>>,
  targets: EvmAddress[],
  setTargets: React.Dispatch<React.SetStateAction<EvmAddress[]>>,
  repo?: string,
  setRepo: React.Dispatch<React.SetStateAction<string | undefined>>,
  frequency?: number,
  setFrequency: React.Dispatch<React.SetStateAction<number | undefined>>
}

export const WhitelistContext = createContext<Context>({} as Context)

export function WhitelistProvider({ children }: { children: React.ReactNode }) {
  const [targetsRaw, setTargetsRaw] = useState<string>('')
  const [targets, setTargets] = useState<EvmAddress[]>([])
  const [repo, setRepo] = useState<string | undefined>()
  const [frequency, setFrequency] = useState<number | undefined>()

  return <WhitelistContext.Provider value={{
    targetsRaw, setTargetsRaw,
    targets, setTargets,
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
