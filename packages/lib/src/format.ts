import { formatUnits } from 'viem'

export function fElipsize(text: string, length = 48) {
  return text.length <= length ? text : `${text.slice(0, length)}...`
}

export function fHexString(hex: string) {
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`
}

export function fEvmAddress(address: string) {
  return fHexString(address)
}

export function fPercent(amount: number, fixed?: number) {
  if ((amount * 100) > 999) return `999+%`
  return `${(amount * 100).toFixed(fixed ?? 2)}%`
}

export function fBps(bps: number, fixed?: number) {
  return fPercent(bps / 10_000, fixed)
}

export function fUSD(amount: number, options?: { fixed?: number, full?: boolean }) {
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

export function fFixed(amount: number, options?: { accuracy?: number, locale?: string  }) {
  const { accuracy = 2, locale } = options || {}
  const [whole, fraction] = amount.toFixed(accuracy).split('.')
  const formattedWhole = new Intl.NumberFormat(locale).format(parseInt(whole))
  const formattedFraction = (fraction || '0'.repeat(accuracy)).slice(0, accuracy)
  if (accuracy > 0) return `${formattedWhole}.${formattedFraction}`
  return formattedWhole
}

export function fNumber(amount: number, options?: { fixed?: number, prefix?: string, full?: boolean }) {
  const fixed = Number.isInteger(options?.fixed) ? options?.fixed : 2
  const full = options?.full
  let result = ''
  if(!Number.isFinite(amount)) result = 'NaN'
  else if (!full && amount < 1000) result = amount.toFixed(fixed)
  else if (!full && amount < 1e6) result = `${(amount / 1e3).toFixed(fixed)}K`
  else if (!full && amount < 1e9) result = `${(amount / 1e6).toFixed(fixed)}M`
  else if (!full && amount < 1e12) result = `${(amount / 1e9).toFixed(fixed)}B`
  else if (!full) result = `${(amount / 1e12).toFixed(fixed)}T`
  else result = fFixed(amount, { accuracy: fixed })
  if (options?.prefix) return `${options.prefix} ${result}`
  return result
}
