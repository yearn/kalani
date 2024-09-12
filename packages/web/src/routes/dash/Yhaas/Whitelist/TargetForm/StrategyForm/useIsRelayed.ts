import { useSuspenseQuery } from '@tanstack/react-query'
import { useConfig } from 'wagmi'
import { useMemo } from 'react'
import { readContractsQueryOptions } from 'wagmi/query'
import abis from '../../../../../../lib/abis'
import { useWhitelist } from '../../provider'
import { useRelayer } from '../../relayers'
import { EvmAddress } from '@kalani/lib/types'
import { compareEvmAddresses } from '@kalani/lib/strings'

export function useIsRelayed(o?: { strategy?: EvmAddress }) {
  const { strategy } = o ?? {}
  const config = useConfig()
  const { targets: _targets } = useWhitelist()
  const targets = useMemo(() => strategy !== undefined ? [strategy] : _targets, [strategy, _targets])
  const relayer = useRelayer()

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
