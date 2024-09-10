import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '../../../../../../lib/abis'
import { compareEvmAddresses } from '../../../../../../lib/types'
import { useWhitelist } from '../../provider'
import { getRelayer } from '../../relayers'

export function useIsRelayed() {
  const config = useConfig()
  const { chainId } = useAccount()
  const { targets } = useWhitelist()
  const relayer = getRelayer(chainId)

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.strategy, address: target, functionName: 'keeper'
  })), [targets])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isRelayed = useMemo(() => {
    return query.data.every(result => 
      result.status === 'success' 
      && compareEvmAddresses(result.result.toString(), relayer)
    )
  }, [relayer, query])

  return { ...query, data: isRelayed }
}
