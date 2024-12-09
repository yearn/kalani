import { getAddress } from 'viem'
import { z } from 'zod'

export const zhexstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]*$/.test(val))
export const HexStringSchema = zhexstring.transform(s => s)
export type HexString = z.infer<typeof HexStringSchema>

export const zevmaddressstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]{40}$/.test(val))
export const EvmAddressSchema = zevmaddressstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>

export const Erc20Schema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  symbol: z.string(),
  decimals: z.number()
})

export type Erc20 = z.infer<typeof Erc20Schema>

export const ROLES = {
  ADD_STRATEGY_MANAGER: 2n ** 0n,
  REVOKE_STRATEGY_MANAGER: 2n ** 1n,
  FORCE_REVOKE_MANAGER: 2n ** 2n,
  ACCOUNTANT_MANAGER: 2n ** 3n,
  QUEUE_MANAGER: 2n ** 4n,
  REPORTING_MANAGER: 2n ** 5n,
  DEBT_MANAGER: 2n ** 6n,
  MAX_DEBT_MANAGER: 2n ** 7n,
  DEPOSIT_LIMIT_MANAGER: 2n ** 8n,
  WITHDRAW_LIMIT_MANAGER: 2n ** 9n,
  MINIMUM_IDLE_MANAGER: 2n ** 10n,
  PROFIT_UNLOCK_MANAGER: 2n ** 11n,
  DEBT_PURCHASER: 2n ** 12n,
  EMERGENCY_MANAGER: 2n ** 13n
}

export const ALL_ROLES_MASK = Object.values(ROLES).reduce((acc, role) => acc | role, 0n)

export const PSEUDO_ROLES = {
  ROLE_MANAGER: 2n ** 255n
}

export function containsRole(rolemask: bigint, role: bigint) {
  return (rolemask & role) === role
}

export function* enumerateEnum<T>(enumObj: T): Generator<keyof T> {
  for (const key in enumObj) {
    if (isNaN(Number(key))) {
      yield key as keyof T
    }
  }
}

export const AccountRoleSchema = z.object({
  chainId: z.number(),
  vault: EvmAddressSchema,
  address: EvmAddressSchema,
  roleMask: z.bigint({ coerce: true })
})

export type AccountRole = z.infer<typeof AccountRoleSchema>

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
