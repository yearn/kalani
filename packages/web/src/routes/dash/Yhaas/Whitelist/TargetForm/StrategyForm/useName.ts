import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import abis from '../../../../../../lib/abis'
import { useWhitelist } from '../../provider'

export function useName() {
  const config = useConfig()
  const { targetOrUndefined: target } = useWhitelist()

  const options = readContractQueryOptions(config, { 
    abi: abis.strategy, address: target, functionName: 'name'
  })

  return useSuspenseQuery(options)
}
