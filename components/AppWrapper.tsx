'use client'

import { WithYearn } from '@yearn-finance/web-lib/contexts/WithYearn'
import { mainnet, polygon } from '@wagmi/chains'
import Header from '@/components/header'
import SiweProvider from '@/hooks/useSiwe'
import UserProvider from '@/hooks/useUser'
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

export default function AppWrapper ({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ provider: localStorageProvider }}>
    <WithYearn supportedChains={[mainnet, polygon]}>
      <SiweProvider>
        <UserProvider>
          <Header />
          {children}
        </UserProvider>
      </SiweProvider>
    </WithYearn>
  </SWRConfig>
}
