import { EvmAddress } from '@kalani/lib/types'
import { readContractQueryOptions, readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import { useCallback, useMemo } from 'react'

export function useOnChainEstimatedAssets(chainId: number, vault: EvmAddress, strategy: EvmAddress) {
  const config = useConfig()
  
  const balanceQuery = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function balanceOf(address) external view returns (uint256)']),
    chainId: chainId,
    address: strategy,
    functionName: 'balanceOf',
    args: [vault]
  }))

  const assetsMulticall = useSuspenseQuery(readContractsQueryOptions(config, { contracts: [
    {
      abi: parseAbi(['function convertToAssets(uint256) external view returns (uint256)']),
      chainId: chainId,
      address: strategy,
      functionName: 'convertToAssets',
      args: [1n]
    }
  ]}))

  const refetch = useCallback(() => {
    balanceQuery.refetch()
    assetsMulticall.refetch()
  }, [balanceQuery, assetsMulticall])

  const estimatedAssets = useMemo(() => {
    const balance = balanceQuery.data
    const convertOneShareToAssets = assetsMulticall.data?.[0].result ?? 1n
    return balance * convertOneShareToAssets
  }, [balanceQuery.data, assetsMulticall])

  return { balanceQuery, assetsMulticall, shares: balanceQuery.data, estimatedAssets, refetch }
}
