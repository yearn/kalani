import abis from '@kalani/lib/abis'
import { isNothing } from '@kalani/lib/strings'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { ADDRESS_PROVIDER } from '@kalani/lib/addresses'
import { zeroAddress } from 'viem'

export function useAllocatorFactoryAddress() {
  const config = useConfig()

  const query = useSuspenseQuery(readContractQueryOptions(config, {
    address: ADDRESS_PROVIDER, abi: abis.addressProvider, functionName: 'getAllocatorFactory'
  }))

  const factory = useMemo(() => {
    const result = query.data
    if (!isNothing(result) && result !== zeroAddress) { return result }

    console.warn('using internal factory')
    if (config.getClient().chain.id === 137) {
      return '0x0D1F62247035BBFf16742B0f31e8e2Af3aCd6e67'
    } else {
      return '0xfCF8c7C43dedd567083B422d6770F23B78D15BDe'
    }
  }, [config, query.data])

  return {
    ...query,
    factory
  }
}
