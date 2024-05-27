import { getAddress } from 'viem'
import { z } from 'zod'

export const zhexstring = z.custom<`0x${string}`>((val: any) => /^0x/.test(val))
export const zvaultType = z.enum(['vault', 'strategy'])

export const EvmAddressSchema = zhexstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>
