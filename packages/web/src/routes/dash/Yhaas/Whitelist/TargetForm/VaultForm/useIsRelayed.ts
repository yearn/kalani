import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { useWhitelist } from '../../useWhitelist'
import { useRelayers } from '../../relayers'
import { containsRole, EvmAddress } from '@kalani/lib/types'

export function useIsRelayed(args: { vault?: EvmAddress, chainId?: number, rolemask: bigint }) {
  const { vault, chainId, rolemask } = args
  const config = useConfig()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => vault !== undefined ? [vault] : _targets, [vault, _targets])
  const relayers = useRelayers(chainId)

  const contracts = useMemo(() => targets.map(target => relayers.map(relayer => ({
    abi: abis.vault, chainId, address: target, functionName: 'roles', args: [relayer]
  }))).flat(), [targets, relayers, chainId])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-expect-error "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isRelayed = useMemo(() => {
    return query.data.every(result => 
      result.status !== 'success' || (result.status === 'success'
      && containsRole(result.result as bigint, rolemask))
    )
  }, [rolemask, query])

  return { ...query, data: isRelayed }
}
