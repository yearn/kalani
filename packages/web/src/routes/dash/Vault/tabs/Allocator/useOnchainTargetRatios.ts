import { useCallback, useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useConfig } from 'wagmi'
import { useAllocator } from '../../useAllocator'
import { parseAbi, zeroAddress } from 'viem'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { EvmAddress } from '@kalani/lib/types'

export function useOnchainTargetRatios() {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  const { allocator } = useAllocator()

  const contracts = useMemo(() => vault?.strategies.map(strategy => ({
    abi: parseAbi(['function getStrategyTargetRatio(address _vault, address _strategy) external view returns (uint256)']),
    chainId: strategy.chainId, 
    address: allocator,
    functionName: 'getStrategyTargetRatio',
    args: [vault?.address ?? zeroAddress, strategy.address]
  })), [vault, allocator])

  const options = readContractsQueryOptions(config, { contracts })
  const query = useSuspenseQuery(options)

  const onChainTargetRatios = useMemo<{ strategy: EvmAddress, debtRatio: bigint }[]>(() => {
    const result: { strategy: EvmAddress, debtRatio: bigint }[] = []
    for (let i = 0; i < (vault?.strategies.length ?? 0); i++) {
      const strategy = vault?.strategies[i]
      result.push({ 
        strategy: vault?.strategies[i].address ?? zeroAddress, 
        debtRatio: BigInt((query.data[i].status === 'success') 
        ? (query.data[i].result as bigint) 
        : (strategy?.targetDebtRatio ?? 0n))
      })
    }
    return result
  }, [query, vault])

  const getOnchainTargetRatio = useCallback((strategy: EvmAddress) => {
    return onChainTargetRatios.find(a => a.strategy === strategy)?.debtRatio ?? 0n
  }, [onChainTargetRatios])

  return { ...query, onChainTargetRatios, getOnchainTargetRatio }
}

export function useOnchainTargetRatio(strategy: EvmAddress) {
  const { getOnchainTargetRatio } = useOnchainTargetRatios()
  return useMemo(() => getOnchainTargetRatio(strategy), [getOnchainTargetRatio, strategy])
}
