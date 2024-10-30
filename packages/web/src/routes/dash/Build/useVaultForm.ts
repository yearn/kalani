import { isSomething } from '@kalani/lib/strings'
import { Erc20, Erc20Schema, EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useMemo } from 'react'
import { z } from 'zod'
import { create } from 'zustand'
import { useSelectedProject } from '../../../components/SelectProject'

export const VaultFormDataSchema = z.object({
  asset: Erc20Schema.optional(),
  setAsset: z.function().args(Erc20Schema.optional()).returns(z.void()),
  category: z.number().optional(),
  setCategory: z.function().args(z.number()).returns(z.void()),
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
  category: 1,
  setCategory: (category: number) => set({ category }),
  name: undefined,
  setName: (name: string | undefined) => set({ name }),
  symbol: undefined,
  setSymbol: (symbol: string | undefined) => set({ symbol }),
  newAddress: undefined,
  setNewAddress: (newAddress: EvmAddress | undefined) => set({ newAddress }),
  reset: () => set({ 
    asset: undefined,
    category: undefined,
    name: undefined,
    symbol: undefined,
    newAddress: undefined
  })
}))

export function useVaultFormValidation() {
  const { asset, category, name, symbol } = useVaultFormData()
  const { selectedProject } = useSelectedProject()

  const projectIdValidation = useMemo(() => {
    return {
      isValid: isSomething(selectedProject?.id),
      message: 'Project ID is required'
    }
  }, [selectedProject])

  const assetValidation = useMemo(() => {
    return {
      isValid: asset !== undefined,
      message: 'Asset is required'
    }
  }, [asset])

  const categoryValidation = useMemo(() => {
    return {
      isValid: (category ?? 0) > 0,
      message: 'Category is required'
    }
  }, [category])

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
    return projectIdValidation.isValid
      && assetValidation.isValid
      && categoryValidation.isValid
      && nameValidation.isValid
      && symbolValidation.isValid
  }, [projectIdValidation, assetValidation, categoryValidation, nameValidation, symbolValidation])

  return {
    projectIdValidation,
    assetValidation,
    categoryValidation,
    nameValidation,
    symbolValidation,
    isFormValid
  }
}
