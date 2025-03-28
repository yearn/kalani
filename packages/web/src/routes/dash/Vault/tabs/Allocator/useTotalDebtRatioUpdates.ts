import { useMemo } from 'react'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useTotalDebtRatio } from '../../useAllocator'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'

export function useTotalDebtRatioUpdates() {
  const { vault } = useVaultFromParams()
  const { totalDebtRatio: referenceDebtRatio } = useTotalDebtRatio()
  const { updates } = useDebtRatioUpdates({ vault })
  const totalDebtRatioAfterUpdates = useMemo(() => updates.reduce((acc, update) => acc + (update.debtRatio ?? 0n), 0n), [updates])
  const isDirty = useMemo(() => {
    return totalDebtRatioAfterUpdates !== referenceDebtRatio
  }, [totalDebtRatioAfterUpdates, referenceDebtRatio])
  return { totalDebtRatio: totalDebtRatioAfterUpdates, isDirty }
}
