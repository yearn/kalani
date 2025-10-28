import Allocation from './Allocation'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'
import { fBps, fPercent } from '@kalani/lib/format'
import { useTotalDebtRatioUpdates } from './useTotalDebtRatioUpdates'
import { useInputBpsSettings } from '../../../../../components/elements/InputBps'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { AddStrategyButton } from './NoStrategies'
import { useDefaultQueueComposite } from './useDefaultQueueComposite'
import Section from '../../../../../components/Section'
import AllocationsPie from './AllocationsPie'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useMounted } from '../../../../../hooks/useMounted'
import bmath from '@kalani/lib/bmath'
import { zeroAddress } from 'viem'
import { useTotalAssets } from './useEffectiveDebtRatioBps'

function EstimatedApy() {
  const { vault } = useVaultFromParams()
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { items } = useFinderItems()
  const { updates } = useDebtRatioUpdates({ vault })
  const isDirty = useMemo(() => updates.some(a => a.isDirty), [updates])

  const apys = useMemo(() => {
    const result: { strategy: EvmAddress, apy: number | null | undefined, debtRatio: bigint }[] = []
    for (const update of updates) {
      const item = items.find(a => compareEvmAddresses(a.address, update.strategy))
      if (item) { result.push({ strategy: update.strategy, apy: item.apy, debtRatio: update.debtRatio }) }
      else { result.push({ strategy: update.strategy, apy: undefined, debtRatio: update.debtRatio }) }
    }
    return result
  }, [updates, items])

  const weightedApy = useMemo(() => {
    if (apys.every(a => a.apy === undefined || a.apy === null)) return undefined
    return apys.reduce((acc, a) => {
      if (a.apy === undefined || a.apy === null) { return acc }
      return (acc ?? 0) + ((a.apy ?? 0) * Number(a.debtRatio))
    }, 0) / 10_000
  }, [apys])

  return <div className={`text-2xl font-bold ${authorized && isDirty ? 'text-primary-400' : ''}`}>
    {fPercent(weightedApy) ?? '-.--%'}
  </div>
}

function TotalAllocation() {
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { setting: bpsSetting } = useInputBpsSettings()
  const { totalDebtRatio, isDirty } = useTotalDebtRatioUpdates()
  const { next } = useInputBpsSettings()
  return <div onClick={authorized ? next : undefined} 
    className={`pl-4 text-2xl font-bold cursor-pointer ${(authorized && isDirty) ? 'text-primary-400' : ''}`}>
    {fBps(Number(totalDebtRatio), { percent: bpsSetting === '%' })}
  </div>
}

export default function Allocations() {
  const mounted = useMounted()
  const { defaultQueue, colors } = useDefaultQueueComposite()
  const { vault } = useVaultFromParams()
  const { updates: debtRatios } = useDebtRatioUpdates({ vault })
  const { totalDebtRatio } = useTotalDebtRatioUpdates()
  const { totalAssets } = useTotalAssets(vault?.chainId ?? 0, vault?.address ?? zeroAddress)

  const targetDebtPieData = useMemo(() => {
    const result: { label: string, value: number, color: string }[] = [
      { label: 'idle', value: Number(10_000n - totalDebtRatio), color: '#000000' },
    ]

    defaultQueue.map((strategy, index) => {
      const debtRatio = debtRatios.find(a => compareEvmAddresses(a.strategy, strategy.address))
      if (debtRatio) {
        result.push({ label: debtRatio.strategy, value: Number(debtRatio.debtRatio), color: colors[index] })
      } else {
        console.error('default queue strategy not found in debt ratios', strategy.address)
      }
    })

    return result.filter(a => a.value > 0)
  }, [debtRatios, totalDebtRatio, colors, defaultQueue])

  const realDebtPieData = useMemo(() => {
    if (totalAssets === 0n) return []
    const totalDebt = vault?.totalDebt ?? 0n
    const idle = bmath.div(totalAssets - totalDebt, totalAssets)
    const idleBps = Math.round(Number(idle) * 10_000)

    const result: { label: string, value: number, color: string }[] = [
      { label: 'idle', value: idleBps, color: '#000000' },
    ]

    defaultQueue.map((strategy, index) => {
      const currentDebt = strategy.currentDebt ?? 0n
      const realDeptRatio = bmath.div(currentDebt, totalAssets)
      const realDeptRatioBps = Math.round(Number(realDeptRatio) * 10_000)
      result.push({ label: strategy.address, value: realDeptRatioBps, color: colors[index] })
    })

    return result.filter(a => a.value > 0)
  }, [vault, colors, defaultQueue, totalAssets])

  return <div className="w-full flex flex-col gap-primary">

    <div className="sticky top-[68px] sm:top-[78px] z-10 sm:-mx-4 sm:px-32 bg-grill-950 border-b-primary border-b-black">
      <div className="py-3 sm:py-4 pr-6 w-full flex items-center gap-6 sm:gap-24">
        <div className="grow flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Estimated APY</div>
          <EstimatedApy />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Target allocation</div>
          <TotalAllocation />
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={targetDebtPieData} size={100} animate={!mounted} />
            <div className="text-xs text-neutral-400 whitespace-nowrap">Target</div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <AllocationsPie data={realDebtPieData} size={100} animate={!mounted} />
            <div className="text-xs text-neutral-400 whitespace-nowrap">Effective</div>
          </div>
        </div>
      </div>
    </div>

    {defaultQueue.map((strategy, index) => <Section key={strategy.address} className={`${index === 0 ? 'border-t-transparent' : ''}`}>
      <Allocation strategy={strategy} />
    </Section>)}

    <Section className="sm:hidden w-full flex justify-center">
      <AddStrategyButton />
    </Section>
  </div>
}
