import { create } from 'zustand'
import { EvmAddress } from '@kalani/lib/types'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'

interface DepositParameters {
  chainId: number | undefined
  setChainId: (chainId?: number) => void
  wallet: EvmAddress | undefined
  setWallet: (address?: EvmAddress) => void
  vault: EvmAddress | undefined
  setVault: (address?: EvmAddress) => void
  amount: string
  setAmount: (amount: string) => void
}

export const useDepositParameters = create<DepositParameters>((set) => ({
  chainId: undefined,
  setChainId: (chainId) => set({ chainId }),
  wallet: undefined,
  setWallet: (address) => set({ wallet: address }),
  vault: undefined,
  setVault: (address) => set({ vault: address }),
  amount: '',
  setAmount: (amount) => set({ amount: amount }),
}))

export function useSuspendedDepositParameters() {
  const { isConnected } = useAccount()
  const { chainId, wallet, vault, amount, setAmount } = useDepositParameters()

  const parameters = useMemo(() => {
    if (!isConnected || (chainId && wallet && vault)) { return { 
      chainId, wallet, vault, amount, setAmount
    } }

    throw new Promise(() => {}) // suspend
  }, [chainId, wallet, vault, amount, setAmount])

  return parameters
}
