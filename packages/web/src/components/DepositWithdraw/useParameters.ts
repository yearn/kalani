import { create } from 'zustand'
import { EvmAddress } from '@kalani/lib/types'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

interface Parameters {
  mode: 'deposit' | 'withdraw'
  setMode: (mode: 'deposit' | 'withdraw') => void
  chainId: number | undefined
  setChainId: (chainId?: number) => void
  wallet: EvmAddress | undefined
  setWallet: (address?: EvmAddress) => void
  vault: EvmAddress | undefined
  setVault: (address?: EvmAddress) => void
  amount: string
  setAmount: (amount: string) => void
}

export const useParameters = create<Parameters>((set) => ({
  mode: 'deposit',
  setMode: (mode) => set({ mode }),
  chainId: undefined,
  setChainId: (chainId) => set({ chainId }),
  wallet: undefined,
  setWallet: (address) => set({ wallet: address }),
  vault: undefined,
  setVault: (address) => set({ vault: address }),
  amount: '',
  setAmount: (amount) => set({ amount: amount }),
}))

export function useSuspendedParameters() {
  const { isConnected } = useAccount()
  const { mode, chainId, wallet, vault, amount, setAmount } = useParameters()

  const parameters = useMemo(() => {
    if (!isConnected || (chainId && wallet && vault)) { return { 
      mode, chainId, wallet, vault, amount, setAmount
    } }

    throw new Promise(() => {}) // suspend
  }, [mode, chainId, wallet, vault, amount, setAmount])

  return parameters
}
