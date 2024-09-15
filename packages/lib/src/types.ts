import { getAddress } from 'viem'
import { z } from 'zod'

export const zhexstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]*$/.test(val))
export const HexStringSchema = zhexstring.transform(s => s)
export type HexString = z.infer<typeof HexStringSchema>

export const zevmaddressstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]{40}$/.test(val))
export const EvmAddressSchema = zevmaddressstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>

export const YhaasExecutorSchema = z.object({
  address: z.string(),
  block: z.bigint({ coerce: true }),
  automations: z.number({ coerce: true }),
  gas: z.bigint({ coerce: true })
})

export type YhaasExecutor = z.infer<typeof YhaasExecutorSchema>

export const AutomationStatsSchema = z.record(
  z.string(), z.object({ executors: YhaasExecutorSchema.array() })
)

export type AutomationStats = z.infer<typeof AutomationStatsSchema>
