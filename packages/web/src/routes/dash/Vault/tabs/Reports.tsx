import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../../lib/env'
import { Suspense } from "react"
import { fBlockTime, fPercent, fUSD } from "@kalani/lib/format"
import Skeleton from "../../../../components/Skeleton"
import { useStrategyParams } from "../../../../hooks/useStrategy"
import { cn } from "../../../../lib/shadcn"
import TxChipSlide from "../../../../components/ChipSlide/TxChipSlide"
import StrategyChipSlide from '../../../../components/ChipSlide/StrategyChipSlide'
import DateOrBlock from '../../../../components/DateOrBlock'

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

function useReports(chainId: number, address: string) {
  const query = useSuspenseQuery({
    queryKey: ['useReports', chainId, address],
    queryFn: async () => fetchReports(chainId, address)
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
          <td><Skeleton className="w-full h-4" /></td>
          <td><Skeleton className="w-full h-4" /></td>
          <td><Skeleton className="w-full h-4" /></td>
          <td><Skeleton className="w-full h-4" /></td>
          <td><Skeleton className="w-full h-4" /></td>
          <td><Skeleton className="w-full h-4" /></td>
        </tr>
      ))}
    </tbody>
  </table>
}

function DisplayUSD({ usd, className }: { usd: number, className?: string }) {
  return <div className={cn('relative', className)}>
    <span className={classNameFor(0)}>{fUSD(usd, { padding: { length: 3, fill: '0' } })}</span>
    <span className={cn('absolute inset-0 whitespace-pre', classNameFor(usd))}>{fUSD(usd, { padding: { length: 3, fill: ' ' } })}</span>
  </div>
}

function DisplayPercent({ percent, className }: { percent: number, className?: string }) {
  return <div className={cn('relative', className)}>
    <span className={classNameFor(0)}>{fPercent(percent, { padding: { length: 3, fill: '0' } })}</span>
    <span className={cn('absolute inset-0 whitespace-pre', classNameFor(percent))}>{fPercent(percent, { padding: { length: 3, fill: ' ' } })}</span>
  </div>
}

function Suspender() {
  const { chainId, address } = useStrategyParams()
  const { reports } = useReports(chainId, address)
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
              <TxChipSlide chainId={report.chainId} txhash={report.transactionHash} className="bg-neutral-900 text-neutral-400" />
            </td>
            <td>
              <StrategyChipSlide chainId={report.chainId} address={report.strategy} className="bg-neutral-900 text-neutral-400" />
            </td>
            <td className="text-neutral-400">
              <DateOrBlock timestamp={report.blockTime} block={report.blockNumber} className="bg-neutral-900 text-neutral-400" />
            </td>
            <td>
              <DisplayUSD usd={report.gainUsd} />
            </td>
            <td>
              <DisplayUSD usd={report.lossUsd} />
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
  return <div>
    <Suspense fallback={<TableSkeleton />}>
      <Suspender />
    </Suspense>
  </div> 
}
