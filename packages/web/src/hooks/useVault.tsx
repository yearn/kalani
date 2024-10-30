import { z } from 'zod'
import { AccountRoleSchema, EvmAddressSchema, HexStringSchema, EvmAddress } from '@kalani/lib/types'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useParams } from 'react-router-dom'
import { nullsToUndefined } from '../lib/object'
import { useFinderItems } from '../components/Finder/useFinderItems'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../lib/env'

const StrategySchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  yearn: z.boolean().nullish().transform(val => val ?? false),
  currentDebt: z.bigint({ coerce: true }),
  currentDebtUsd: z.number(),
  targetDebtRatio: z.number(),
  lastReportDetail: z.object({
    blockTime: z.bigint({ coerce: true }),
    transactionHash: HexStringSchema
  }).optional(),
  keeper: EvmAddressSchema.optional()
})

export type Strategy = z.infer<typeof StrategySchema>

export const VaultReportSchema = z.object({
  chainId: z.number(),
  strategy: EvmAddressSchema,
  blockNumber: z.bigint({ coerce: true }),
  blockTime: z.bigint({ coerce: true }),
  transactionHash: HexStringSchema,
  profit: z.bigint({ coerce: true }),
  profitUsd: z.number().optional(),
  loss: z.bigint({ coerce: true }),
  lossUsd: z.number().optional(),
  apr: z.object({ gross: z.number(), net: z.number() })
})

export type VaultReport = z.infer<typeof VaultReportSchema>

export const VaultSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  label: z.enum(['vault', 'strategy', 'erc4626']),
  name: z.string(),
  apiVersion: z.string().optional(),
  asset: z.object({
    address: EvmAddressSchema,
    symbol: z.string(),
    name: z.string(),
    decimals: z.number()  
  }),
  accountant: EvmAddressSchema.optional(),
  roleManager: EvmAddressSchema.optional(),
  inceptBlock: z.bigint({ coerce: true }),
  inceptTime: z.number({ coerce: true }),
  deposit_limit: z.bigint({ coerce: true }).optional(),
  deposit_limit_module: EvmAddressSchema.optional(),
  pricePerShare: z.bigint({ coerce: true }).optional(),
  lastProfitUpdate: z.number({ coerce: true }).optional(),
  totalAssets: z.bigint({ coerce: true }),
  totalDebt: z.bigint({ coerce: true }).optional(),
  fees: z.object({ performanceFee: z.number({ coerce: true }) }).optional(),
  tvl: z.object({ close: z.number().default(0) }).optional(),
  apy: z.object({ close: z.number().default(0) }).optional(),
  strategies: StrategySchema.array(),
  accounts: AccountRoleSchema.array(),
  reports: VaultReportSchema.array()
})

export type Vault = z.infer<typeof VaultSchema>

const QUERY = `
query Query($chainId: Int, $address: String) {
  vault(chainId: $chainId, address: $address) {
    chainId
    address
    apiVersion
    name
    asset {
      address
      name
      symbol
      decimals
    }
    accountant
    roleManager: role_manager
    inceptBlock
    inceptTime
    depositLimit
    deposit_limit
    deposit_limit_module
    pricePerShare
    lastProfitUpdate
    totalAssets
    totalDebt

    debts {
			strategy
			currentDebt
			currentDebtUsd
			targetDebtRatio
		}

    fees {
      performanceFee
    }
    tvl {
      close
    }
    apy {
      close: net
    }
  }

  vaultStrategies(chainId: $chainId, vault: $address) {
    chainId,
    address,
    name,
    keeper,
    yearn,
    lastReportDetail {
      blockTime,
      transactionHash
    }
  }

  accounts: vaultAccounts(chainId: $chainId, vault: $address) {
    chainId,
    vault: address
    address: account
    roleMask
  }

  reports: vaultReports(chainId: $chainId, address: $address) {
    chainId
    strategy
    blockNumber
    blockTime
    transactionHash
    profit: gain
    profitUsd: gainUsd
    loss
    lossUsd
    apr {
      gross
      net
    }
  }
}
`

export function useVaultParams() {
  const params = useParams()
  const chainId = Number(params.chainId)
  const address = EvmAddressSchema.parse(params.address)
  return { chainId, address }
}

async function fetchVault({ chainId, address }: { chainId: number, address: EvmAddress }) {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: QUERY,
      variables: { chainId, address }
    }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

function useVaultQuery({ chainId, address }: { chainId: number, address: EvmAddress }) {
  return useSuspenseQuery({
    queryKey: ['vault', chainId, address],
    queryFn: () => fetchVault({ chainId, address })
  })
}

export function useVault({ chainId, address }: { chainId: number, address: EvmAddress }) {
  const { data } = useVaultQuery({ chainId, address })
  const { data: finderItems } = useFinderItems()

  if (!data) return undefined

  const vault = data.data.vault
  const strategies = data.data.vaultStrategies.map((strategy: any) => {
    const debt = vault.debts.find((debt: any) => debt.strategy === strategy.address)
    return {
      ...strategy,
      currentDebt: debt?.currentDebt ?? 0n,
      currentDebtUsd: debt?.currentDebtUsd ?? 0,
      targetDebtRatio: debt?.targetDebtRatio ?? 0
    }
  })

  const item = finderItems?.find(item => item.chainId === vault.chainId && compareEvmAddresses(item.address, vault.address))

  return VaultSchema.parse(nullsToUndefined({
    label: item?.label ?? 'vault',
    ...vault,
    strategies,
    accounts: data.data.accounts,
    reports: data.data.reports
  }))
}

export function useVaultFromParams() {
  const params = useVaultParams()
  return useVault(params)
}

export function withVault(WrappedComponent: React.ComponentType<{ vault: Vault }>) {
  return function ComponentWithVault(props: any) {
    const vault = useVaultFromParams()
    if (!vault) return <></>
    return <WrappedComponent vault={vault} {...props} />
  }
}
