import { useMemo } from 'react'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useTotalDebtRatio } from '../../useAllocator'

export function useTotalDebtRatioUpdates() {
  const { totalDebtRatio: referenceDebtRatio } = useTotalDebtRatio()
  const { updates } = useDebtRatioUpdates()
  const totalDebtRatioAfterUpdates = useMemo(() => updates.reduce((acc, update) => acc + (update.debtRatio ?? 0n), 0n), [updates])
  const isDirty = useMemo(() => {
    return totalDebtRatioAfterUpdates !== referenceDebtRatio
  }, [totalDebtRatioAfterUpdates, referenceDebtRatio])
  return { totalDebtRatio: totalDebtRatioAfterUpdates, isDirty }
}
