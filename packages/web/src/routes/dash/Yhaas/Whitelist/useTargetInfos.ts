import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractsQueryOptions } from 'wagmi/query'
import { useConfig } from 'wagmi'
import { EvmAddress } from '../../../../lib/types'
import abis from '../../../../lib/abis'
import { useMemo } from 'react'
import { zeroAddress } from 'viem'

export type TargetType = 'vault' | 'strategy' | 'allocator'

export function useTargetInfos(addresses: EvmAddress[]) {
  const config = useConfig()

  const contracts = useMemo(() => addresses.map(address => ([
    { abi: abis.vault, address, functionName: 'name' },
    { abi: abis.vault, address, functionName: 'role_manager' },
    { abi: abis.strategy, address, functionName: 'keeper' },
    { abi: abis.allocator, address, functionName: 'getStrategyTargetRatio', args: [zeroAddress] }
  ])).flat(), [addresses])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const targetInfos = useMemo(() => {
    const result: { address: EvmAddress, name: string | undefined, targetType: TargetType | undefined }[] = []
    for (let i = 0; i < addresses.length; i++) {
      const name = query.data[i * 4].status === 'success' ? query.data[i * 4].result!.toString() : undefined
      const targetType = query.data[i * 4 + 1].status === 'success'
        ? 'vault'
        : query.data[i * 4 + 2].status === 'success'
          ? 'strategy'
          : query.data[i * 4 + 3].status === 'success'
            ? 'allocator'
            : undefined

      result.push({ address: addresses[i], name, targetType })
    }
    return result
  }, [addresses, query])

  return { ...query, targetInfos }
}
