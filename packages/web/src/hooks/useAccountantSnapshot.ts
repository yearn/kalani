import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useAccount, useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'
import { z } from 'zod'

export const AccountantSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  defaultConfig: z.object({
    managementFee: z.number({ coerce: true }),
    performanceFee: z.number({ coerce: true })
  })
})

export type Accountant = z.infer<typeof AccountantSchema>

export function useAccountantSnapshot(options: { chainId?: number, address: EvmAddress, [key: string]: any }) {
  const { chainId: accountChainId } = useAccount()
  const config = useConfig()
  const { chainId: _chainId, address, ...rest } = options
  const chainId = useMemo(() => _chainId ?? accountChainId, [_chainId, accountChainId])

  const query = useSuspenseQuery(
    readContractQueryOptions(config, { 
      chainId, address, abi: abis.accountant, 
      functionName: 'defaultConfig', args: []
    })
  )

  const object = useMemo(() => {
    const result = {
      chainId, address,
      defaultConfig: {
        managementFee: query.data?.[0] ?? 0n,
        performanceFee: query.data?.[1] ?? 0n
      }
    }
    Object.assign(result, rest)
    return result
  }, [query.data, rest])

  const parsed = AccountantSchema.safeParse(object)

  if (!parsed.success) { throw parsed.error }

  return { ...query, snapshot: parsed.data }
}
