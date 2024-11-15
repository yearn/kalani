import { useCallback } from 'react'
import { useMutation, useMutationState } from '@tanstack/react-query'
import { EvmAddress, HexString } from '@kalani/lib/types'
import { API_URL } from '../../../lib/env'

export type IndexVaultArgs = {
  asset?: EvmAddress,
  decimals?: number,
  apiVersion?: string,
  category?: number,
  projectId?: HexString,
  projectName?: string,
  roleManager?: EvmAddress,
  inceptBlock?: bigint,
  inceptTime?: number,
  signature?: HexString
}

export function useIndexVault(chainId?: number, address?: EvmAddress) {
  const indexVault = useCallback(async ({
    asset, decimals, apiVersion, category,
    projectId, projectName, roleManager,
    inceptBlock, inceptTime, 
    signature
  }: IndexVaultArgs) => {
    if (!chainId || !address || !asset || !decimals || !apiVersion || !category || !projectId || !projectName || !roleManager || !inceptBlock || !inceptTime || !signature) {
      throw new Error('Missing required arguments')
    }

    const response = await fetch(`${API_URL}/api/kong/index/vault`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chainId, address, asset, decimals, apiVersion, category,
        projectId, projectName, roleManager, 
        inceptBlock, inceptTime, signature
      })
    })
    if (!response.ok) { throw new Error(`HTTP error! status: ${response.status}`) }
    return await response.json()

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
