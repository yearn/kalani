import { useCallback } from 'react'
import { useMutation, useMutationState } from '@tanstack/react-query'
import { EvmAddress, HexString } from '@kalani/lib/types'
import { extractLogs, extractSnapshot, postThing } from '../../lib/indexer'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'

export function useIndexProject(
  chainId: number | undefined, 
  projectId: HexString | undefined
) {
  const indexProject = useCallback(async (roleManager: EvmAddress, inceptBlock: bigint, inceptTime: number) => {
    if (!chainId || !projectId || !roleManager || !inceptBlock || !inceptTime) return

    await postThing(chainId, roleManager, 'roleManager', {
      roleManagerFactory: ROLE_MANAGER_FACTORY,
      project: { id: projectId },
      inceptBlock, inceptTime
    })

    await extractSnapshot('yearn/3/roleManager', chainId, roleManager)
    await extractLogs('yearn/3/roleManagerFactory', chainId, ROLE_MANAGER_FACTORY, inceptBlock - 1n, inceptBlock + 1n)
    await extractSnapshot('yearn/3/roleManagerFactory', chainId, ROLE_MANAGER_FACTORY)
  }, [chainId, projectId])

  const mutation = useMutation({
    mutationKey: ['postThing', chainId, projectId],
    mutationFn: async (args: { roleManager: EvmAddress, inceptBlock: bigint, inceptTime: number }) => 
      await indexProject(args.roleManager, args.inceptBlock, args.inceptTime)
  })

  const [state] = useMutationState({
    filters: { mutationKey: ['postThing', chainId, projectId] }
  })

  return { mutation, state }
}
