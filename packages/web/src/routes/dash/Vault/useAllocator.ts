import { useConfig } from 'wagmi'
import { readContractQueryOptions, readContractsQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { parseAbi, zeroAddress } from 'viem'
import abis from '@kalani/lib/abis'
import { useVaultFromParams } from '../../../hooks/useVault'

export function useAllocator() {
  const { vault } = useVaultFromParams()
  const roleManager = useMemo(() => vault?.roleManager ?? zeroAddress, [vault])
  const config = useConfig()

  const query = useSuspenseQuery({
    ...readContractQueryOptions(config, {
      chainId: vault?.chainId,
      address: roleManager,
      abi: abis.roleManager,
      functionName: 'getDebtAllocator'
    })
  })

  return { ...query, allocator: vault?.allocator ?? query.data }
}

export function useMinimumChange() {
  const { allocator } = useAllocator()
  const { vault } = useVaultFromParams()
  const config = useConfig()
  const query = useSuspenseQuery({
    ...readContractsQueryOptions(config, { contracts: [{
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function minimumChange() public view returns (uint128)']),
      functionName: 'minimumChange',
    }, {
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function getVaultConfig(address) public view returns (bool, uint128, uint16)']),
      functionName: 'getVaultConfig',
      args: [vault?.address ?? zeroAddress]
    }]})
  })

  const minimumChange = useMemo(() => {
    if (query.data[0].status === 'success') { return query.data[0].result }
    if (query.data[1].status === 'success') { return query.data[1].result[1] }
    return 0
  }, [query])

  return { ...query, minimumChange }
}

export function useTotalDebtRatio() {
  const { allocator } = useAllocator()
  const { vault } = useVaultFromParams()
  const config = useConfig()

  const query = useSuspenseQuery({
    ...readContractsQueryOptions(config, { contracts: [{
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function totalDebtRatio() public view returns (uint16)']),
      functionName: 'totalDebtRatio',
    }, {
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function getVaultConfig(address) public view returns (bool, uint128, uint16)']),
      functionName: 'getVaultConfig',
      args: [vault?.address ?? zeroAddress]
    }]})
  })

  const totalDebtRatio = useMemo(() => {
    if (query.data[0].status === 'success') { return BigInt(query.data[0].result) }
    if (query.data[1].status === 'success') { return BigInt(query.data[1].result[2]) }
    return 0n
  }, [query])

  return { ...query, totalDebtRatio }
}

export function useVaultConfig() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  const config = useConfig()
  const query = useSuspenseQuery({
    ...readContractQueryOptions(config, {
      chainId: vault?.chainId,
      address: allocator,
      abi: parseAbi(['function getVaultConfig(address) public view returns (bool, uint128, uint16)']),
      functionName: 'getVaultConfig',
      args: [vault?.address ?? zeroAddress]
    })
  })

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
