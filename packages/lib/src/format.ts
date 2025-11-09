import { formatUnits } from 'viem'

export function fElipsize(text: string, length = 48) {
  return text.length <= length ? text : `${text.slice(0, length)}...`
}

export function fHexString(hex: string, short = false) {
  const result = `${hex.slice(0, 6)}...${hex.slice(-4)}`
  return short ? result.slice(0, 6) : result
}

export function fEvmAddress(address: string, short = false) {
  return fHexString(address, short)
}

export function fPercent(amount: number | undefined | null, options?: { fixed?: number, padding?: { length: number, fill?: string } }) {
  if (amount === undefined || amount === null) return undefined

  const { fixed, padding } = options ?? {}

  let result = ''
  if ((amount * 100) > 999) { result = `999.99%` }
  else { result = `${(amount * 100).toFixed(fixed ?? 2)}%` }

  if (padding) {
    const [whole] = result.split('.')
    const adjustedPadding = result.length + Math.max(0, padding.length - whole.length)
    result = result.padStart(adjustedPadding, padding.fill ?? ' ')
  }

  return result
}

export function fBps(bps: number, options?: { percent?: boolean, fixed?: number, padding?: { length: number, fill?: string } }) {
  if (options?.percent) return fPercent(bps / 10_000, options)
  return `${bps} bps`
}

export function fUSD(amount: number, options?: { fixed?: number, full?: boolean, padding?: { length: number, fill?: string } }) {
  return fNumber(amount, { ...options, prefix: '$' })
}

export function fTokens(amount: bigint, decimals: number, options?: {
  fixed?: number,
  orInfiniteIfGt?: number,
  truncate?: boolean
}) {
  const { fixed, orInfiniteIfGt, truncate } = options ?? {}
  const units = formatUnits(amount, decimals)
  const number = Number(units)
  if (orInfiniteIfGt && number > orInfiniteIfGt) return '∞'
  if (truncate) return fNumber(number, { fixed })
  return Intl.NumberFormat(undefined, {
    minimumFractionDigits: fixed ?? 2,
    maximumFractionDigits: fixed ?? 2
  }).format(number)
}

export function fFixed(amount: number, options?: { accuracy?: number, locale?: string  }) {
  const { accuracy = 2, locale } = options || {}
  const [whole, fraction] = amount.toFixed(accuracy).split('.')
  const formattedWhole = new Intl.NumberFormat(locale).format(parseInt(whole))
  const formattedFraction = (fraction || '0'.repeat(accuracy)).slice(0, accuracy)
  if (accuracy > 0) return `${formattedWhole}.${formattedFraction}`
  return formattedWhole
}

export function fNumber(
amount: number, 
options?: { 
  fixed?: number, 
  prefix?: string, 
  full?: boolean, 
  padding?: { length: number, fill?: string }
}) {
  const fixed = Number.isInteger(options?.fixed) ? options?.fixed : 2
  const full = options?.full
  const padding = options?.padding ?? 0
  let result = ''
  if(!Number.isFinite(amount)) result = 'NaN'
  else if (!full && amount < 1000) result = amount.toFixed(fixed)
  else if (!full && amount < 1e6) result = `${(amount / 1e3).toFixed(fixed)}K`
  else if (!full && amount < 1e9) result = `${(amount / 1e6).toFixed(fixed)}M`
  else if (!full && amount < 1e12) result = `${(amount / 1e9).toFixed(fixed)}B`
  else if (!full) result = `${(amount / 1e12).toFixed(fixed)}T`
  else result = fFixed(amount, { accuracy: fixed })

  if (padding) {
    const [whole] = result.split('.')
    const adjustedPadding = result.length + Math.max(0, padding.length - whole.length)
    result = result.padStart(adjustedPadding, padding.fill ?? ' ')
  }

  if (options?.prefix) return `${options.prefix} ${result}`
  return result
}

export function fBlockTime(blockTime: number) {
  const date = new Date(Number(blockTime) * 1000)
  return date.toLocaleDateString()
}
