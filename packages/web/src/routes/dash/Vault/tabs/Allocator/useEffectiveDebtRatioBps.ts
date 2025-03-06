import { EvmAddress } from '@kalani/lib/types'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'
import bmath from '@kalani/lib/bmath'

export function useEffectiveDebtRatioBps(chainId: number, vault: EvmAddress, strategy: EvmAddress) {
  const config = useConfig()
  const { estimatedAssets } = useOnChainEstimatedAssets(chainId, vault, strategy)

  const totalAssetsQuery = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function totalAssets() external view returns (uint256)']),
    chainId: chainId,
    address: vault,
    functionName: 'totalAssets',
    args: []
  }))

  const effectiveDebtRatioBps = useMemo(() => {
    if (totalAssetsQuery.data === 0n) return 0
    const percentage = bmath.div(estimatedAssets, totalAssetsQuery.data)
    return Math.floor(percentage * 10_000)
  }, [estimatedAssets, totalAssetsQuery])

  return { ...totalAssetsQuery, effectiveDebtRatioBps }
}
