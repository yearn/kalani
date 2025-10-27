import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { zeroAddress } from 'viem'
import { ROLES } from '@kalani/lib/types'

export function useHasQueueManagerRole() {
  const { vault } = useVaultFromParams()
  return useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask: ROLES.QUEUE_MANAGER
  })
}
