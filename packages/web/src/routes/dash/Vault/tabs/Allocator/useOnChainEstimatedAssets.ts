import { EvmAddress } from '@kalani/lib/types'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import { useCallback } from 'react'

export function useOnChainEstimatedAssets(chainId: number, vault: EvmAddress, strategy: EvmAddress) {
  const config = useConfig()
  
  const balanceQuery = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function balanceOf(address) external view returns (uint256)']),
    chainId: chainId,
    address: strategy,
    functionName: 'balanceOf',
    args: [vault]
  }))

  const assetsQuery = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function convertToAssets(uint256) external view returns (uint256)']),
    chainId: chainId,
    address: strategy,
    functionName: 'convertToAssets',
    args: [balanceQuery.data]
  }))

  const refetch = useCallback(() => {
    balanceQuery.refetch()
  }, [balanceQuery])

  return { balanceQuery, assetsQuery, shares: balanceQuery.data, estimatedAssets: assetsQuery.data, refetch }
}
