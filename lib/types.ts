import { getAddress } from 'viem'
import { z } from 'zod'

export const zevmaddressstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]{40}$/.test(val))
export const zvaultType = z.enum(['vault', 'strategy'])

export const EvmAddressSchema = zevmaddressstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>
