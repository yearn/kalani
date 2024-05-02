import { z } from 'zod'
import useSWR from 'swr'
import { EvmAddressSchema } from '@/lib/types'
import { useMemo } from 'react'

export enum Roles {
  ADD_STRATEGY_MANAGER = 1,
  REVOKE_STRATEGY_MANAGER = 2,
  FORCE_REVOKE_MANAGER = 4,
  ACCOUNTANT_MANAGER = 8,
  QUEUE_MANAGER = 16,
  REPORTING_MANAGER = 32,
  DEBT_MANAGER = 64,
  MAX_DEBT_MANAGER = 128,
  DEPOSIT_LIMIT_MANAGER = 256,
  WITHDRAW_LIMIT_MANAGER = 512,
  MINIMUM_IDLE_MANAGER = 1024,
  PROFIT_UNLOCK_MANAGER = 2048,
  DEBT_PURCHASER = 4096,
  EMERGENCY_MANAGER = 8192
}

function getRoles(roleMask: number): Record<string, boolean> {
  const roles: {
    [key: string]: boolean
  } = {}

  for (const role in Roles) {
    if (isNaN(Number(role))) {
      const roleValue = Roles[role as keyof typeof Roles]
      roles[role] = (roleMask & roleValue) === roleValue
    }
  }

  return roles
}

// function getRoles(roleMask: number): string[] {
//   const roles: string[] = []
//   for (const role in Roles) {
//     if (isNaN(Number(role))) {
//       const roleValue = Roles[role as keyof typeof Roles]
//       if ((roleMask & roleValue) === roleValue) {
//         roles.push(role)
//       }
//     }
//   }
//   return roles
// }

export const AccountRoleSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  account: z.string(),
  roleMask: z.number({ coerce: true })
})

export type AccountRole = z.infer<typeof AccountRoleSchema>

export const VaultSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  asset: z.object({
    address: EvmAddressSchema,
    symbol: z.string(),
    name: z.string(),
    decimals: z.number()  
  }),
  strategies: EvmAddressSchema.array().default([]),
  tvl: z.object({ close: z.number() }),
  apy: z.object({ close: z.number() }),
})

export type Vault = z.infer<typeof VaultSchema>

export const StrategySchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  apiVersion: z.string(),
  name: z.string(),
  lastReport: z.number({ coerce: true }),
  lastReportDetail: z.object({
    blockNumber: z.bigint({ coerce: true }),
    blockTime: z.string(),
    profit: z.bigint({ coerce: true }),
    profitUsd: z.number(),
    loss: z.bigint({ coerce: true }),
    lossUsd: z.number(),
    apr: z.object({
      gross: z.number(),
      net: z.number()
    })
  })
})

export type Strategy = z.infer<typeof StrategySchema>

export const UserVaultSchema = VaultSchema.extend({
  roleMask: z.number({ coerce: true }),
  roles: z.record(z.string(), z.boolean()),
  strategies: StrategySchema.array().default([])
})

export type UserVault = z.infer<typeof UserVaultSchema>

export const UserSchema = z.object({
  address: EvmAddressSchema,
  vaults: UserVaultSchema.array()
})

export type User = z.infer<typeof UserSchema>

const QUERY = `
query Query($account: String!, $chainId: Int) {
  accountRoles(account: $account, chainId: $chainId) {
    chainId
    address
    account
    roleMask
  }

  accountVaults(account: $account, chainId: $chainId) {
    chainId
    address
    name
    asset {
      address
      symbol
      name
      decimals
    }
    strategies
    tvl { close }
    apy { close }
  }

  accountStrategies(account: $account) {
    chainId
    address
    apiVersion
    name
    healthCheck
    lastReport
    lastReportDetail {
      blockNumber
      blockTime
      profit
      profitUsd
      loss
      lossUsd
      apr {
        gross
        net
      }
    }
  }
}
`

export function useVaults(account?: `0x${string}` | null) {
  if(!account) return undefined

  const endpoint = 'https://kong-two.vercel.app/api/gql' // process.env.NEXT_PUBLIC_KONG_GQL || 'http://localhost:3001/api/gql'

  const { data } = useSWR(
    `${endpoint}`, (...args) => fetch(...args, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { account }
      })
    }).then(res => res.json()).catch(reason => {
      console.error(reason)
      return {}
    }),
    { refreshInterval: parseInt(process.env.NEXT_PUBLIC_USEVAULTS_REFRESH || '10_000') }
  )

  const user: User = useMemo(() => {
    const roles = AccountRoleSchema.array().parse(data?.data?.accountRoles ?? [])
    const vaults = VaultSchema.array().parse(data?.data?.accountVaults ?? [])
    const strategies = StrategySchema.array().parse(data?.data?.accountStrategies ?? [])
    return UserSchema.parse({
      address: account,
      vaults: vaults.map(vault => ({ 
        ...vault, 
        roleMask: roles.find(role => role.address === vault.address)?.roleMask || 0,
        roles: getRoles(roles.find(role => role.address === vault.address)?.roleMask || 0),
        strategies: strategies.filter(strategy => vault.strategies.includes(strategy.address))
      }))
    })
  }, [data])

  return user
}
