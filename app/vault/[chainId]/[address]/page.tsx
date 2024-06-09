'use client'

import { useParams } from 'next/navigation'
import { EvmAddressSchema } from '@/lib/types'
import ValueLabelPair from '@/components/ValueLabelPair'
import { useVaultFromParams } from '@/hooks/useVault'
import { fBps, fEvmAddress, fNumber, fPercent, fTokens } from '@/lib/format'
import Screen from '@/components/Screen'
import { getChain } from '@/lib/chains'
import Pie from './Pie'
import { useMemo } from 'react'
import { div, mulb } from '@/lib/bmath'
import { fancy } from '@/lib/fancy'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shadcn/tabs'
import { PiCalculator, PiScales, PiTractorFill } from 'react-icons/pi'
import Roles from './tabs/Roles'
import Badge from './Badge'

export default function Vault() {
  const vault = useVaultFromParams()

  const idle = useMemo(() => (vault?.totalAssets ?? 0n) - (vault?.totalDebt ?? 0n), [vault])
  const currentDebtPieData = useMemo(() => {
    const result = vault?.strategies.map(strategy => ({ label: strategy.name, value: Number(strategy.currentDebt) })) ?? []
    result.push({ label: '', value: Number(idle) })
    return result
  }, [vault, idle])
  const allocated = useMemo(() => vault?.strategies.reduce((acc, strategy) => acc + Number(strategy.targetDebtRatio), 0) ?? 0, [vault])
  const targetDebtPieData = useMemo(() => {
    const result = vault?.strategies.map(strategy => ({ label: strategy.name, value: Number(strategy.targetDebtRatio) })) ?? []
    result.push({ label: '', value: Number(10_000 - allocated) })
    return result
  }, [vault, allocated])
  const deployed = useMemo(() => {
    const totalAllocated = mulb(vault?.totalAssets ?? 0n, allocated / 10_000)
    return div(vault?.totalDebt ?? 0n, totalAllocated)
  }, [vault, allocated])

  if (!vault) return <></>

  return <main className={`
    relative w-6xl max-w-6xl mx-auto pt-[6rem] pb-96
    flex flex-col items-center justify-start gap-8`}>
    <div className="w-full flex items-center justify-center gap-8">
      <div className="w-1/2 h-48 p-4 flex flex-col justify-center gap-2">
        <div className="text-sm">vault {fEvmAddress(vault.address)}</div>
        <div className={`text-4xl ${fancy.className}`}>{vault.name}</div>
        <div className="flex items-center gap-8">
          [{getChain(vault.chainId).name}]
          <ValueLabelPair value={fNumber(vault.tvl.close)} label="tvl" className="text-3xl" />
          <ValueLabelPair value={fPercent(vault.apy.close)} label="apy" className="text-3xl" />
        </div>
      </div>
      <div className="w-1/2 h-48 flex items-center justify-center gap-10">
        <Badge label="Allocator" icon={PiScales} enabled={true} />
        <Badge label="Accountant" icon={PiCalculator} enabled={true} />
        <Badge label="yHaaS" icon={PiTractorFill} />
      </div>
    </div>

    <Tabs defaultValue="assets" className="w-full">
      <TabsList>
        <TabsTrigger value="assets">Assets</TabsTrigger>
        <TabsTrigger value="strategies">Strategies</TabsTrigger>
        <TabsTrigger value="accountant">Accountant</TabsTrigger>
        <TabsTrigger value="roles">Roles</TabsTrigger>
        <TabsTrigger value="depositors">Depositors</TabsTrigger>
      </TabsList>
      <TabsContent value="assets">assets</TabsContent>
      <TabsContent value="strategies">strategies</TabsContent>
      <TabsContent value="accountant">accountant</TabsContent>
      <TabsContent value="roles"><Roles /></TabsContent>
    </Tabs>

    {/* <div className="w-full flex items-center gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`
        w-1/2 h-full p-4 text-primary-200`}>
        <table className="table-auto w-full">
          <tr>
            <td>Total assets</td>
            <td className="text-right">{fTokens(vault.totalAssets, vault.asset.decimals)}</td>
          </tr>
          <tr>
            <td>Allocated</td>
            <td className="text-right">{fBps(allocated)}</td>
          </tr>
          <tr>
            <td>Deployed</td>
            <td className="text-right">{fPercent(deployed)}</td>
          </tr>
          <tr>
            <td>Idle assets</td>
            <td className="text-right">{fTokens(idle, vault.asset.decimals)}</td>
          </tr>
          <tr>
            <td>Deposit limit</td>
            <td className="text-right">{fTokens(vault.deposit_limit, vault.asset.decimals, { fixed: 0 })}</td>
          </tr>
          <tr>
            <td>Accountant</td>
            <td className="text-right">{fEvmAddress(vault.accountant)}</td>
          </tr>
          <tr>
            <td>Performance fee</td>
            <td className="text-right">{fBps(vault.fees.performanceFee)}</td>
          </tr>
        </table>
      </div>
    </div>

    <div className="w-full flex items-start gap-8">
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Strategies</div>
        {vault.strategies.map(strategy => <div key={strategy.address}>
          {strategy.name}
        </div>)}
      </div>
      <Screen className={`
        w-1/2 p-4 flex items-center justify-between
        border border-neutral-800`}>
        <div className="grow flex flex-col items-center">
          <Pie data={currentDebtPieData} size={200} />
          <div>current debt</div>
        </div>
        <div className="grow flex flex-col items-center">
          <Pie data={targetDebtPieData} size={200} />
          <div>target debt</div>
        </div>
      </Screen>
    </div>

    <div className="w-full flex items-start gap-8">
      <Screen className={`
        w-1/2 h-48 p-4 
        border border-neutral-800`}>
        <table>
        </table>
      </Screen>
      <div className={`w-1/2 h-full p-4 text-primary-200`}>
        <div className="text-xl">Roles</div>
      </div>
    </div> */}
  </main>
}
