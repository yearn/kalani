import { compareEvmAddresses } from '@kalani/lib/strings'
import { PiCalculator, PiScales, PiRobot } from 'react-icons/pi'
import { useAllocator } from '../../Vault/useAllocator'
import { useIsRelayed } from '../../Yhaas/Whitelist/TargetForm/VaultForm/useIsRelayed'
import { useVaultFromParams } from '../../../../hooks/useVault'
import { zeroAddress } from 'viem'
import { PSEUDO_ROLES, ROLES } from '@kalani/lib/types'
import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWhitelist } from '../../Yhaas/Whitelist/useWhitelist'
import Notification from '../Notification'
import { useHasRole } from '../../../../hooks/useHasRole'
import { useIsRoleManager } from '../../../../hooks/useRoleManager'

function useNotifications() {
  const navigate = useNavigate()
  const { setTargets, setTargetsRaw } = useWhitelist()
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()
  const { data: isRelayed } = useIsRelayed({
    vault: vault?.address ?? zeroAddress,
    chainId: vault?.chainId,
    rolemask: ROLES.REPORTING_MANAGER
  })

  const onFixYhaas = useCallback(() => {
    if (!vault) { return }
    setTargetsRaw(vault.address)
    setTargets([vault.address])
    navigate(`/yhaas`)
  }, [navigate, setTargets, setTargetsRaw, vault])

  const accountantManager = useHasRole({ chainId: vault?.chainId ?? 0, vault: vault?.address ?? zeroAddress, roleMask: ROLES.ACCOUNTANT_MANAGER })
  const debtManager = useHasRole({ chainId: vault?.chainId ?? 0, vault: vault?.address ?? zeroAddress, roleMask: ROLES.DEBT_MANAGER })
  const isRoleManager = useIsRoleManager({ chainId: vault?.chainId ?? 0, address: vault?.address ?? zeroAddress })

  return useMemo(() => {
    const result: React.ReactNode[] = []
    if (compareEvmAddresses(vault?.accountant ?? zeroAddress, zeroAddress)) {
      result.push(<Notification 
        key={`vault-vitals-accountant-${vault?.address}`}
        id={`vault-vitals-accountant-${vault?.address}`}
        authorized={accountantManager} 
        icon={PiCalculator}>
          No accountant set
        </Notification>
      )
    }
    if (compareEvmAddresses(allocator, zeroAddress)) {
      result.push(<Notification 
        id={`vault-vitals-allocator-${vault?.address}`} 
        key={`vault-vitals-allocator-${vault?.address}`}
        authorized={debtManager} 
        icon={PiScales}>
          No allocator set
        </Notification>
      )
    }
    if (!isRelayed) {
      result.push(<Notification 
        id={`vault-vitals-yhaas-${vault?.address}`} 
        key={`vault-vitals-yhaas-${vault?.address}`}
        authorized={isRoleManager} 
        icon={PiRobot} 
        onFix={onFixYhaas}>
          yHaaS disabled
        </Notification>
      )
    }
    return result
  }, [vault, allocator, isRelayed])
}

export default function Vitals() {
  const notifications = useNotifications()
  return <div className="w-full flex flex-col gap-8">
    {notifications.length > 0 && <div className="flex flex-col gap-6">
      {notifications}
    </div>}
    {/* <div className="px-12 py-8 flex items-center justify-center border-primary border-neutral-900 rounded-primary text-neutral-700">
      deposits x withdrawals
    </div> */}
  </div>
}
