import { EvmAddress } from '@kalani/lib/types'
import { useAccount, useConfig } from 'wagmi'
import { readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import abis from '@kalani/lib/abis'
import { VaultSchema } from './useVault'

function parseFields(abi: any) {
  return abi.filter((x: any) => x.type === 'function' && (x.stateMutability === 'view' || x.stateMutability === 'pure') && x.inputs.length === 0)
}

export function useVaultSnapshot(options: { chainId?: number, address: EvmAddress, [key: string]: any }) {
  const config = useConfig()
  const { chainId: optionalChainId, address, ...rest } = options
  const { chainId: accountChainId } = useAccount()
  const chainId = useMemo(() => optionalChainId ?? accountChainId ?? 1, [optionalChainId, accountChainId])

  const fields = parseFields(abis.vault)
  const contracts = fields.map(({ name: functionName }: { name: string }) => ({ chainId, address, abi: abis.vault, functionName }))
  const query = useSuspenseQuery(
    readContractsQueryOptions(config, { contracts })
  )

  const object = useMemo(() => {
    const result = {
      chainId, address, label: 'v3',
      strategies: [],
      accounts: [],
      reports: [],
      debts: [],
      inceptBlock: 0n, inceptTime: 0
    } as any

    fields.forEach(({ name }: { name: string }, index: number) => {
      result[name] = query.data?.[index]?.result
    })

    result.asset = {
      address: result.asset,
      name: '',
      symbol: '',
      decimals: result.decimals
    }

    Object.assign(result, rest)
    return result

  }, [chainId, address, query.data])

  const parsed = useMemo(() => {
    return VaultSchema.safeParse({ ...object, roleManager: object.role_manager })
  }, [object, contracts, fields])

  if (!parsed.success) { throw parsed.error }

  return { ...query, snapshot: parsed.data }
}
