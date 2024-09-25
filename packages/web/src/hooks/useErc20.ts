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
  const multicallAddress = config.chains[0].contracts?.multicall3?.address ?? '0xcA11bde05977b3631167028862bE2a173976CA11'

  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts, multicallAddress })
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

