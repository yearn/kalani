import { getAddress } from 'viem'
import { EvmAddressSchema } from './types'

export function isNothing(value?: string | null): boolean {
  return value === undefined || value === null || value.trim() === ''
}

export function isSomething(value?: string | null): boolean {
  return !isNothing(value)
}

export function isNumber(value?: string | number | null | undefined): boolean {
  if (typeof value === 'number') return !isNaN(value)
  if (typeof value === 'string') return isSomething(value) && !isNaN(Number(value.replace(/,/g, '')))
  return false
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

export function kabobCase(str: string) {
  return str
    .replace(/\s+/g, '-')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

export function parseInputNumberString(input: string): string {
	const result = input.replace(/[^\d.,]/g, '').replace(/,/g, '.')
	const firstPeriod = result.indexOf('.')
	if (firstPeriod === -1) {
		return result
	} else {
		const firstPart = result.slice(0, firstPeriod + 1)
		const lastPart = result.slice(firstPeriod + 1).replace(/\./g, '')
		return firstPart + lastPart
	}
}
