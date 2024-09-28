import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../../lib/env'

export const ExplorerItemSchema = z.object({
  label: z.enum(["vault", "strategy", "erc4626", "accountant"]),
  chainId: z.number(),
  address: z.string(),
  name: z.string().optional(),
  nameLower: z.string().optional(),
  yearn: z.boolean().nullish(),
  strategies: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.array(z.string()).optional()
  ),
  token: z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string()
  }).optional(),
  tvl: z.number().nullish(),
  apy: z.number().nullish(),
  sparklines: z.object({
    tvl: z.array(z.number()),
    apy: z.array(z.number())
  }).optional(),
  addressIndex: z.string()
})

export type ExplorerItem = z.infer<typeof ExplorerItemSchema>

const QUERY = `
query Query {
  accountants {
    chainId
    address
    vaults
  }
  vaults(erc4626: true) {
    chainId
    address
    name
    strategies
    yearn
    erc4626
    apiVersion
    asset {
      address
      name
      symbol
      decimals
    }
    tvl {
      close
    }
    apy {
      net
    }
    sparklines {
      tvl { close }
      apy { close }
    }
  }
  strategies(erc4626: true) {
    chainId
    address
  }
}
`

function toExplorerItems(data: any): ExplorerItem[] {
  let results: ExplorerItem[] = []

  // Create a set of strategy addresses for quick lookup
  const strategyAddresses = new Set(data.strategies.map((s: any) => s.address.toLowerCase()))

  // Process vaults
  data.vaults.forEach((vault: any) => {
    const item: ExplorerItem = {
      label: vault.yearn 
      ? strategyAddresses.has(vault.address.toLowerCase()) ? 'strategy' : 'vault'
      : 'erc4626',
      chainId: parseInt(vault.chainId),
      address: vault.address,
      name: vault.name,
      nameLower: vault.name.toLowerCase(),
      strategies: vault.strategies,
      yearn: vault.yearn,
      token: {
        address: vault.asset.address,
        name: vault.asset.name,
        symbol: vault.asset.symbol
      },
      tvl: vault.tvl?.close,
      apy: vault.apy?.net,
      sparklines: {
        tvl: vault.sparklines?.tvl?.map((s: any) => s.close) ?? [],
        apy: vault.sparklines?.apy?.map((s: any) => s.close) ?? []
      },
      addressIndex: [vault.address, ...(vault.strategies ?? []), vault.asset.address].join(' ').toLowerCase()
    }
    results.push(item)

    // Process strategies associated with this vault
    vault.strategies?.forEach((strategyAddress: string) => {
      if (strategyAddresses.has(strategyAddress.toLowerCase())) {
        const strategyItem: ExplorerItem = {
          label: 'strategy',
          chainId: parseInt(vault.chainId),
          address: strategyAddress,
          name: `${vault.name} Strategy`,
          nameLower: `${vault.name} Strategy`.toLowerCase(),
          token: {
            address: vault.asset.address,
            name: vault.asset.name,
            symbol: vault.asset.symbol
          },
          addressIndex: `${strategyAddress} ${vault.asset.address}`.toLowerCase()
        }
        results.push(strategyItem)
      }
    })
  })

  // Process accountants
  data.accountants.forEach((accountant: any) => {
    const item: ExplorerItem = {
      label: 'accountant',
      chainId: parseInt(accountant.chainId),
      address: accountant.address,
      addressIndex: accountant.address.toLowerCase()
    }
    results.push(item)
  })

  results = ExplorerItemSchema.array().parse(results)
  results.sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
  return results
}

async function fetchExplorerItems(): Promise<ExplorerItem[]> {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  })

  if (!response.ok) { throw new Error(`HTTP error, status ${response.status}`) }

  const json = await response.json()
  return toExplorerItems(json.data)
}

export function useExplorerItems() {
  return useSuspenseQuery({
    queryKey: ['useExplorerItems'],
    queryFn: fetchExplorerItems,
  })
}
