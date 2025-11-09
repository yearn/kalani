import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../../lib/env'
import { Suspense, useMemo } from 'react'
import { fPercent, fNumber } from '@kalani/lib/format'
import { formatUnits } from 'viem'
import Skeleton from '../../../../components/Skeleton'
import { useVaultFromParams } from '../../../../hooks/useVault/withVault'
import { cn } from '../../../../lib/shadcn'
import TxChipSlide from '../../../../components/ChipSlide/TxChipSlide'
import StrategyChipSlide from '../../../../components/ChipSlide/StrategyChipSlide'
import { useDefaultQueueComposite } from './Allocator/useDefaultQueueComposite'
import ViewDateOrBlock from '../../../../components/elements/ViewDateOrBlock'
import ScrollContainer from 'react-indiana-drag-scroll'

export const ReportSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  strategy: EvmAddressSchema,
  transactionHash: HexStringSchema,
  blockTime: z.number({ coerce: true }),
  blockNumber: z.bigint({ coerce: true }),
  gain: z.number({ coerce: true }),
  gainUsd: z.number({ coerce: true }),
  loss: z.number({ coerce: true }),
  lossUsd: z.number({ coerce: true }),
  apr: z.object({
    net: z.number({ coerce: true }).nullable()
  }).nullable()
})

export type Report = z.infer<typeof ReportSchema>

const QUERY = `
query Query($chainId: Int, $address: String) {
  vaultReports(chainId: $chainId, address: $address) {
    chainId
    address
    strategy
    blockTime
    blockNumber
    transactionHash
    gain
    gainUsd
    loss
    lossUsd
    apr {
      net
    }
  }
}
`

async function fetchReports(chainId: number, address: string): Promise<Report[]> {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY, variables: { chainId, address } }),
  })

  if (!response.ok) { throw new Error(`HTTP error, status ${response.status}`) }

  const json = await response.json()
  return ReportSchema.array().parse(json.data.vaultReports)
}

function useReports(chainId: number | undefined, address: string | undefined) {
  const query = useSuspenseQuery({
    queryKey: ['useReports', chainId, address],
    queryFn: async () => {
      if (!chainId || !address) return []
      return fetchReports(chainId, address)
    }
  })
  return {
    ...query,
    reports: query.data ?? []
  }
}

function classNameFor(value: number) {
  if (value > 0) { return 'text-green-500' }
  if (value < 0) { return 'text-red-500' }
  return 'text-neutral-800'
}

function TableSkeleton() {
  return <table className="w-full border-separate border-spacing-4">
    <thead>
      <tr>
        <th className="w-52 text-left"></th>
        <th className="text-left"></th>
        <th className="text-left"></th>
        <th className="text-left"></th>
        <th className="text-left"></th>
        <th className="text-left"></th>
      </tr>
    </thead>
    <tbody>
      {Array.from({ length: 10 }).map((_, index) => (
        <tr key={index}>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
          <td><Skeleton className="w-full h-8 rounded-primary" /></td>
        </tr>
      ))}
    </tbody>
  </table>
}

function DisplayPercent({ percent, className }: { percent: number, className?: string }) {
  return <div className={cn('relative whitespace-nowrap', className)}>
    <span className={classNameFor(0)}>{fPercent(percent, { padding: { length: 3, fill: '0' } })}</span>
    <span className={cn('absolute inset-0 whitespace-pre', classNameFor(percent))}>{fPercent(percent, { padding: { length: 3, fill: ' ' } })}</span>
  </div>
}

function DisplayTokens({ amount, decimals, symbol, className }: { amount: number, decimals: number, symbol: string, className?: string }) {
  const amountBigInt = BigInt(Math.floor(amount))
  const units = formatUnits(amountBigInt, decimals)
  const number = Number(units)
  const addSpace = number < 1000 && Number.isFinite(number)
  const formattedNumber = fNumber(number, { padding: { length: 3, fill: '0' } })
  const formattedNumberSpaced = fNumber(number, { padding: { length: 3, fill: ' ' } })
  
  return <div className={cn('relative whitespace-nowrap', className)}>
    <span className={classNameFor(0)}>{formattedNumber}{addSpace ? '\u00A0' : ''} <span className="opacity-60">{symbol}</span></span>
    <span className={cn('absolute inset-0 whitespace-pre', classNameFor(amount))}>{formattedNumberSpaced}{addSpace ? '\u00A0' : ''} <span className="opacity-60">{symbol}</span></span>
  </div>
}

function Suspender() {
  const { vault } = useVaultFromParams()
  const { reports } = useReports(vault?.chainId, vault?.address)
  const { defaultQueue, colors } = useDefaultQueueComposite()

  const colorMap = useMemo(() => {
    const map = new Map<string, string>()
    defaultQueue.forEach((s, i) => {
      const color = colors[i]
      if (color) {
        map.set(s.address.toLowerCase(), color)
      }
    })
    return map
  }, [defaultQueue, colors])

  const colorFor = (strategy: string) => colorMap.get(strategy.toLowerCase())

  if (!vault) return <></>

  return <div className="flex flex-col gap-2">
    <table className="border-separate border-spacing-4">
      <thead>
        <tr className="text-neutral-400">
          <th className="w-52 text-left">TX</th>
          <th className="text-left">Strategy</th>
          <th className="text-left">Date</th>
          <th className="text-left">Profit</th>
          <th className="text-left">Loss</th>
          <th className="text-left">APR</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report, index) => (
          <tr key={index}>
            <td>
              <TxChipSlide chainId={report.chainId} txhash={report.transactionHash} />
            </td>
            <td>
              <StrategyChipSlide
                chainId={report.chainId}
                address={report.strategy}
                className={'text-black'}
                style={(() => {
                  const c = colorFor(report.strategy)
                  return c ? { backgroundColor: c } : { backgroundColor: '#333' }
                })()}
              />
            </td>
            <td>
              <ViewDateOrBlock timestamp={report.blockTime} block={report.blockNumber} />
            </td>
            <td>
              <DisplayTokens amount={report.gain} decimals={vault.asset.decimals} symbol={vault.asset.symbol} />
            </td>
            <td>
              <DisplayTokens amount={report.loss} decimals={vault.asset.decimals} symbol={vault.asset.symbol} />
            </td>
            <td className={classNameFor(report.apr?.net ?? 0)}>
              <DisplayPercent percent={report.apr?.net ?? 0} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

export default function Reports() {
  return <ScrollContainer>
    <Suspense fallback={<TableSkeleton />}>
      <Suspender />
    </Suspense>
  </ScrollContainer> 
}
