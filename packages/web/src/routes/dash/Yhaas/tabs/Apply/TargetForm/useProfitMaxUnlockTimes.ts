import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import abis from '@kalani/lib/abis'
import { readContractsQueryOptions } from 'wagmi/query'
import { useWhitelist } from '../useWhitelist'
import { useMemo } from 'react'
import { EvmAddress } from '@kalani/lib/types'
import { useAutomationGuidelines } from './StrategyForm/useAutomationGuidelines'

export function useProfitMaxUnlockTimes(o?: { strategy?: EvmAddress }) {
  const { strategy } = o ?? {}
  const config = useConfig()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => strategy !== undefined ? [strategy] : _targets, [strategy, _targets])
  const { isUnlockWithinGuidelines } = useAutomationGuidelines()

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.strategy, address: target, functionName: 'profitMaxUnlockTime' 
  })), [targets])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const profitMaxUnlockTimes = useMemo(() => {
    if (!query.isSuccess) return []
    return query.data.map(result => {
      if (result.status !== 'success') return undefined
      return Number(result.result)
    })
  }, [query])

  const areWithinGuidelines = useMemo(() => {
    if (!query.isSuccess) return false
    return query.data.every(result => {
      if (result.status !== 'success') return false
      return isUnlockWithinGuidelines(Number(result.result))
    })
  }, [query, isUnlockWithinGuidelines])

  return { ...query, profitMaxUnlockTimes, areWithinGuidelines }
}
