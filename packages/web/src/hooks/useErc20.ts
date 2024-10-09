import { Erc20Schema, EvmAddress } from '@kalani/lib/types'
import { erc20Abi } from 'viem'
import { useAccount, useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'

export function useErc20(options: { chainId?: number, address: EvmAddress }) {
  const { chainId: optionalChainId, address } = options
  const { chainId: accountChainId } = useAccount()
  const chainId = useMemo(() => optionalChainId ?? accountChainId ?? 1, [optionalChainId, accountChainId])

  const contracts = [
    {  chainId, address, abi: erc20Abi,  functionName: 'name' },
    {  chainId, address, abi: erc20Abi,  functionName: 'symbol' },
    {  chainId, address, abi: erc20Abi,  functionName: 'decimals' }
  ]

  const config = useConfig()
  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  const parsed = useMemo(() => Erc20Schema.safeParse({
    chainId,
    address,
    name: query.data?.[0]?.result as string | undefined,
    symbol: query.data?.[1]?.result as string | undefined,
    decimals: query.data?.[2]?.result as number ?? 18
  }), [chainId, address, query.data])

  if (!parsed.success) { throw new Error(`Not an ERC20 token: chainId ${chainId}, address ${address}`) }

  return { ...query, token: parsed.data }
}
