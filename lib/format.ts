import { formatUnits } from 'viem'

export function fEvmAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function fPercent(amount: number, fixed?: number) {
  return `${(amount * 100).toFixed(fixed ?? 2)}%`
}

export function fBps(bps: number, fixed?: number) {
  return fPercent(bps / 10_000, fixed)
}

export function fUSD(amount: number, options?: { fixed?: number }) {
  return fNumber(amount, { ...options, prefix: '$' })
}

export function fTokens(amount: bigint, decimals: number, options?: {
  fixed?: number
}) {
  const { fixed } = options ?? {}
  const units = formatUnits(amount, decimals)
  const number = Number(units)
  return Intl.NumberFormat(undefined, { 
    minimumFractionDigits: fixed ?? 2,
    maximumFractionDigits: fixed ?? 2
  }).format(number)
}

export function fNumber(amount: number, options?: { fixed?: number, prefix?: string }) {
  const fixed = Number.isInteger(options?.fixed) ? options?.fixed : 2
  let result = ''
  if(!Number.isFinite(amount)) result = 'NaN'
  else if (amount < 1000) result = amount.toFixed(fixed)
  else if (amount < 1e6) result = `${(amount / 1e3).toFixed(fixed)}K`
  else if (amount < 1e9) result = `${(amount / 1e6).toFixed(fixed)}M`
  else if (amount < 1e12) result = `${(amount / 1e9).toFixed(fixed)}B`
  else result = `${(amount / 1e12).toFixed(fixed)}T`
  if (options?.prefix) return `${options.prefix} ${result}`
  return result
}
