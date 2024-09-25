import { EvmAddress } from '@kalani/lib/types'
import React, { createContext, useContext, useMemo, useState } from 'react'

type Context = {
  targetsRaw: string,
  setTargetsRaw: React.Dispatch<React.SetStateAction<string>>,
  targets: EvmAddress[],
  setTargets: React.Dispatch<React.SetStateAction<EvmAddress[]>>,
  frequency?: number,
  setFrequency: React.Dispatch<React.SetStateAction<number | undefined>>,
  repo?: string,
  setRepo: React.Dispatch<React.SetStateAction<string | undefined>>,
  isRepoValid: boolean,
  options: Record<string, any>,
  setOptions: React.Dispatch<React.SetStateAction<Record<string, any>>>
}

export const WhitelistContext = createContext<Context>({} as Context)

export function WhitelistProvider({ children }: { children: React.ReactNode }) {
  const [targetsRaw, setTargetsRaw] = useState<string>('')
  const [targets, setTargets] = useState<EvmAddress[]>([])
  const [frequency, setFrequency] = useState<number | undefined>()
  const [repo, setRepo] = useState<string | undefined>()
  const [options, setOptions] = useState<Record<string, any>>({})

  const githubRepoRegex = /^(https:\/\/)?(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/
  const isRepoValid = useMemo(() => {
    if (!repo) return false
    return githubRepoRegex.test(repo)
  }, [repo])

  return <WhitelistContext.Provider value={{
    targetsRaw, setTargetsRaw,
    targets, setTargets,
    frequency, setFrequency,
    repo, setRepo, isRepoValid,
    options, setOptions
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
