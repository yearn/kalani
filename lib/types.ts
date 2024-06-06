import { getAddress } from 'viem'
import { z } from 'zod'

export const zevmaddressstring = z.custom<`0x${string}`>((val: any) => /^0x[a-fA-F0-9]{40}$/.test(val))
export const zvaultType = z.enum(['vault', 'strategy'])

export const EvmAddressSchema = zevmaddressstring.transform(s => getAddress(s))
export type EvmAddress = z.infer<typeof EvmAddressSchema>

export enum Roles {
  ADD_STRATEGY_MANAGER = 2 ** 0,
  REVOKE_STRATEGY_MANAGER = 2 ** 1,
  FORCE_REVOKE_MANAGER = 2 ** 2,
  ACCOUNTANT_MANAGER = 2 ** 3,
  QUEUE_MANAGER = 2 ** 4,
  REPORTING_MANAGER = 2 ** 5,
  DEBT_MANAGER = 2 ** 6,
  MAX_DEBT_MANAGER = 2 ** 7,
  DEPOSIT_LIMIT_MANAGER = 2 ** 8,
  WITHDRAW_LIMIT_MANAGER = 2 ** 9,
  MINIMUM_IDLE_MANAGER = 2 ** 10,
  PROFIT_UNLOCK_MANAGER = 2 ** 11,
  DEBT_PURCHASER = 2 ** 12,
  EMERGENCY_MANAGER = 2 ** 13
}

export const ROLE_MANAGER_PSEUDO_ROLE = 2n ** 255n

export function* enumerateEnum<T>(enumObj: T): Generator<keyof T> {
  for (const key in enumObj) {
    if (isNaN(Number(key))) {
      yield key as keyof T
    }
  }
}
