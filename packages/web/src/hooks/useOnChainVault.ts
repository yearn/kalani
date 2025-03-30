import { z } from 'zod'
import { EvmAddress } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractsQueryOptions } from 'wagmi/query'
import { parseAbi } from 'viem'
import { useConfig } from 'wagmi'

export const VaultSchema = z.object({
  chainId: z.number(),
  address: z.string(),
  totalAssets: z.bigint()
})

export type StrategyParams = z.infer<typeof VaultSchema>

export function useOnChainVault(chainId: number, vault: EvmAddress) {
  const config = useConfig()

  const query = useSuspenseQuery(readContractsQueryOptions(config, { contracts: [
    {
      abi: parseAbi(['function totalAssets() external view returns (uint256)']),
      chainId: chainId,
      address: vault,
      functionName: 'totalAssets'
    }
  ] }))

  return { ...query, vault: {
    chainId,
    address: vault,
    totalAssets: query.data?.[0].result ?? 0n
  } }
}
