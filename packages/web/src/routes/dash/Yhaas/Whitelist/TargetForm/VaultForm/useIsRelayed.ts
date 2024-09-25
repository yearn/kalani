import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { useWhitelist } from '../../provider'
import { useRelayer } from '../../relayers'
import { containsRole, EvmAddress } from '@kalani/lib/types'
import { zeroAddress } from 'viem'

export function useIsRelayed(args: { vault?: EvmAddress, rolemask: bigint }) {
  const { vault, rolemask } = args
  const config = useConfig()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => vault !== undefined ? [vault] : _targets, [vault, _targets])
  const relayer = useRelayer()

  const contracts = useMemo(() => targets.map(target => ({
    abi: abis.vault, address: target, functionName: 'roles', args: [relayer ?? zeroAddress],
  })), [targets, relayer])

  const options = readContractsQueryOptions(config, { contracts })

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(options)

  const isRelayed = useMemo(() => {
    return query.data.every(result => 
      result.status === 'success'
      && containsRole(result.result as bigint, rolemask)
    )
  }, [rolemask, relayer, query])

  return { ...query, data: isRelayed }
}
