import { z } from 'zod'
import { Erc20Schema, EvmAddress } from '@kalani/lib/types'
import { erc20Abi } from 'viem'
import { useAccount, useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import usePrices from '../../../../../../hooks/usePrices'
import { priced } from '@kalani/lib/bmath'

const BalanceSchema = Erc20Schema.extend({
  balance: z.bigint({ coerce: true }),
  balanceUsd: z.number({ coerce: true })
})

export function useBalance(options: { chainId?: number, token: EvmAddress, address: EvmAddress }) {
  const { chainId: optionalChainId, address } = options
  const { chainId: accountChainId } = useAccount()
  const chainId = useMemo(() => optionalChainId ?? accountChainId ?? 1, [optionalChainId, accountChainId])

  const contracts = [
    {  chainId, address: options.token, abi: erc20Abi,  functionName: 'name' },
    {  chainId, address: options.token, abi: erc20Abi,  functionName: 'symbol' },
    {  chainId, address: options.token, abi: erc20Abi,  functionName: 'decimals' },
    {  chainId, address: options.token, abi: erc20Abi,  functionName: 'balanceOf', args: [address] }
  ]

  const config = useConfig()
  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  const parsed = useMemo(() => BalanceSchema.safeParse({
    chainId,
    address,
    name: query.data?.[0]?.result as string | undefined,
    symbol: query.data?.[1]?.result as string | undefined,
    decimals: query.data?.[2]?.result as number ?? 18,
    balance: query.data?.[3]?.result ?? 0n,
    balanceUsd: 0,
  }), [chainId, address, query.data])

  const { data: prices } = usePrices(chainId, [options.token])
  const price = useMemo(() => prices[0] ?? 0, [prices])
  const balanceUsd = useMemo(() => priced(parsed.data?.balance ?? 0n, parsed.data?.decimals ?? 18, price), [parsed, price])

  return { ...query, ...parsed.data, price, balanceUsd }
}
