import { Erc20, EvmAddress } from '@kalani/lib/types'
import { Config, useConfig } from 'wagmi'
import { useSuspenseQuery } from '@tanstack/react-query'
import { readContractQueryOptions } from 'wagmi/query'
import abis from '@kalani/lib/abis'
import { useSelectedProject } from '../../../components/SelectProject/useSelectedProject'
import { zeroAddress } from 'viem'
import { getPublicClient } from 'wagmi/actions'

export async function fetchNumVaults(config: Config, registry?: EvmAddress, asset?: Erc20) {
  if (!registry || !asset?.chainId) return 0

  const publicClient = getPublicClient(config)

  if (!publicClient) return 0

  const numVaults = await publicClient.readContract({
    abi: abis.registry,
    address: registry,
    functionName: 'numEndorsedVaults',
    args: [asset.address]
  })

  return Number(numVaults)
}


export function useNumVaults(asset?: Erc20) {
  const config = useConfig()
  const { selectedProject } = useSelectedProject()

  const query = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: abis.registry,
      address: selectedProject?.registry ?? zeroAddress,
      chainId: asset?.chainId,
      functionName: 'numEndorsedVaults',
      args: [asset?.address ?? zeroAddress]
    })
  )

  return { ...query, numVaults: Number(query.data) }
}
