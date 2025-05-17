import { EvmAddress } from '@kalani/lib/types'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import { useCallback, useMemo } from 'react'
import bmath from '@kalani/lib/bmath'

export function useTotalAssets(chainId: number, vault: EvmAddress) {
  const config = useConfig()
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function totalAssets() external view returns (uint256)']),
    chainId: chainId,
    address: vault,
    functionName: 'totalAssets',
    args: []
  }))
  return { ...query, totalAssets: query.data }
}

export function useEffectiveDebtRatioBps(chainId: number, vault: EvmAddress, strategy: EvmAddress) {
  const { estimatedAssets, refetch: refetchEstimatedAssets } = useOnChainEstimatedAssets(chainId, vault, strategy)
  const { totalAssets, refetch: refetchTotalAssets } = useTotalAssets(chainId, vault)

  const effectiveDebtRatioBps = useMemo(() => {
    if (totalAssets === 0n) return 0
    const percentage = bmath.div(estimatedAssets, totalAssets)
    return Math.floor(percentage * 10_000)
  }, [estimatedAssets, totalAssets])

  const refetch = useCallback(() => {
    refetchEstimatedAssets()
    refetchTotalAssets()
  }, [refetchEstimatedAssets, refetchTotalAssets])

  return { effectiveDebtRatioBps, refetch }
}
