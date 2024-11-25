import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { EvmAddress } from '@kalani/lib/types'

export function useManagement(chainId: number, strategy: EvmAddress) {
  const config = useConfig()
 
  const options = readContractQueryOptions(config, {
    chainId, abi: abis.strategy, address: strategy, functionName: 'management'
  })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  return { ...query, management: query.data }
}
