import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractQueryOptions } from 'wagmi/query'
import abis from '../../../../../../lib/abis'
import { compareEvmAddresses } from '../../../../../../lib/types'
import { useWhitelist } from '../../provider'
import { getRelayer } from '../../relayers'

export function useIsRelayed() {
  const config = useConfig()
  const { chainId } = useAccount()
  const { targetOrUndefined: target } = useWhitelist()
  const relayer = getRelayer(chainId)

  const options = readContractQueryOptions(config, { 
    abi: abis.strategy, address: target, functionName: 'keeper'
  })

  const query = useSuspenseQuery(options)
  const isRelayed = useMemo(() => compareEvmAddresses(query.data, relayer), [relayer, query])
  return { ...query, data: isRelayed }
}
