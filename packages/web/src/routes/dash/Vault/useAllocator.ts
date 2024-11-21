import { useConfig } from 'wagmi'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { parseAbi, zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import { useVaultFromParams } from '../../../hooks/useVault'

export function useAllocator() {
  const { vault } = useVaultFromParams()
  const roleManager = useMemo(() => vault?.roleManager ?? zeroAddress, [vault])

  const config = useConfig()
  const query = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId,
      address: roleManager,
      abi: abis.roleManager,
      functionName: 'getDebtAllocator'
    })
  )

  return { ...query, allocator: query.data }
}

export function useVaultConfig() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  const config = useConfig()
  const query = useSuspenseQuery(
    readContractQueryOptions(config, {
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function getVaultConfig(address) public view returns (bool, uint128, uint16)']),
      functionName: 'getVaultConfig',
      args: [vault?.address ?? zeroAddress]
    })
  )

  const [paused, minimumChange, totalDebtRatio] = query.data

  return { 
    ...query,
    vaultConfig: {
      paused,
      minimumChange,
      totalDebtRatio
    }
  }
}
