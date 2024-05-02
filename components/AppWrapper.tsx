'use client'

import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import { Cache, SWRConfig } from 'swr'

function localStorageProvider() {
  const hasWindow = typeof window !== 'undefined'
  if(!hasWindow) return new Map() as Cache<any>
  const map = new Map(JSON.parse(localStorage.getItem('swr-cache') || '[]'))
  window.addEventListener('beforeunload', () => {
    const cache = JSON.stringify(Array.from(map.entries()))
    localStorage.setItem('swr-cache', cache)
  })
  return map as Cache<any>
}

// <SWRConfig value={{ provider: localStorageProvider }}>

export default function AppWrapper ({ children }: { children: React.ReactNode }) {
  return <SWRConfig>
    <WithYearn supportedChains={[mainnet, polygon]}>
      <>
        <Header />
        {children}
      </>
    </WithYearn>
  </SWRConfig>
}
