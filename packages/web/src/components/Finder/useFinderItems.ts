import { z } from 'zod'
import { useQuery } from '@tanstack/react-query'

const KONG_GQL_URL = import.meta.env.VITE_KONG_GQL
if (!KONG_GQL_URL) throw new Error('🤬 VITE_KONG_GQL environment variable is not set')

export const FinderItemSchema = z.object({
  label: z.enum(["vault", "strategy", "erc4626", "accountant"]),
  chainId: z.number(),
  address: z.string(),
  name: z.string().optional(),
  nameLower: z.string().optional(),
  strategies: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.array(z.string()).optional()
  ),
  token: z.object({
    address: z.string(),
    name: z.string(),
    symbol: z.string()
  }).optional(),
  tvl: z.number().optional(),
  addressIndex: z.string()
})

export type FinderItem = z.infer<typeof FinderItemSchema>

const QUERY = `
query Query {
  accountants {
    chainId
    address
    vaults
  }
  vaults(apiVersion: "3") {
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
  }
  strategies(apiVersion: "3") {
    chainId
    address
  }
}
`

function toFinderItems(data: any): FinderItem[] {
  const items: FinderItem[] = []

  // Create a set of strategy addresses for quick lookup
  const strategyAddresses = new Set(data.strategies.map((s: any) => s.address.toLowerCase()))

  // Process vaults
  data.vaults.forEach((vault: any) => {
    const item: FinderItem = {
      label: vault.yearn 
      ? strategyAddresses.has(vault.address.toLowerCase()) ? 'strategy' : 'vault'
      : 'erc4626',
      chainId: parseInt(vault.chainId),
      address: vault.address,
      name: vault.name,
      nameLower: vault.name.toLowerCase(),
      strategies: vault.strategies,
      token: {
        address: vault.asset.address,
        name: vault.asset.name,
        symbol: vault.asset.symbol
      },
      tvl: vault.tvl?.close,
      addressIndex: [vault.address, ...(vault.strategies ?? []), vault.asset.address].join(' ').toLowerCase()
    }
    items.push(item)

    // Process strategies associated with this vault
    vault.strategies?.forEach((strategyAddress: string) => {
      if (strategyAddresses.has(strategyAddress.toLowerCase())) {
        const strategyItem: FinderItem = {
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
        items.push(strategyItem)
      }
    })
  })

  // Process accountants
  data.accountants.forEach((accountant: any) => {
    const item: FinderItem = {
      label: 'accountant',
      chainId: parseInt(accountant.chainId),
      address: accountant.address,
      addressIndex: accountant.address.toLowerCase()
    }
    items.push(item)
  })

  const result = FinderItemSchema.array().parse(items)
  result.sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
  return result
}

async function fetchFinderItems(): Promise<FinderItem[]> {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: QUERY }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()
  return toFinderItems(result.data)
}

export function useFinderItems() {
  return useQuery({
    queryKey: ['finderItems'],
    queryFn: fetchFinderItems,
  })
}
