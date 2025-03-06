import { z } from 'zod'
import { EvmAddress } from '@kalani/lib/types'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'

export const StrategyParamsSchema = z.object({
  activation: z.bigint(),
  lastReport: z.bigint(),
  currentDebt: z.bigint(),
  maxDebt: z.bigint(),
})

export type StrategyParams = z.infer<typeof StrategyParamsSchema>

export function useOnChainStrategyParams(chainId: number, vault: EvmAddress, strategy: EvmAddress) {
  const config = useConfig()
  
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function strategies(address) external view returns (uint256, uint256, uint256, uint256)']),
    chainId: chainId,
    address: vault,
    functionName: 'strategies',
    args: [strategy]
  }))

  const strategyParams = useMemo(() => {
    const [activation, lastReport, currentDebt, maxDebt] = query.data
    return StrategyParamsSchema.parse({ activation, lastReport, currentDebt, maxDebt })
  }, [query])

  return { ...query, strategyParams }
}
