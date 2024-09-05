import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAccount } from 'wagmi'
import { fEvmAddress } from '../../../lib/format'
import { zeroAddress } from 'viem'

const API = import.meta.env.VITE_API ?? 'http://localhost:3001'

export const GithubIssueSchema = z.object({
  url: z.string(),
  html_url: z.string(),
  labels: z.array(z.string()),
  state: z.string(),
  title: z.string(),
  number: z.number(),
})

export type GithubIssue = z.infer<typeof GithubIssueSchema>

export function useYHaaSIssues() {
  const { address } = useAccount()
  const formattedAddress = fEvmAddress(address ?? zeroAddress)

  const query = useSuspenseQuery({
    queryKey: ['yhaas-issues'],
    queryFn: () => fetch(`${API}/api/yhaas/issues`).then(r => r.json())
  })

  const issues = GithubIssueSchema.array().parse(query.data)
  const accountsIssues = issues?.filter((issue: any) => issue.title.endsWith(`[${formattedAddress}]`))
  return { ...query, accountsIssues }
}
