import { z } from 'zod'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { create } from 'zustand'

export const WhitelistDataSchema = z.object({
  targetsRaw: z.string(),
  setTargetsRaw: z.function().args(z.string()).returns(z.void()),
  targets: EvmAddressSchema.array(),
  setTargets: z.function().args(EvmAddressSchema.array()).returns(z.void()),
  frequency: z.number().optional(),
  setFrequency: z.function().args(z.number()).returns(z.void()),
  repo: z.string().optional(),
  setRepo: z.function().args(z.string()).returns(z.void()),
  isRepoValid: z.boolean(),
  options: z.record(z.any()),
  setOptions: z.function().args(z.record(z.any())).returns(z.void())
})

export type WhitelistData = z.infer<typeof WhitelistDataSchema>

export const useWhitelist = create<WhitelistData>(set => ({
  targetsRaw: '',
  setTargetsRaw: (targetsRaw: string) => set({ targetsRaw }),
  targets: [],
  setTargets: (targets: EvmAddress[]) => set({ targets }),
  frequency: undefined,
  setFrequency: (frequency: number) => set({ frequency }),
  repo: undefined,
  setRepo: (repo: string) => set({ repo }),
  isRepoValid: false,
  options: {},
  setOptions: (options: Record<string, any>) => set({ options })
}))
