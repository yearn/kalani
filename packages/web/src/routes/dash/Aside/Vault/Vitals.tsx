import { compareEvmAddresses } from '@kalani/lib/strings'
import { PiCalculator, PiScales } from 'react-icons/pi'
import { useAllocator } from '../../Vault/useAllocator'
import { useVaultFromParams } from '../../../../hooks/useVault/withVault'
import { zeroAddress } from 'viem'
import { ROLES } from '@kalani/lib/types'
import { FixItNotification } from '../Notification'
import { useHasRoles } from '../../../../hooks/useHasRoles'
import DepositWithdraw from '../../../../components/DepositWithdraw'
import { useMemo } from 'react'

function useNotifications() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()

  const isAccountantManager = useHasRoles({ chainId: vault?.chainId ?? 0, vault: vault?.address ?? zeroAddress, roleMask: ROLES.ACCOUNTANT_MANAGER })
  const isDebtManager = useHasRoles({ chainId: vault?.chainId ?? 0, vault: vault?.address ?? zeroAddress, roleMask: ROLES.DEBT_MANAGER })

  return useMemo(() => {
    const result: React.ReactNode[] = []
    if (compareEvmAddresses(vault?.accountant ?? zeroAddress, zeroAddress) && isAccountantManager) {
      result.push(<FixItNotification 
        key={`vault-vitals-accountant-${vault?.address}`}
        id={`vault-vitals-accountant-${vault?.address}`}
        authorized={isAccountantManager} 
        icon={PiCalculator}>
          No accountant set
        </FixItNotification>
      )
    }

    if (compareEvmAddresses(allocator, zeroAddress) && isDebtManager) {
      result.push(<FixItNotification 
        id={`vault-vitals-allocator-${vault?.address}`} 
        key={`vault-vitals-allocator-${vault?.address}`}
        authorized={isDebtManager} 
        icon={PiScales}>
          No allocator set
        </FixItNotification>
      )
    }

    return result
  }, [vault, allocator, isAccountantManager, isDebtManager])
}

export default function Vitals() {
  const { vault } = useVaultFromParams()
  const notifications = useNotifications()
  return <div className="w-full flex flex-col gap-8">
    {notifications.length > 0 && <div className="flex flex-col gap-6">
      {notifications}
    </div>}
    <DepositWithdraw chainId={vault?.chainId ?? 0} vault={vault?.address ?? zeroAddress} />
  </div>
}
