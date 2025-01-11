import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../../lib/env'
import { EvmAddressSchema } from '@kalani/lib/types'
import { useCallback, useMemo } from 'react'
import { compareEvmAddresses, isNothing } from '@kalani/lib/strings'
import { useFinderOptions } from './useFinderOptions'
import { useLocalVaults } from '../../hooks/useVault'

export const FinderItemSchema = z.object({
  label: z.enum(['yVault', 'yStrategy', 'v3', 'erc4626', 'accountant']),
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string().optional(),
  nameLower: z.string().optional(),
  symbol: z.string().optional(),
  yearn: z.boolean().nullish(),
  v3: z.boolean().nullish(),
  projectId: z.string().nullish(),
  projectName: z.string().nullish(),
  roleManager: EvmAddressSchema.nullish(),
  strategies: z.preprocess(
    (val) => (val === null ? undefined : val),
    z.array(EvmAddressSchema).optional()
  ),
  token: z.object({
    address: EvmAddressSchema,
    name: z.string(),
    symbol: z.string(),
    decimals: z.number({ coerce: true })
  }).optional(),
  tvl: z.number().nullish(),
  apy: z.number().nullish(),
  sparklines: z.object({
    tvl: z.array(z.number()),
    apy: z.array(z.number())
  }).optional(),
  addressIndex: z.string()
})

export type FinderItem = z.infer<typeof FinderItemSchema>

const QUERY = `
query Query {
  vaults(erc4626: true) {
    chainId
    address
    name
    symbol
    strategies
    yearn
    erc4626
    v3
    apiVersion
    projectId
    projectName
    roleManager: role_manager
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

function vaultToFinderItem(vault: any, label: 'yVault' | 'yStrategy' | 'v3' | 'erc4626' | 'accountant'): FinderItem {
  return {
    label,
    chainId: parseInt(vault.chainId),
    address: vault.address,
    name: vault.name,
    nameLower: vault.name.toLowerCase(),
    symbol: vault.symbol,
    strategies: vault.strategies,
    yearn: vault.yearn,
    v3: vault.v3,
    projectId: vault.projectId,
    projectName: vault.projectName,
    roleManager: vault.roleManager,
    token: {
      address: vault.asset.address,
      name: vault.asset.name,
      symbol: vault.asset.symbol,
      decimals: vault.asset.decimals
    },
    tvl: vault.tvl?.close,
    apy: vault.apy?.net,
    sparklines: {
      tvl: vault.sparklines?.tvl?.map((s: any) => s.close) ?? [],
      apy: vault.sparklines?.apy?.map((s: any) => s.close) ?? []
    },
    addressIndex: [vault.address, ...(vault.strategies ?? []), vault.asset.address].join(' ').toLowerCase()
  }
}

function toFinderItems(data: any): FinderItem[] {
  let results: FinderItem[] = []

  // Create a set of strategy addresses for quick lookup
  const strategyAddresses = new Set(data.strategies.map((s: any) => s.address.toLowerCase()))

  // Process vaults
  data.vaults.forEach((vault: any) => {
    const label = vault.yearn 
    ? strategyAddresses.has(vault.address.toLowerCase()) ? 'yStrategy' : 'yVault'
    : vault.v3 ? 'v3' : 'erc4626'
    const item: FinderItem = vaultToFinderItem(vault, label)
    results.push(item)
  })

  results = FinderItemSchema.array().parse(results)
  results.sort((a, b) => (b.tvl ?? 0) - (a.tvl ?? 0))
  return results
}

async function fetchFinderItems(): Promise<FinderItem[]> {
  const response = await fetch(KONG_GQL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY }),
  })

  if (!response.ok) { throw new Error(`HTTP error, status ${response.status}`) }

  const json = await response.json()
  return toFinderItems(json.data)
}

export function useFinderItems() {
  const { query: q, sortKey, sortDirection } = useFinderOptions()

  const query = useSuspenseQuery({
    queryKey: ['useFinderItems'],
    queryFn: fetchFinderItems,
    staleTime: 1000 * 60 * 5
  })

  const sort = useCallback((items: FinderItem[]) => {
    const result = [...items]
    if (sortKey === 'tvl' && sortDirection === 'asc') {
      result.sort((a, b) => (a.tvl ?? 0) - (b.tvl ?? 0))
    } else if (sortKey === 'apy') {
      result.sort((a, b) => (sortDirection === 'desc' ? 1 : -1) * ((b.apy ?? 0) - (a.apy ?? 0)))
    }
    return result
  }, [sortKey, sortDirection])

  const { localVaults } = useLocalVaults()

  const items = useMemo(() => {
    return [
      ...query.data, 
      ...localVaults.map(vault => vaultToFinderItem(vault, 'v3'))
    ]
  }, [query.data, localVaults])

  const filter = useMemo(() => {
    if (isNothing(q)) { return sort(items) }

    const lowerq = q.toLowerCase()
    const result = items.filter((item: FinderItem) => {
      return item.nameLower?.includes(lowerq)
        || (lowerq.length > 6 && item.addressIndex.toLowerCase().includes(lowerq))
    })
    return sort(result)
  }, [items, localVaults, q, sort])

  return { 
    ...query, 
    items: items ?? [], 
    filter: filter ?? [] 
  }
}

function labelToView(label: 'yVault' | 'yStrategy' | 'v3' | 'erc4626' | 'accountant') {
  switch (label) {
    case 'yVault': return 'vault'
    case 'yStrategy': return 'strategy'
    case 'v3': return 'vault'
    case 'erc4626': return 'erc4626'
    default: return label
  }
}

export function getItemHref(item: FinderItem) {
  return `/${labelToView(item.label)}/${item.chainId}/${item.address}`
}

export function useFinderUtils() {
  const { items } = useFinderItems()

  const findFinderItem = useCallback((options: { chainId: number, address: `0x${string}` }) => {
    return items.find(item => compareEvmAddresses(item.address, options.address))
  }, [items])

  const getHrefFor = useCallback((options: { chainId: number, address: `0x${string}` }) => {
    const item = findFinderItem(options)
    if (item) return getItemHref(item)
    return `/erc4626/${options.chainId}/${options.address}`
  }, [findFinderItem])

  return { findFinderItem, getHrefFor }
}
