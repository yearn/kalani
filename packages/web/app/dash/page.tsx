'use client'

import Screen from '@/components/Screen'
import ReactTimeago from 'react-timeago'
import { useRouter, useSearchParams } from 'next/navigation'
import { UserVault, useVaults } from '../../hooks/useVaults'
import { fEvmAddress, fNumber, fPercent, fUSD } from '@/lib/format'
import { useMemo } from 'react'
import { priced } from '@/lib/bmath'
import Pie from 'lib/components/viz/Pie'

function fakePrice(address: `0x${string}`) {
  if (address === '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619') {
    return 2923.15
  } else if (address === '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270') {
    return 0.6866
  } else {
    return 1
  }
}

function ValueLabelPair({ value, label, className }: { value: string | number, label: string, className?: string }) {
  return <div className="flex items-baseline gap-2">
    <div className={`whitespace-nowrap ${className}`}>{value}</div>
    <div className="text-sm">{label}</div>
  </div>
}

function Tile({ vault }: { vault: UserVault }) {
  const router = useRouter()

  const [latest] = useMemo(() => {
    return vault.strategies.sort((a, b) => b.lastReport - a.lastReport)
  }, [vault])

  const latestGain = useMemo(() => {
    const usd = priced(latest.lastReportDetail.profit, vault.asset.decimals, fakePrice(vault.asset.address))
    return fUSD(usd)
  }, [vault, latest])

  return <Screen className={`
    w-full p-12 flex gap-8 border border-neutral-900
    hover:border-violet-300 hover:!text-violet-300 hover:bg-neutral-900
    active:border-violet-400 active:!text-violet-400
    bg-neutral-950 text-neutral-300
    cursor-pointer`}>
    <div className="w-1/2 flex flex-col gap-2">

      <div className="text-5xl">{vault.name}</div>
      <div className="flex items-center gap-12">
        <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-3xl" />
        <ValueLabelPair value={fPercent(vault.apy.close)} label="apy" className="text-3xl" />
      </div>

      <div className="mt-8 flex items-center gap-12">
        <div className="">Latest harvest</div>
        <div className="text-orange-300">
          <ReactTimeago date={Number(latest.lastReport) * 1000} />
        </div>
      </div>
      <div className="text-lg">{latest.name}</div>
      <div className="flex items-center gap-12">
        <ValueLabelPair value={latestGain} label="gain" className="text-2xl" />
        <ValueLabelPair value={fPercent(latest.lastReportDetail.apr.net)} label="apr" className="text-2xl" />
      </div>
    </div>
    <div className="w-1/2 flex flex-col justify-center gap-4">
      <div className="text-lg">Roles</div>
      <div className="flex flex-wrap gap-4">
      {Object.keys(vault.roles).map((role, i) => 
        <div key={i} className={`
          py-2 px-4 border border-neutral-800 
          text-xs rounded 
          ${vault.roles[role] ? '' : 'text-neutral-800'}`}>
          {role.replace('_MANAGER', '').replace('_', ' ')}
        </div>
      )}
      </div>
    </div>
  </Screen>
}

export default function Dash() {
  const searchParams = useSearchParams()
  const account = searchParams.get('account') as `0x${string}` | null
  const user = useVaults(account)

  const aum = user?.vaults.reduce((acc, vault) => acc + vault.tvl.close, 0) ?? 0

  if (!account) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-2/3 h-48 p-4 flex flex-col justify-center gap-2 rounded">
        <div className="text-5xl">{fEvmAddress(account)}</div>
        <div className="flex items-center gap-12">
          <ValueLabelPair value={fNumber(aum)} label="aum" className="text-4xl" />
          <ValueLabelPair value={String(user?.vaults.length ?? 0)} label="vaults" className="text-4xl" />
        </div>
      </div>
      <Screen className="w-1/3 h-48 flex items-center justify-center">
        <Pie />
      </Screen>
    </div>
    {user?.vaults.map((vault, i) => <Tile key={i} vault={vault} />)}
  </main>
}
