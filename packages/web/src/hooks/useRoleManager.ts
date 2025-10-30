import abis from '@kalani/lib/abis'
import { EvmAddress } from '@kalani/lib/types'
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
  const { isConnected, address } = useAccount()
  const roleManager = useRoleManager(vault)
  return useMemo(() => 
    isConnected && address && address === roleManager, 
  [isConnected, address, roleManager])
}
