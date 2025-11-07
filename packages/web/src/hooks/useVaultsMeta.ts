import { z } from 'zod'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { EvmAddressSchema } from '@kalani/lib/types'
import { chains } from '../lib/chains'
import { CDN_URL } from '../lib/env'

export const VaultMetadataSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  registry: EvmAddressSchema.optional(),
  type: z.enum(['Yearn Vault', 'Experimental Yearn Vault', 'Automated Yearn Vault', 'Single Strategy', 'None']),
  kind: z.enum(['Multi Strategy', 'Legacy', 'Single Strategy', 'None']),
  isRetired: z.boolean(),
  isHidden: z.boolean(),
  isAggregator: z.boolean(),
  isBoosted: z.boolean(),
  isAutomated: z.boolean(),
  isHighlighted: z.boolean(),
  isPool: z.boolean(),
  shouldUseV2APR: z.boolean(),
  migration: z.object({
    available: z.boolean(),
    target: EvmAddressSchema.optional(),
    contract: EvmAddressSchema.optional(),
  }),
  stability: z.object({
    stability: z.enum(['Unknown', 'Correlated', 'Stable', 'Volatile', 'Unstable']),
    stableBaseAsset: z.string().optional(),
  }),
  category: z.string().optional(),
  displayName: z.string().optional(),
  displaySymbol: z.string().optional(),
  description: z.string().optional(),
  sourceURI: z.string().optional(),
  uiNotice: z.string().optional(),
  protocols: z.array(z.enum(['Curve', 'BeethovenX', 'Gamma', 'Balancer', 'Yearn'])),
  inclusion: z.object({
    isSet: z.boolean(),
    isYearn: z.boolean(),
    isYearnJuiced: z.boolean(),
    isGimme: z.boolean(),
    isPoolTogether: z.boolean(),
    isCove: z.boolean(),
    isMorpho: z.boolean(),
    isKatana: z.boolean(),
    isPublicERC4626: z.boolean(),
  }),
})

export type VaultMetadata = z.infer<typeof VaultMetadataSchema>

export function useVaultsMeta() {
  const query = useSuspenseQuery({
    queryKey: ['vaults-meta'],
    queryFn: async () => {
      const promises = chains.map((chain) =>
        fetch(`${CDN_URL}vaults/${chain.id}.json`)
          .then(response => ({ response, chainId: chain.id }))
          .catch(() => ({ response: null, chainId: chain.id }))
      )
      const results = await Promise.all(promises)

      const jsonPromises = results
        .filter(({ response }) => response?.ok)
        .map(({ response, chainId }) =>
          response!.json().then(json => ({ json, chainId }))
        )
      const jsonResults = await Promise.all(jsonPromises)

      const rawJsonChainMap: Record<string, any> = {}
      const allVaults: any[] = []

      jsonResults.forEach(({ json, chainId }) => {
        rawJsonChainMap[chainId] = json
        allVaults.push(...json)
      })

      return { flat: allVaults, rawJsonChainMap }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  })

  const vaults = useMemo(() => {
    return query.data.flat.map((d: any) => VaultMetadataSchema.parse(d))
  }, [query.data.flat])

  const sortedVaults = useMemo(() => {
    return vaults.sort((a, b) => {
      if (a.chainId < b.chainId) return -1
      if (a.chainId > b.chainId) return 1
      if (a.name < b.name) return -1
      if (a.name > b.name) return 1
      return 0
    })
  }, [vaults])

  // Create a lookup map for O(1) access
  const vaultsMetaMap = useMemo(() => {
    const map = new Map()
    vaults.forEach(meta => {
      const key = `${meta.chainId}-${meta.address.toLowerCase()}`
      map.set(key, meta)
    })
    return map
  }, [vaults])

  return {
    ...query,
    vaults: sortedVaults,
    vaultsMetaMap,
    rawJsonChainMap: query.data.rawJsonChainMap,
  }
}
