import { EvmAddressSchema, HexString, HexStringSchema } from '@kalani/lib/types'
import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import { zeroAddress } from 'viem'
import { z } from 'zod'

export const ProjectSchema = z.object({
  projectId: HexStringSchema,
  projectName: z.string(),
  roleManager: EvmAddressSchema,
  registry: EvmAddressSchema,
  accountant: EvmAddressSchema,
  debtAllocator: EvmAddressSchema
})

export type Project = z.infer<typeof ProjectSchema>

export function useProjectSnapshot(options: { chainId?: number, projectId: HexString, projectName: string, [key: string]: any }) {
  const config = useConfig()
  const { chainId, projectId, projectName, ...rest } = options

  const query = useSuspenseQuery(
    readContractQueryOptions(config, { 
      chainId, address: ROLE_MANAGER_FACTORY, abi: abis.roleManagerFactory, 
      functionName: 'projects', args: [projectId]
    })
  )

  const object = useMemo(() => {
    const result = {
      projectId, projectName,
      roleManager: query.data?.[0] ?? zeroAddress,
      registry: query.data?.[1] ?? zeroAddress,
      accountant: query.data?.[2] ?? zeroAddress,
      debtAllocator: query.data?.[3] ?? zeroAddress
    }
    Object.assign(result, rest)
    return result
  }, [projectId, projectName, query.data, rest])

  const parsed = ProjectSchema.safeParse(object)

  if (!parsed.success) { throw parsed.error }

  return { ...query, snapshot: parsed.data }
}
