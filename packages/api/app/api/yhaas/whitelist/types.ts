import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema } from '@/lib/types'

export const ApplicationSchema = z.object({
  title: z.string(),
  chainId: z.number(),
  manager: EvmAddressSchema,
  target: EvmAddressSchema,
  targetType: z.string(),
  name: z.string(),
  frequency: z.number(),
  repo: z.string(),
  signature: HexStringSchema
})

export type Application = z.infer<typeof ApplicationSchema>

export const GithubIssueSchema = z.object({
  number: z.number(),
  title: z.string(),
  body: z.string(),
  state: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  closed_at: z.string(),
})

export type GithubIssue = z.infer<typeof GithubIssueSchema>
