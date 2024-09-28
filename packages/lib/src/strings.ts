import { getAddress } from 'viem'
import { EvmAddressSchema } from './types'

export function isNothing(value?: string | null): boolean {
  return value === undefined || value === null || value.trim() === ''
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function ellipsize(str?: string, maxLength: number = 20) {
  if (!str) return str
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function compareEvmAddresses(a?: string, b?: string) {
  if (!a || !b) return false

  try {
    return EvmAddressSchema.parse(getAddress(a)) === EvmAddressSchema.parse(getAddress(b))
  } catch {
    return false
  }
}
