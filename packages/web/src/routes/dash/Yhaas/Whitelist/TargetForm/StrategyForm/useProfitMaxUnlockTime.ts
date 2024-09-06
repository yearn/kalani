import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import abis from '../../../../../../lib/abis'
import { readContractQueryOptions } from 'wagmi/query'
import { useWhitelist } from '../../provider'
import { useMemo } from 'react'

export function useProfitMaxUnlockTime() {
  const config = useConfig()
  const { chainId } = useAccount()
  const { targetOrUndefined: target } = useWhitelist()

  const options = readContractQueryOptions(config, { 
    abi: abis.strategy, address: target, functionName: 'profitMaxUnlockTime' 
  })

  const query = useSuspenseQuery(options)

  const isWithinGuidelines = useMemo(() => {
    if (!query.isSuccess) return false
    const profitMaxUnlockTime = Number(query.data)
    if (profitMaxUnlockTime === 0) return false
    if (chainId === 1) {
      return profitMaxUnlockTime >= 3 * 24 * 60 * 60
    } else {
      return profitMaxUnlockTime >= 2 * 24 * 60 * 60
    }
  }, [query, chainId])

  return { ...query, isWithinGuidelines }
}
