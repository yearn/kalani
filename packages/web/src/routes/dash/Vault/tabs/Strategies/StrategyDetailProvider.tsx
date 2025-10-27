import { createContext, useContext, ReactNode } from 'react'
import { EvmAddress } from '@kalani/lib/types'

interface Strategy {
  chainId: number
  address: EvmAddress
  name: string
  allocation: number
  apy: number
}

interface StrategyDetailContextValue {
  strategy: Strategy
  isOpen: boolean
}

const StrategyDetailContext = createContext<StrategyDetailContextValue | null>(null)

export function StrategyDetailProvider({
  strategy,
  isOpen,
  children
}: {
  strategy: Strategy
  isOpen: boolean
  children: ReactNode
}) {
  return (
    <StrategyDetailContext.Provider value={{ strategy, isOpen }}>
      {children}
    </StrategyDetailContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStrategyDetail() {
  const context = useContext(StrategyDetailContext)
  if (!context) {
    throw new Error('useStrategyDetail must be used within StrategyDetailProvider')
  }
  return context
}
