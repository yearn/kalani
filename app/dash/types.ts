import { z } from 'zod'

export const VaultSchema = z.object({
  chainId: z.number(),
  address: z.string(),
  name: z.string(),
  tvl: z.object({ close: z.number() }),
  apy: z.object({ close: z.number() }),
})

export type Vault = z.infer<typeof VaultSchema>
