import { z } from 'zod'
import { EvmAddress, EvmAddressSchema, HexString, HexStringSchema } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../lib/env'
import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useCallback, useMemo } from 'react'
import useLocalStorage from 'use-local-storage'
import { useConfig, useReadContract } from 'wagmi'
import abis from '@kalani/lib/abis'
import { ROLE_MANAGER_FACTORY } from '@kalani/lib/addresses'
import { zeroAddress, zeroHash } from 'viem'
import { readContractQueryOptions } from 'wagmi/query'

export const ProjectSchema = z.object({
  chainId: z.number(),
  id: HexStringSchema,
  name: z.string(),
  roleManager: EvmAddressSchema,
  registry: EvmAddressSchema,
  accountant: EvmAddressSchema,
  debtAllocator: EvmAddressSchema,
  roleManagerFactory: EvmAddressSchema
})

export type Project = z.infer<typeof ProjectSchema>

export const useProjectsNonce = create<{ nonce: string, next: () => void }>(set => ({
  nonce: nanoid(16), next: () => set(() => ({ nonce: nanoid(16) }))
}))

const QUERY = `query Query($chainId: Int) {
  projects(chainId: $chainId) {
    chainId
    id
    name
    roleManager
    registry
    accountant
    debtAllocator
    roleManagerFactory
  }
}`

async function fetchProjects(chainId: number, nonce: string) {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { chainId, nonce }
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export function useLocalProjects() {
  const [localProjects, _setLocalProjects] = useLocalStorage<Project[]>('use-local-projects', [])
  const setLocalProjects = useCallback(async (updater: (projects: Project[]) => Project[]) => {
    _setLocalProjects(projects => updater(projects ?? []))
    await new Promise(resolve => setTimeout(resolve, 10))
  }, [_setLocalProjects])
  return { localProjects, setLocalProjects }
}

export function useProjects(chainId: number | undefined, address?: EvmAddress | undefined) {
  const nonce = useProjectsNonce(state => state.nonce)
  const { localProjects } = useLocalProjects()

  const query = useSuspenseQuery({
    queryKey: ['useProjects', chainId, address, nonce],
    queryFn: async () => {
      if (!chainId) return []
      const { data: { projects } } = await fetchProjects(chainId, nonce)
      if (!address) return projects
      return projects.filter((project: Project) => 
        compareEvmAddresses(project.roleManager, address)
      )
    }
  })

  const projects = useMemo(() => {
    const indexed = ProjectSchema.array().parse(query.data?.data?.projects ?? [])
    const result = [...indexed, ...localProjects]
    result.sort((a, b) => a.name.localeCompare(b.name))
    return result
  }, [query, localProjects])
  return { ...query, projects }
}

export function useReadProject(chainId?: number, id?: HexString, enabled = true) {
  const readProject = useReadContract({
    abi: abis.roleManagerFactory,
    chainId, address: ROLE_MANAGER_FACTORY,
    functionName: 'projects',
    args: [id ?? zeroHash],
    query: { enabled }
  })

  const roleManager = useMemo(() => readProject.data?.[0] ?? zeroAddress, [readProject])

  const readRoleManager = useReadContract({
    abi: abis.roleManager,
    chainId, address: roleManager,
    functionName: 'name',
    query: { enabled: roleManager !== zeroAddress }
  })

  const name = useMemo(() => (readRoleManager.data ?? '').replace(' Role Manager', ''), [readRoleManager])

  const project = useMemo(() => ProjectSchema.parse({
    chainId: chainId ?? 0, 
    id: id ?? zeroAddress, 
    name, 
    roleManager,
    registry: readProject.data?.[1] ?? zeroAddress,
    accountant: readProject.data?.[2] ?? zeroAddress,
    debtAllocator: readProject.data?.[3] ?? zeroAddress,
    roleManagerFactory: ROLE_MANAGER_FACTORY
  }), [chainId, id, name, readProject])

  return { readProject, readRoleManager, project }
}

export function useSuspenseReadProject(chainId?: number, id?: HexString) {
  const config = useConfig()

  const readProject = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: abis.roleManagerFactory,
      chainId, address: ROLE_MANAGER_FACTORY,
      functionName: 'projects',
      args: [id ?? zeroHash]
    })
  )

  const roleManager = useMemo(() => readProject.data?.[0] ?? zeroAddress, [readProject])

  const readRoleManager = useSuspenseQuery(
    readContractQueryOptions(config, {
      abi: abis.roleManager,
      chainId, address: roleManager,
      functionName: 'name'
    })
  )

  const name = useMemo(() => (readRoleManager.data ?? '').replace(' Role Manager', ''), [readRoleManager])

  const project = useMemo(() => ProjectSchema.parse({
    chainId: chainId ?? 0, 
    id: id ?? zeroAddress, 
    name, 
    roleManager,
    registry: readProject.data?.[1] ?? zeroAddress,
    accountant: readProject.data?.[2] ?? zeroAddress,
    debtAllocator: readProject.data?.[3] ?? zeroAddress,
    roleManagerFactory: ROLE_MANAGER_FACTORY
  }), [chainId, id, name, readProject])

  return { readProject, readRoleManager, project }
}
