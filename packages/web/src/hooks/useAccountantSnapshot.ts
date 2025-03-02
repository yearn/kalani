import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { useAccount, useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'
import { z } from 'zod'
import { zeroAddress } from 'viem'
import { useVaultFromParams } from './useVault/withVault'

export const AccountantSchema = z.object({
  chainId: z.number(),
  address: EvmAddressSchema,
  feeManager: EvmAddressSchema,
  feeRecipient: EvmAddressSchema,
  futureFeeManager: EvmAddressSchema,
  feeConfig: z.object({
    managementFee: z.number({ coerce: true }),
    performanceFee: z.number({ coerce: true })
  })
})

export type Accountant = z.infer<typeof AccountantSchema>

export function useAccountantForVaultFromParams() {
  const { vault } = useVaultFromParams()
  return useAccountantSnapshot({
    chainId: vault?.chainId, address: vault?.accountant ?? zeroAddress,
    vault: vault?.address ?? zeroAddress
  })
}

export function useAccountantSnapshot(options: { chainId?: number, address: EvmAddress, vault: EvmAddress, [key: string]: any }) {
  const { chainId: accountChainId } = useAccount()
  const config = useConfig()
  const { chainId: _chainId, address, vault, ...rest } = options
  const chainId = useMemo(() => _chainId ?? accountChainId, [_chainId, accountChainId])

  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts: [{
      chainId, address, abi: abis.accountant,
      functionName: 'feeManager'
    }, {
      chainId, address, abi: abis.accountant,
      functionName: 'feeRecipient'
    }, {
      chainId, address, abi: abis.accountant,
      functionName: 'futureFeeManager'
    }, {
      chainId, address, abi: abis.accountant,
      functionName: 'getVaultConfig', args: [vault]
    }]})
  )

  const object = useMemo(() => {
    const result = {
      chainId, address,
      feeManager: query.data?.[0].result ?? zeroAddress,
      feeRecipient: query.data?.[1].result ?? zeroAddress,
      futureFeeManager: query.data?.[2].result ?? zeroAddress,
      feeConfig: {
        managementFee: query.data?.[3].result?.[0] ?? 0n,
        performanceFee: query.data?.[3].result?.[1] ?? 0n
      }
    }
    Object.assign(result, rest)
    return result
  }, [query.data, rest, address, chainId])

  const parsed = AccountantSchema.safeParse(object)

  if (!parsed.success) { throw parsed.error }

  return { ...query, snapshot: parsed.data }
}
