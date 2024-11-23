import abis from '@kalani/lib/abis'
import { containsRole, EvmAddress } from '@kalani/lib/types'
import { zeroAddress } from 'viem'
import { useAccount, useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'

export function useHasRoles(args: { chainId: number, vault: EvmAddress, roleMask: bigint }) {
  const { chainId, vault, roleMask } = args
  const config = useConfig()
  const { address } = useAccount()

  const options = readContractQueryOptions(config, {
    chainId, abi: abis.vault, address: vault, functionName: 'roles', args: [address ?? zeroAddress]
  })

  const { data: userRoleMask } = useSuspenseQuery({ ...options, staleTime: 30_000 })

  return containsRole(userRoleMask, roleMask)
}
