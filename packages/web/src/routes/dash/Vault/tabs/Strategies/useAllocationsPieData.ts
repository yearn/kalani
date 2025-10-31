import { useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useDebtRatioUpdates } from '../Allocator/useDebtRatioUpdates'
import { useTotalDebtRatioUpdates } from '../Allocator/useTotalDebtRatioUpdates'
import { useDefaultQueueComposite } from '../Allocator/useDefaultQueueComposite'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useTotalAssets } from '../Allocator/useEffectiveDebtRatioBps'
import { zeroAddress } from 'viem'
import bmath from '@kalani/lib/bmath'

export type PieData = {
  label: string
  value: number
  color: string
}

export function useTargetDebtPieData() {
  const { vault } = useVaultFromParams()
  const { updates: debtRatios } = useDebtRatioUpdates({ vault })
  const { totalDebtRatio } = useTotalDebtRatioUpdates()
  const { defaultQueue, colors } = useDefaultQueueComposite()

  const targetDebtPieData = useMemo(() => {
    const result: PieData[] = [
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

  return targetDebtPieData
}

export function useRealDebtPieData() {
  const { vault } = useVaultFromParams()
  const { defaultQueue, colors } = useDefaultQueueComposite()
  const { totalAssets } = useTotalAssets(vault?.chainId ?? 0, vault?.address ?? zeroAddress)

  const realDebtPieData = useMemo(() => {
    if (totalAssets === 0n) {
      return [{ label: 'idle', value: 10_000, color: '#000000' }]
    }
    const totalDebt = vault?.totalDebt ?? 0n
    const idle = bmath.div(totalAssets - totalDebt, totalAssets)
    const idleBps = Math.round(Number(idle) * 10_000)

    const result: PieData[] = [
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

  return realDebtPieData
}
