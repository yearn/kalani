import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import abis from '../../../../../../lib/abis'
import { readContractsQueryOptions } from 'wagmi/query'
import { useWhitelist } from '../../provider'
import { useMemo } from 'react'

export function useProfitMaxUnlockTime() {
  const config = useConfig()
  const { chainId } = useAccount()
  const { targets } = useWhitelist()

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.strategy, address: target, functionName: 'profitMaxUnlockTime' 
  })), [targets])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isWithinGuidelines = useMemo(() => {
    if (!query.isSuccess) return false
    return query.data.every(result => {
      if (result.status !== 'success') return false
      const profitMaxUnlockTime = Number(result.result)
      if (profitMaxUnlockTime === 0) return false
      if (chainId === 1) {
        return profitMaxUnlockTime >= 3 * 24 * 60 * 60
      } else {
        return profitMaxUnlockTime >= 2 * 24 * 60 * 60
      }
    })
  }, [query, chainId])

  return { ...query, isWithinGuidelines }
}
