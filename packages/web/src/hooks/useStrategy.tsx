import { z } from 'zod'
import { EvmAddressSchema, HexStringSchema, EvmAddress } from '@kalani/lib/types'
import { useParams } from 'react-router-dom'
import { nullsToUndefined } from '../lib/object'
import { useSuspenseQuery } from '@tanstack/react-query'
import { KONG_GQL_URL } from '../lib/env'

const StrategySchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  name: z.string(),
  symbol: z.string(),
  apiVersion: z.string().optional(),
  inceptBlock: z.bigint({ coerce: true }),
  inceptTime: z.number({ coerce: true }),
  keeper: EvmAddressSchema.optional(),
  management: EvmAddressSchema.optional(),
  healthCheck: EvmAddressSchema.optional(),
  totalAssets: z.bigint({ coerce: true }),
  asset: z.object({
    address: EvmAddressSchema,
    symbol: z.string(),
    name: z.string(),
    decimals: z.number()  
  }),
  pricePerShare: z.bigint({ coerce: true }).optional(),
  depositLimit: z.bigint({ coerce: true }).optional(),
  lastReportDetail: z.object({
    blockTime: z.bigint({ coerce: true }),
    transactionHash: HexStringSchema
  }).optional(),
  tvl: z.object({ close: z.number() }),
  apy: z.object({ close: z.number() }).optional(),
  fees: z.object({ performanceFee: z.number({ coerce: true }) }).optional()
})

export type Strategy = z.infer<typeof StrategySchema>

const QUERY = `
query Query($chainId: Int, $address: String) {
  vault(chainId: $chainId, address: $address) {
    chainId
    address
    name
    symbol
    apiVersion
    inceptBlock
    inceptTime
    totalAssets
    pricePerShare
    depositLimit: deposit_limit
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
      close: net
    }
    fees {
      performanceFee
    }
  }

  strategy(chainId: $chainId, address: $address) {
    keeper
    management
    healthCheck
    lastReportDetail {
      blockTime
      transactionHash
    }
  }
}
`

export function useStrategyParams() {
  const params = useParams()
  const chainId = Number(params.chainId)
  const address = EvmAddressSchema.parse(params.address)
  return { chainId, address }
}

async function fetchStrategy({ chainId, address }: { chainId: number, address: `0x${string}` }) {
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

export function useStrategy({ chainId, address }: { chainId: number, address: EvmAddress }) {
  const query = useSuspenseQuery({
    queryKey: ['vault', chainId, address],
    queryFn: () => fetchStrategy({ chainId, address })
  })

  const strategy = StrategySchema.parse(nullsToUndefined({
    ...query.data.data.vault,
    ...query.data.data.strategy
  }))

  return { ...query, strategy }
}

export function useStrategyFromParams() {
  const params = useStrategyParams()
  return useStrategy(params)
}

export function withStrategy(WrappedComponent: React.ComponentType<{ strategy: Strategy }>) {
  return function ComponentWithStrategy(props: any) {
    const strategy = useStrategyFromParams()
    if (!strategy) return <></>
    return <WrappedComponent strategy={strategy} {...props} />
  }
}
