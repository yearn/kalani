import { isSomething } from '@kalani/lib/strings'
import { AccountRole, AccountRoleSchema, Erc20, Erc20Schema, EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useMemo } from 'react'
import { z } from 'zod'
import { create } from 'zustand'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'

export const VaultFormDataSchema = z.object({
  asset: Erc20Schema.optional(),
  setAsset: z.function().args(Erc20Schema.optional()).returns(z.void()),
  category: z.number().optional(),
  setCategory: z.function().args(z.number().optional()).returns(z.void()),
  name: z.string().optional(),
  setName: z.function().args(z.string()).returns(z.void()),
  symbol: z.string().optional(),
  setSymbol: z.function().args(z.string()).returns(z.void()),
  newAddress: EvmAddressSchema.optional(),
  setNewAddress: z.function().args(EvmAddressSchema.optional()).returns(z.void()),
  accounts: z.array(AccountRoleSchema).optional(),
  setAccounts: z.function().args(z.array(AccountRoleSchema).optional()).returns(z.void()),
  inceptBlock: z.bigint({ coerce: true }).optional(),
  setInceptBlock: z.function().args(z.bigint({ coerce: true })).returns(z.void()),
  inceptTime: z.number({ coerce: true }).optional(),
  setInceptTime: z.function().args(z.number({ coerce: true })).returns(z.void()),
  reset: z.function().returns(z.void())
})

export type VaultFormData = z.infer<typeof VaultFormDataSchema>

export const useVaultFormData = create<VaultFormData>(set => ({
  asset: undefined,
  setAsset: (asset: Erc20 | undefined) => set({ asset }),
  category: undefined,
  setCategory: (category: number | undefined) => set({ category }),
  name: undefined,
  setName: (name: string | undefined) => set({ name }),
  symbol: undefined,
  setSymbol: (symbol: string | undefined) => set({ symbol }),
  newAddress: undefined,
  setNewAddress: (newAddress: EvmAddress | undefined) => set({ newAddress }),
  accounts: undefined,
  setAccounts: (accounts: AccountRole[] | undefined) => set({ accounts }),
  inceptBlock: undefined,
  setInceptBlock: (inceptBlock: bigint | undefined) => set({ inceptBlock }),
  inceptTime: undefined,
  setInceptTime: (inceptTime: number | undefined) => set({ inceptTime }),
  reset: () => set({ 
    asset: undefined,
    category: undefined,
    name: undefined,
    symbol: undefined,
    newAddress: undefined,
    accounts: undefined,
    inceptBlock: undefined,
    inceptTime: undefined
  })
}))

export function useVaultFormValidation() {
  const { asset, category, name, symbol, newAddress, inceptBlock, inceptTime } = useVaultFormData()
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

  const isDeployed = useMemo(() => {
    return isSomething(newAddress) && inceptBlock !== undefined && inceptTime !== undefined
  }, [newAddress, inceptBlock, inceptTime])

  return {
    projectIdValidation,
    assetValidation,
    categoryValidation,
    nameValidation,
    symbolValidation,
    isFormValid,
    isDeployed
  }
}
