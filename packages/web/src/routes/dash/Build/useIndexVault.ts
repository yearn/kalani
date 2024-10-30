import { useCallback } from 'react'
import { useMutation, useMutationState } from '@tanstack/react-query'
import { EvmAddress, HexString } from '@kalani/lib/types'
import { extractSnapshot, postThing } from '../../../lib/indexer'

export type IndexVaultArgs = {
  asset?: EvmAddress,
  decimals?: number,
  apiVersion?: string,
  projectId?: HexString,
  roleManager?: EvmAddress,
  inceptBlock?: bigint,
  inceptTime?: number
}

export function useIndexVault(chainId?: number, address?: EvmAddress) {
  const indexVault = useCallback(async ({
    asset, decimals, apiVersion,
    projectId, roleManager,
    inceptBlock, inceptTime
  }: IndexVaultArgs) => {
    if (!chainId || !address || !asset || !decimals || !apiVersion || !projectId || !roleManager || !inceptBlock || !inceptTime) {
      throw new Error('Missing required arguments')
    }

    await postThing(chainId, address, 'vault', {
      erc4626: true, yearn: false,
      asset, decimals, apiVersion, projectId, roleManager,
      inceptBlock, inceptTime
    })

    await extractSnapshot('yearn/3/vault', chainId, address)
  }, [chainId, address])

  const mutation = useMutation({
    mutationKey: ['indexVault', chainId, address],
    mutationFn: async (args: IndexVaultArgs) => await indexVault(args)
  })

  const [state] = useMutationState({
    filters: { mutationKey: ['indexVault', chainId, address] }
  })

  return { mutation, state }
}
