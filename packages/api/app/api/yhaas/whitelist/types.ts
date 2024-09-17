import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema } from '@kalani/lib/types'

export const ApplicationSchema = z.object({
  chainId: z.number(),
  manager: EvmAddressSchema,
  targets: z.object({
    address: EvmAddressSchema,
    name: z.string(),
    targetType: z.string()
  }).array(),
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
