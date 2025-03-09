import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useMemo } from 'react'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { parseAbi, zeroAddress } from 'viem'

function useOnChainDefaultQueue(chainId: number, vault: EvmAddress) {
  const config = useConfig()
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function get_default_queue() external view returns (address[])']),
    chainId: chainId,
    address: vault,
    functionName: 'get_default_queue'
  }))
  return { ...query, defaultQueue: query.data.map(a => EvmAddressSchema.parse(a)) }
}

export function useDefaultQueueComposite() {
  const { vault } = useVaultFromParams()
  const { defaultQueue: onChainDefaultQueue, refetch } = useOnChainDefaultQueue(vault?.chainId ?? 0, vault?.address ?? zeroAddress)

  const defaultQueue = useMemo(() => {
    const unsorted = (vault?.strategies ?? []).filter(a => onChainDefaultQueue.includes(a.address))
    const sorted: EvmAddress[] = onChainDefaultQueue
    return unsorted.sort((a, b) => sorted.indexOf(a.address) - sorted.indexOf(b.address))
  }, [vault, onChainDefaultQueue])

  return { defaultQueue, refetch }
}
