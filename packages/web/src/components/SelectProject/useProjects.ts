import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema } from '@kalani/lib/types'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../lib/env'
import { nanoid } from 'nanoid'
import { create } from 'zustand'

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

export function useProjects(chainId: number) {
  const nonce = useProjectsNonce(state => state.nonce)

  const query = useSuspenseQuery({
    queryKey: ['useProjects', chainId, nonce],
    queryFn: () => fetchProjects(chainId, nonce)
  })

  return {
    ...query,
    projects: ProjectSchema.array().parse(query.data?.data?.projects ?? [])
  }
}
