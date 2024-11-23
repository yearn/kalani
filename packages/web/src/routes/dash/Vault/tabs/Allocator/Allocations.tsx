import { useVaultFromParams } from '../../../../../hooks/useVault'
import Allocation from './Allocation'
import Button from '../../../../../components/elements/Button'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'
import { fBps, fPercent } from '@kalani/lib/format'
import { useTotalDebtRatioUpdates } from './useTotalDebtRatioUpdates'
import { useInputBpsSettings } from '../../../../../components/elements/InputBps'

function EstimatedApy() {
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

  return <div className={`pr-4 text-2xl font-bold ${isDirty ? 'text-primary-400' : ''}`}>
    {fPercent(weightedApy) ?? '-.--%'}
  </div>
}

function TotalAllocation() {
  const { setting: bpsSetting } = useInputBpsSettings()
  const { totalDebtRatio, isDirty } = useTotalDebtRatioUpdates()
  const { next } = useInputBpsSettings()
  return <div onClick={next} className={`pl-4 text-2xl font-bold cursor-pointer ${isDirty ? 'text-primary-400' : ''}`}>
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
  return <div className="w-full flex flex-col gap-6">
    <div className="w-full flex items-center gap-6">
      <div className="grow"></div>
      <div className="pl-2 w-64 text-neutral-400 text-sm">Allocation</div>
      <div><Button className="invisible">Set</Button></div>
    </div>

    {sortedByDefaultQueue.map(strategy => <Allocation key={strategy.address} strategy={strategy} />)}

    <div className="mt-8 w-full flex items-center gap-6">
      <div className="pr-2 grow flex flex-col items-end gap-2">
        <div className="text-sm text-neutral-400">Estimated APY</div>
        <EstimatedApy />
      </div>
      <div className="w-64 pl-2 flex flex-col items-start gap-2">
        <div className="text-sm text-neutral-400">Total allocation</div>
        <TotalAllocation />
      </div>
      <div><Button className="invisible">Set</Button></div>
    </div>
  </div>
}
