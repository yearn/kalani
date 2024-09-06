import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractsQueryOptions } from 'wagmi/query'
import { useConfig } from 'wagmi'
import { EvmAddress } from '../../../../lib/types'
import abis from '../../../../lib/abis'
import { useMemo } from 'react'
import { parseAbi, zeroAddress } from 'viem'

export type TargetType = 'vault' | 'strategy' | 'allocator'

export function useTargetType(address?: EvmAddress) {
  const config = useConfig()
  const options = readContractsQueryOptions(config, { contracts: [
    { abi: parseAbi(['function name() public view returns (string)']), address, functionName: 'name' },
    { abi: abis.vault, address, functionName: 'role_manager' },
    { abi: abis.strategy, address, functionName: 'keeper' },
    { abi: abis.allocator, address, functionName: 'getStrategyTargetRatio', args: [zeroAddress] }
  ]})

  const query = useSuspenseQuery(options)

  const name = useMemo(() => {
    if (query.data[0].status === 'success') return query.data[0].result
    return undefined
  }, [query])

  const targetType = useMemo(() => {
    if (query.data[1].status === 'success') return 'vault'
    if (query.data[2].status === 'success') return 'strategy'
    if (query.data[3].status === 'success') return 'allocator'
    return undefined
  }, [query])

  return { ...query, data: targetType, name: name ?? targetType }
}
