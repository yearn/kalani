import { z } from 'zod'

export const StrategySchema = z.object({
  chainId: z.number(),
  strategistAddress: z.string(),
  strategyAddresses: z.array(z.string()),
  strategyName: z.string(),
  strategyCodeUrl: z.string(),
  harvestFrequency: z.string(),
  githubIssueUrl: z.string(),
  githubIssueHtmlUrl: z.string(),
  githubIssueLabels: z.array(z.string()),
  githubIssueState: z.string(),
  createTime: z.date({ coerce: true }),
  updateTime: z.date({ coerce: true }),
})

export type Strategy = z.infer<typeof StrategySchema>
