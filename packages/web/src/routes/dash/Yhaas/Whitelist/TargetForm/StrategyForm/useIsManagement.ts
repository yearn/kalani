import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractQueryOptions } from 'wagmi/query'
import abis from '../../../../../../lib/abis'
import { compareEvmAddresses } from '../../../../../../lib/types'
import { useWhitelist } from '../../provider'

export function useIsManagement() {
  const config = useConfig()
  const { address } = useAccount()
  const { targetOrUndefined: target } = useWhitelist()

  const options = readContractQueryOptions(config, { 
    abi: abis.strategy, address: target, functionName: 'management' 
  })

  const query = useSuspenseQuery(options)
  const isManagement = useMemo(() => compareEvmAddresses(query.data, address), [address, query])
  return { ...query, data: isManagement }
}
