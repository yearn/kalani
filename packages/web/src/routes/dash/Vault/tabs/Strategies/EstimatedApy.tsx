import { useMemo } from 'react'
import { useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { useDebtRatioUpdates } from '../Allocator/useDebtRatioUpdates'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { EvmAddress } from '@kalani/lib/types'
import { fPercent } from '@kalani/lib/format'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'

export function useEstimatedApy() {
  const { vault } = useVaultFromParams()
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

  return { weightedApy, isDirty }
}

export default function EstimatedApy() {
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { weightedApy, isDirty } = useEstimatedApy()

  return <div className={`text-3xl font-bold font-mono ${authorized && isDirty ? 'text-primary-400' : ''}`}>
    {fPercent(weightedApy) ?? '-.--%'}
  </div>
}
