import { useMemo } from 'react'
import { useAccount } from 'wagmi'
import { zeroAddress } from 'viem'
import { useHasRoles } from './useHasRoles'
import { useVaultFromParams } from './useVault/withVault'
import { ROLES } from '@kalani/lib/types'

export { ROLES }

export function useHasRolesOnChain(roleMask: bigint) {
  const { vault } = useVaultFromParams()
  const { chainId } = useAccount()

  const hasRole = useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask
  })

  const isOnSameChain = useMemo(() =>
    chainId === vault?.chainId,
    [chainId, vault?.chainId]
  )

  return useMemo(() => hasRole && isOnSameChain, [hasRole, isOnSameChain])
}
