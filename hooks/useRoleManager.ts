import abis from '@/lib/abis'
import { EvmAddress } from '@/lib/types'
import { useMemo } from 'react'
import { useAccount, useReadContract } from 'wagmi'

export function useRoleManager(vault: { chainId: number, address: EvmAddress }) {
  const result = useReadContract({ 
    ...vault, abi: abis.vault, functionName: 'role_manager',
    query: { enabled: !!vault }
   })
  return result.data
}

export function useIsRoleManager(vault: { chainId: number, address: EvmAddress }) {
  const { isConnected, chainId:_chainId, address } = useAccount()
  const roleManager = useRoleManager(vault)
  return useMemo(() => 
    isConnected && address && address === roleManager, 
  [isConnected, address, roleManager])
}
