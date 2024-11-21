import { compareEvmAddresses } from '@kalani/lib/strings'
import { PiCalculator, PiScales, PiRobot } from 'react-icons/pi'
import { useAllocator } from '../../Vault/useAllocator'
import { useIsRelayed } from '../../Yhaas/Whitelist/TargetForm/VaultForm/useIsRelayed'
import { useVaultFromParams } from '../../../../hooks/useVault'
import { zeroAddress } from 'viem'
import { ROLES } from '@kalani/lib/types'
import { useCallback, useMemo } from 'react'
import { IconType } from 'react-icons/lib'
import Button from '../../../../components/elements/Button'
import useLocalStorage from 'use-local-storage'
import { useNavigate } from 'react-router-dom'
import { useWhitelist } from '../../Yhaas/Whitelist/useWhitelist'

function Notification({ id, icon: Icon, onFix, children }: { id: string, icon: IconType, onFix?: () => void, children?: React.ReactNode }) {
  const [dismissed, setDismissed] = useLocalStorage<Record<string, boolean>>('notification-dismissed', {})

  const onDismiss = useCallback(() => {
    setDismissed(current => ({ ...current, [id]: true }))
  }, [id, setDismissed])

  const isDismissed = useMemo(() => dismissed[id], [id, dismissed])

  if (isDismissed) { return <></> }

  return <div className={`pl-8 pr-3 pt-8 pb-3 flex flex-col gap-8 border-primary border-warn-950 rounded-primary text-warn-400`}>
    <div className="flex items-center gap-8">
      <Icon size={32} className="group-data-[open=true]:fill-secondary-100 group-data-[open=false]:fill-warn-400" />
      {children}
    </div>
    <div className="flex justify-end gap-4">
      <Button h="tertiary" className="py-4 text-warn-400 text-base" onClick={onDismiss}>Dismiss</Button>
      <Button h="primary" className="py-4 text-warn-400 text-base" onClick={onFix}>Fix</Button>
    </div>
  </div>
}

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

  return useMemo(() => {
    const result: React.ReactNode[] = []
    if (compareEvmAddresses(vault?.accountant ?? zeroAddress, zeroAddress)) {
      result.push(<Notification id={`accountant-${vault?.address}`} icon={PiCalculator}>No accountant set</Notification>)
    }
    if (compareEvmAddresses(allocator, zeroAddress)) {
      result.push(<Notification id={`allocator-${vault?.address}`} icon={PiScales}>No allocator set</Notification>)
    }
    if (!isRelayed) {
      result.push(<Notification id={`yhaas-${vault?.address}`} icon={PiRobot} onFix={onFixYhaas}>yHaaS disabled</Notification>)
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
    <div className="px-12 py-8 flex items-center justify-center border-primary border-neutral-900 rounded-primary text-neutral-700">
      deposits x withdrawals
    </div>
  </div>
}
