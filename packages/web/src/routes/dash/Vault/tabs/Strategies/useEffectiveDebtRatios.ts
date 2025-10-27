import { useMemo, useCallback } from 'react'
import { EvmAddress } from '@kalani/lib/types'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import bmath from '@kalani/lib/bmath'

type Strategy = {
  address: EvmAddress
}

export function useEffectiveDebtRatios(chainId: number, vault: EvmAddress, strategies: Strategy[]) {
  const config = useConfig()

  const contracts = useMemo(() => {
    
    const calls = [
      // First get totalAssets
      {
        chainId,
        address: vault,
        abi: parseAbi(['function totalAssets() external view returns (uint256)']),
        functionName: 'totalAssets' as const,
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ] as any[]

    // Then for each strategy, get balanceOf and convertToAssets
    for (const strategy of strategies) {
      calls.push(
        {
          chainId,
          address: strategy.address,
          abi: parseAbi(['function balanceOf(address) external view returns (uint256)']),
          functionName: 'balanceOf' as const,
          args: [vault],
        },
        {
          chainId,
          address: strategy.address,
          abi: parseAbi(['function convertToAssets(uint256) external view returns (uint256)']),
          functionName: 'convertToAssets' as const,
          args: [1n],
        }
      )
    }

    return calls
  }, [chainId, vault, strategies])

  const query = useSuspenseQuery({
    ...readContractsQueryOptions(config, { contracts }),
    staleTime: 30_000
  })

  const effectiveDebtRatios = useMemo(() => {
    const data = query.data
    if (!data) return {}

    const totalAssets = data[0]?.result as bigint | undefined
    if (!totalAssets || totalAssets === 0n) {
      return Object.fromEntries(strategies.map(s => [s.address, 0]))
    }

    const ratios: Record<string, number> = {}

    strategies.forEach((strategy, index) => {
      const balanceIndex = 1 + index * 2
      const convertIndex = 2 + index * 2

      const balance = data[balanceIndex]?.result as bigint | undefined
      const convertRate = data[convertIndex]?.result as bigint | undefined

      if (balance && convertRate) {
        const estimatedAssets = balance * convertRate
        const percentage = Number(bmath.div(estimatedAssets, totalAssets))
        ratios[strategy.address] = percentage
      } else {
        ratios[strategy.address] = 0
      }
    })

    return ratios
  }, [query.data, strategies])

  const refetch = useCallback(() => {
    query.refetch()
  }, [query])

  return { effectiveDebtRatios, refetch }
}
