import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { useWhitelist } from '../../useWhitelist'
import { useRelayers } from '../../relayers'
import { EvmAddress } from '@kalani/lib/types'
import { compareEvmAddresses } from '@kalani/lib/strings'

export function useIsRelayed(o?: { chainId?: number, strategy?: EvmAddress }) {
  const { chainId, strategy } = o ?? {}
  const config = useConfig()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => strategy !== undefined ? [strategy] : _targets, [strategy, _targets])
  const relayers = useRelayers(chainId)

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.strategy, chainId, address: target, functionName: 'keeper'
  })), [targets, chainId])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isRelayed = useMemo(() => {
    return query.data.every(result => 
      result.status === 'success' 
      && relayers.some(relayer => compareEvmAddresses(result.result.toString(), relayer))
    )
  }, [relayers, query])

  return { ...query, data: isRelayed }
}
