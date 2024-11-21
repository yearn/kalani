import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount, useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useWhitelist } from '../../useWhitelist'

export function useIsManagement() {
  const config = useConfig()
  const { address } = useAccount()
  const { targets } = useWhitelist()

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.strategy, address: target, functionName: 'management'
  })), [targets])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isManagement = useMemo(() => query.data.every(result => 
    result.status === 'success' 
    && compareEvmAddresses(result.result.toString(), address)
  ), [address, query])

  return { ...query, data: isManagement }
}
