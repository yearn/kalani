import Allocation from './Allocation'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'
import { fBps, fPercent } from '@kalani/lib/format'
import { useTotalDebtRatioUpdates } from './useTotalDebtRatioUpdates'
import { useInputBpsSettings } from '../../../../../components/elements/InputBps'
import { useHasDebtManagerRole } from './useHasDebtManagerRole'
import { AddStrategyButton } from './NoStrategies'
import { useDefaultQueueComposite } from './useDefaultQueueComposite'
import Section from '../../../../../components/Section'
import AllocationsPie from './AllocationsPie'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useMounted } from '../../../../../hooks/useMounted'

function EstimatedApy() {
  const { vault } = useVaultFromParams()
  const authorized = useHasDebtManagerRole()
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
  const authorized = useHasDebtManagerRole()
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

  const pieData = useMemo(() => {
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

  return <div className="w-full flex flex-col gap-primary">

    <div className="sticky top-[68px] sm:top-[78px] z-10 sm:-mx-4 sm:px-32 bg-grill-950 border-b-primary border-b-black">
      <div className="py-3 sm:py-4 pr-6 w-full flex items-center gap-6 sm:gap-24">
        <div className="grow flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Estimated APY</div>
          <EstimatedApy />
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Total allocation</div>
          <TotalAllocation />
        </div>

        <div>
          <AllocationsPie data={pieData} size={100} animate={!mounted} />
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
