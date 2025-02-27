import { useSuspenseQuery } from '@tanstack/react-query'
import { EvmAddress } from '@kalani/lib/types'
import { useConfig } from 'wagmi'
import { readContractQueryOptions, readContractsQueryOptions } from 'wagmi/query'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'

export function useVaultAsset(chainId: number, vault: EvmAddress) {
  const config = useConfig()

	const addressQuery = useSuspenseQuery(readContractQueryOptions(config, {
    chainId,
    abi: abis.vault,
    address: vault,
    functionName: 'asset',
  }))

	const infoQuery = useSuspenseQuery(readContractsQueryOptions(config, { contracts: [
    { chainId, abi: abis.vault, address: addressQuery.data, functionName: 'symbol' },
    { chainId, abi: abis.vault, address: addressQuery.data, functionName: 'decimals' },
    { chainId, abi: abis.vault, address: addressQuery.data, functionName: 'name' },
  ]}))

  const asset = useMemo(() => ({
    chainId,
    address: addressQuery.data,
    symbol: infoQuery.data[0]?.result ?? '',
    decimals: infoQuery.data[1]?.result ?? 18,
    name: infoQuery.data[2]?.result ?? ''
  }), [addressQuery.data, infoQuery.data, chainId])

  return {
    addressQuery,
    infoQuery,
    asset
  }
}
