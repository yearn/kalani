import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import abis from '../../../../../../lib/abis'
import { readContractsQueryOptions } from 'wagmi/query'
import { useWhitelist } from '../../provider'
import { useMemo } from 'react'
import { EvmAddress } from '@kalani/lib/types'

export function useProfitMaxUnlockTimes({ strategy }: { strategy?: EvmAddress }) {
  const config = useConfig()
  const { chainId } = useAccount()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => strategy !== undefined ? [strategy] : _targets, [strategy, _targets])

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

  const isWithinGuidelines = useMemo(() => {
    if (!query.isSuccess) return false
    return query.data.every(result => {
      if (result.status !== 'success') return false
      const profitMaxUnlockTime = Number(result.result)
      if (profitMaxUnlockTime === 0) return false
      if (chainId === 1) {
        return profitMaxUnlockTime >= 4 * 24 * 60 * 60
      } else {
        return profitMaxUnlockTime >= 2 * 24 * 60 * 60
      }
    })
  }, [query, chainId])

  return { ...query, profitMaxUnlockTimes, isWithinGuidelines }
}
