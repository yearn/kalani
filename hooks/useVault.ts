import { z } from 'zod'
import useSWR from 'swr'
import { EvmAddressSchema } from '@/lib/types'

const StrategySchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  currentDebt: z.bigint({ coerce: true }),
  currentDebtUsd: z.number(),
  targetDebtRatio: z.number()
})

export const VaultSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  apiVersion: z.string(),
  asset: z.object({
    address: EvmAddressSchema,
    symbol: z.string(),
    name: z.string(),
    decimals: z.number()  
  }),
  accountant: EvmAddressSchema,
  inceptBlock: z.bigint({ coerce: true }),
  inceptTime: z.number({ coerce: true }),
  deposit_limit: z.bigint({ coerce: true }),
  deposit_limit_module: EvmAddressSchema,
  pricePerShare: z.bigint({ coerce: true }),
  lastProfitUpdate: z.number({ coerce: true }),
  totalAssets: z.bigint({ coerce: true }),
  totalDebt: z.bigint({ coerce: true }),
  fees: z.object({ performanceFee: z.number({ coerce: true }) }),
  tvl: z.object({ close: z.number() }),
  apy: z.object({ close: z.number() }),
  strategies: StrategySchema.array()
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
    name
  }
}
`

export function useVault(chainId: number, address: `0x${string}`) {
  const endpoint = process.env.NEXT_PUBLIC_KONG_GQL ?? 'http://localhost:3001/api/gql'

  const { data } = useSWR(
    `${endpoint}`, (...args) => fetch(...args, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        query: QUERY,
        variables: { chainId, address }
      })
    }).then(res => res.json()).catch(reason => {
      console.error(reason)
      return {}
    }),
    { refreshInterval: parseInt(process.env.NEXT_PUBLIC_USEVAULTS_REFRESH || '10_000') }
  )

  if (!(data?.data?.vault && data?.data?.vaultStrategies)) return undefined

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

  return VaultSchema.parse({ ...vault, strategies })
}
