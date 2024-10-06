import { EvmAddressSchema, HexStringSchema } from "@kalani/lib/types"
import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../../lib/env'
import { Suspense } from "react"
import { fBlockTime, fHexString, fPercent, fUSD } from "@kalani/lib/format"
import { Vault, withVault } from "../../../../hooks/useVault"
import Skeleton from "../../../../components/Skeleton"

export const ReportSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  transactionHash: HexStringSchema,
  blockTime: z.number({ coerce: true }),
  profit: z.number({ coerce: true }),
  profitUsd: z.number({ coerce: true }),
  loss: z.number({ coerce: true }),
  lossUsd: z.number({ coerce: true }),
  apr: z.object({
    net: z.number({ coerce: true }).nullable()
  })
})

export type Report = z.infer<typeof ReportSchema>

const QUERY = `
query Query($chainId: Int, $address: String) {
  strategyReports(chainId: $chainId, address: $address) {
    chainId
    address
    transactionHash
    blockTime
    profit
    profitUsd
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
  return ReportSchema.array().parse(json.data.strategyReports)
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

function numberClassNames(value: number) {
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
        </tr>
      ))}
    </tbody>
  </table>
}

function Suspender({ vault }: { vault: Vault }) {
  const { reports } = useReports(vault.chainId, vault.address)
  return <div className="flex flex-col gap-2">
    <table className="w-full border-separate border-spacing-4">
      <thead>
        <tr className="text-neutral-200">
          <th className="w-52 text-left"></th>
          <th className="text-left">Date</th>
          <th className="text-left">Profit</th>
          <th className="text-left">Loss</th>
          <th className="text-left">APR</th>
        </tr>
      </thead>
      <tbody>
        {reports.map((report, index) => (
          <tr key={index}>
            <td className="flex justify-between">
              <div className="text-neutral-400 bg-neutral-900 rounded-full px-3 py-1">
                {fHexString(report.transactionHash)}
              </div>
            </td>
            <td className="text-neutral-400">{fBlockTime(report.blockTime)}</td>
            <td className={numberClassNames(report.profitUsd)}>{fUSD(report.profitUsd)}</td>
            <td className={numberClassNames(report.lossUsd)}>{fUSD(report.lossUsd)}</td>
            <td className={numberClassNames(report.apr?.net ?? 0)}>{fPercent(report.apr?.net ?? 0)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
}

function Reports({ vault }: { vault: Vault }) {
  return <div>
    <Suspense fallback={<TableSkeleton />}>
      <Suspender vault={vault} />
    </Suspense>
  </div> 
}

export default withVault(Reports)
