import { useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault'
import { EvmAddress } from '@kalani/lib/types'
import { create } from 'zustand'
import { useOnchainTargetRatios } from './useOnchainTargetRatios'
import { zeroAddress } from 'viem'

type DebtRatioUpdate = {
  chainId: number,
  vault: EvmAddress,
  strategy: EvmAddress,
  debtRatio: bigint,
  isDirty: boolean
}

type UseDebtRatioUpdates = {
  updates: DebtRatioUpdate[],
  updateDebtRatio: (debtRatio: DebtRatioUpdate) => void
} 

const useDebtRatioUpdatesStore = create<UseDebtRatioUpdates>(set => ({
  updates: [],
  updateDebtRatio: (debtRatio: DebtRatioUpdate) => {
    set(current => {
      const index = current.updates.findIndex(a => a.vault === debtRatio.vault && a.strategy === debtRatio.strategy)
      if (index === -1) { return { updates: [...current.updates, debtRatio] } }
      return {
        updates: current.updates.map((a, i) => i === index ? debtRatio : a)
      }
    })
  }
}))

export function useDebtRatioUpdates() {
  const { vault } = useVaultFromParams()
  const { onChainTargetRatios } = useOnchainTargetRatios()
  const { updates: _updates, updateDebtRatio } = useDebtRatioUpdatesStore(state => state)

  const updates = useMemo(() => {
    return onChainTargetRatios.map(a => {
      const found = _updates.find(b => b.strategy === a.strategy)
      return {
        chainId: Number(vault?.chainId ?? 0),
        vault: vault?.address ?? zeroAddress,
        strategy: a.strategy,
        debtRatio: found?.debtRatio ?? a.debtRatio,
        isDirty: (found && found.debtRatio !== a.debtRatio) ?? false
      }
    })
  }, [onChainTargetRatios, _updates, vault])

  return { updates, updateDebtRatio }
}
