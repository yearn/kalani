import { z } from 'zod'
import { EvmAddress } from '@kalani/lib/types'
import { useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { usePrice } from '../../hooks/usePrices'
import bmath from '@kalani/lib/bmath'
import abis from '@kalani/lib/abis'
import { parseAbi } from 'viem'
import { APR_ORACLE } from '@kalani/lib/addresses'
import { useFinderUtils } from '../Finder/useFinderItems'

const ReturnSchema = z.object({
  decimals: z.number({ coerce: true }),
  shares: z.bigint({ coerce: true }),
  assets: z.bigint({ coerce: true }),
  assetPrice: z.number({ coerce: true }),
  apr: z.number({ coerce: true })
})

function useDecimals(options: { chainId: number, vault: EvmAddress }) {
  const { findFinderItem } = useFinderUtils()
  const item = useMemo(() => findFinderItem({ ...options, address: options.vault }), [findFinderItem, options])
  return useMemo(() => item?.token?.decimals ?? 18, [item])
}

function useHistoricalApr(options: { chainId: number, vault: EvmAddress }) {
  const { findFinderItem } = useFinderUtils()
  const apy = useMemo(() => findFinderItem({ ...options, address: options.vault })?.apy ?? 0, [findFinderItem, options])
  return useMemo(() => {
    return Math.pow(1 + apy / 365, 365) - 1
  }, [apy])
}

export function useVaultBalance(options: { chainId: number, vault: EvmAddress, wallet: EvmAddress }) {
  const config = useConfig()
  const { chainId, vault, wallet } = options
  const decimals = useDecimals(options)
  const historicalApr = useHistoricalApr(options)

  const contracts = [
    { chainId, address: vault, abi: abis.vault, functionName: 'asset' },
    { chainId, address: vault, abi: abis.vault, functionName: 'balanceOf', args: [wallet] },
    { chainId, address: vault, abi: abis.vault, functionName: 'convertToShares', args: [10n ** BigInt(decimals)] },
    { 
      chainId, 
      address: APR_ORACLE, 
      abi: parseAbi(['function currentApr(address) external view returns (uint256)']), 
      functionName: 'currentApr', 
      args: [vault] 
    },
  ]

  // @ts-ignore "Type instantiation is excessively deep and possibly infinite. ts(2589)"
  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  const asset = query.data?.[0]?.result as EvmAddress
  const assetPrice = usePrice(chainId, asset)

  const shares = useMemo(() => {
    return (query.data?.[1]?.result as bigint | undefined) ?? 0n
  }, [query.data])

  const assets = useMemo(() => {
    const assetToShares1e18 = (query.data?.[2]?.result as bigint | undefined) ?? 1n
    const assetToShares = bmath.div(assetToShares1e18, 10n ** BigInt(decimals))
    const assets = bmath.mul(shares, assetToShares)
    return BigInt(assets)
  }, [shares, query.data, decimals])

  const apr = useMemo(() => {
    if (query.data?.[3].error) return historicalApr
    const oracleApr = (query.data?.[3]?.result as bigint | undefined) ?? 0n
    return bmath.div(oracleApr, 10n ** 18n)
  }, [query.data, historicalApr])

  const parsed = useMemo(() => ReturnSchema.parse({
    decimals,
    shares,
    assets,
    assetPrice,
    apr
  }), [chainId, vault, wallet, query.data])

  return { ...query, ...parsed }
}
