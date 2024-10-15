import { isSomething } from '@kalani/lib/strings'
import { Erc20, Erc20Schema, EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { z } from 'zod'
import { create } from 'zustand'

export const VaultFormDataSchema = z.object({
  asset: Erc20Schema.optional(),
  setAsset: z.function().args(Erc20Schema.optional()).returns(z.void()),
  profitMaxUnlockTime: z.number({ coerce: true }).optional(),
  setProfitMaxUnlockTime: z.function().args(z.number({ coerce: true }).optional()).returns(z.void()),
  name: z.string().optional(),
  setName: z.function().args(z.string()).returns(z.void()),
  symbol: z.string().optional(),
  setSymbol: z.function().args(z.string()).returns(z.void()),
  newAddress: EvmAddressSchema.optional(),
  setNewAddress: z.function().args(EvmAddressSchema.optional()).returns(z.void()),
  reset: z.function().returns(z.void())
})

export type VaultFormData = z.infer<typeof VaultFormDataSchema>

export const useVaultFormData = create<VaultFormData>(set => ({
  asset: undefined,
  setAsset: (asset: Erc20 | undefined) => set({ asset }),
  profitMaxUnlockTime: undefined,
  setProfitMaxUnlockTime: (profitMaxUnlockTime: number | undefined) => set({ profitMaxUnlockTime }),
  name: undefined,
  setName: (name: string | undefined) => set({ name }),
  symbol: undefined,
  setSymbol: (symbol: string | undefined) => set({ symbol }),
  newAddress: undefined,
  setNewAddress: (newAddress: EvmAddress | undefined) => set({ newAddress }),
  reset: () => set({ 
    asset: undefined,
    profitMaxUnlockTime: undefined,
    name: undefined,
    symbol: undefined,
    newAddress: undefined
  })
}))

export function useVaultFormValidation() {
  const { chainId } = useAccount()
  const { asset, profitMaxUnlockTime, name, symbol } = useVaultFormData()

  const assetValidation = useMemo(() => {
    return {
      isValid: asset !== undefined,
      message: 'Asset is required'
    }
  }, [asset])

  const profitMaxUnlockTimeValidation = useMemo(() => {
    const days = (profitMaxUnlockTime ?? 0) / 60 / 60 / 24
    const recommended = chainId === 1 ? 5 : 3
    return {
      isValid: days >= recommended,
      message: `We recommend at least ${recommended} days`
    }
  }, [chainId, profitMaxUnlockTime])

  const nameValidation = useMemo(() => {
    return {
      isValid: isSomething(name),
      message: 'Name is required'
    }
  }, [name])

  const symbolValidation = useMemo(() => {
    return {
      isValid: isSomething(symbol),
      message: 'Symbol is required'
    }
  }, [symbol])

  const isFormValid = useMemo(() => {
    return assetValidation.isValid 
      && profitMaxUnlockTimeValidation.isValid 
      && nameValidation.isValid 
      && symbolValidation.isValid
  }, [assetValidation, profitMaxUnlockTimeValidation, nameValidation, symbolValidation])

  return {
    assetValidation,
    profitMaxUnlockTimeValidation,
    nameValidation,
    symbolValidation,
    isFormValid
  }
}
