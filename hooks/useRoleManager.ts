import abis from '@/lib/abis'
import { EvmAddress } from '@/lib/types'
import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export function useRoleManager(vault?: EvmAddress) {
  const result = useReadContract({ 
    address: vault, abi: abis.vault, functionName: 'role_manager',
    query: { enabled: !!vault }
   })
  return result.data
}

export function useIsRoleManager(vault?: EvmAddress) {
  const { isConnected, address } = useAccount()
  const roleManager = useRoleManager(vault)
  return useMemo(() => 
    isConnected && address && address === roleManager, 
  [isConnected, address, roleManager])
}
