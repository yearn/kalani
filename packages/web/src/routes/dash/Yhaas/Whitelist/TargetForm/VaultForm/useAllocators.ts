import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { fEvmAddress } from '@kalani/lib/format'
import { zeroAddress } from 'viem'
import { useMemo } from 'react'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export const GithubIssueSchema = z.object({
  url: z.string(),
  html_url: z.string(),
  labels: z.array(z.string()),
  state: z.string(),
  title: z.string(),
  number: z.number(),
})

export type GithubIssue = z.infer<typeof GithubIssueSchema>

export function useAllocators() {
  const { address } = useAccount()
  const formattedAddress = fEvmAddress(address ?? zeroAddress)

  const query = useSuspenseQuery({
    queryKey: ['yhaas-issues'],
    queryFn: () => fetch(`${API}/api/vault/allocators`).then(r => r.json())
  })

  const openIssues = useMemo(() => GithubIssueSchema.array().parse(query.data), [query])
  const forAccount = useMemo(() => openIssues?.filter((issue: any) => issue.title.endsWith(`[${formattedAddress}]`)), [openIssues])
  return { ...query, issues: forAccount }
}
