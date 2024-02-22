'use client'

import { ReactNode, createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export interface SiweContext {
  nonce: string | undefined
  whoami: `0x${string}` | undefined
  signingIn: boolean
  verifying: boolean
	signedIn: boolean
  fetchNonce: () => Promise<void>
  fetchWhoami: () => Promise<void>
  setSigningIn: (signingIn: boolean) => void
  setVerifying: (verifying: boolean) => void
}

const context = createContext<SiweContext>({} as SiweContext)

export const useSiwe = () => useContext(context)

export default function SiweProvider({ children }: { children: ReactNode }) {
  const [nonce, setNonce] = useState<string | undefined>()
  const [whoami, setWhoami] = useState<`0x${string}` | undefined>()
  const [signingIn, setSigningIn] = useState<boolean>(false)
  const [verifying, setVerifying] = useState<boolean>(false)
  const signedIn = useMemo(() => Boolean(whoami), [whoami])

  const fetchNonce = useCallback(async () => {
    setNonce((await(await fetch('/api/siwe/nonce')).json()).nonce)
  }, [setNonce])

  const fetchWhoami = useCallback(async () => {
    const result = (await(await fetch('/api/siwe/whoami')).json()).address
    if(result === null || result === undefined || result === '') {
      setWhoami(undefined)
    } else {
      setWhoami(result)
    }
  }, [setWhoami])

  useEffect(() => {
    Promise.all([fetchNonce(), fetchWhoami()])
  }, [fetchNonce, fetchWhoami])

  return <context.Provider value={{
    nonce, whoami, signingIn, verifying, signedIn,
    fetchNonce, fetchWhoami, setSigningIn, setVerifying
  }}>{children}</context.Provider>
}
