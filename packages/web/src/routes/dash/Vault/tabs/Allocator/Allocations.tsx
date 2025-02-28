import { useVaultFromParams } from '../../../../../hooks/useVault'
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

function EstimatedApy() {
  const authorized = useHasDebtManagerRole()
  const { items } = useFinderItems()
  const { updates } = useDebtRatioUpdates()
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
  const { vault } = useVaultFromParams()

  const sortedByDefaultQueue = useMemo(() => {
    const unsorted = vault?.strategies ?? []
    const sorted: EvmAddress[] = vault?.defaultQueue ?? []
    return unsorted.sort((a, b) => sorted.indexOf(a.address) - sorted.indexOf(b.address))
  }, [vault])

  return <div className="w-full flex flex-col gap-primary">
    {sortedByDefaultQueue.map(strategy => <Allocation key={strategy.address} strategy={strategy} />)}

    <div className="w-full flex justify-center">
      <AddStrategyButton />
    </div>

    <div className="p-12 w-full flex items-center gap-12">
      <div className="grow flex flex-col items-end gap-2">
        <div className="text-sm text-neutral-400">Estimated APY</div>
        <EstimatedApy />
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="text-sm text-neutral-400">Total allocation</div>
        <TotalAllocation />
      </div>
    </div>
  </div>
}
