import { EvmAddress } from '@kalani/lib/types'
import { erc20Abi } from 'viem'
import { useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useErc20(address: EvmAddress) {
  const contracts = [
    {  address, abi: erc20Abi,  functionName: 'name' },
    {  address, abi: erc20Abi,  functionName: 'symbol' },
    {  address, abi: erc20Abi,  functionName: 'decimals' }
  ]

  const config = useConfig()
  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  return {
    ...query,
    token: {
      name: query.data?.[0]?.result as string | undefined,
      symbol: query.data?.[1]?.result as string | undefined,
      decimals: query.data?.[2]?.result as number ?? 18
    }
  }
}

