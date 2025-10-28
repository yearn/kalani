import FlyInFromBottom from '../../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../../hooks/useMounted'
import { useMinimumChange } from '../../../Vault/useAllocator'
import StrategiesByAddress from './StrategiesByAddress'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { VaultSelector } from './Selector'
import { SetMinimumChange } from '../../../Vault/tabs/Allocator/SetMinimumChange'
import DepositWithdraw from '../../../../../components/DepositWithdraw'
import String from '../../../../../strings/String'
import { useMemo } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { zeroAddress } from 'viem'

function SetMinimumChangeNotification() {
  return <div className="p-8 flex flex-col gap-8 border-primary border-warn-950 rounded-primary text-warn-400">
    <h2 className="text-xl">Minimum Change</h2>
    <p className="flex items-center gap-8 text-warn-400">
      <String _key="new-vault-min-change" />
    </p>
    <div className="flex justify-end gap-4 text-xs 2xl:text-md">
      <SetMinimumChange className="text-neutral-400" />
    </div>
  </div>
}

export default function Allocator() {
  const { vault } = useVaultFromParams()
  const authorizedAddStrategy = useHasRolesOnChain(ROLES.ADD_STRATEGY_MANAGER)
  const { minimumChange } = useMinimumChange()
  const mounted = useMounted()

  const authorizedDebtManager = useHasRolesOnChain(ROLES.DEBT_MANAGER)

  const showMinChangeNotification = useMemo(() => {
    return (minimumChange < 1) && authorizedDebtManager
  }, [minimumChange, authorizedDebtManager])

  if (showMinChangeNotification) { return (
    <FlyInFromBottom _key="aside-allocator-no-min-change" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
      <SetMinimumChangeNotification />
    </FlyInFromBottom>
  ) } else { return (
    <FlyInFromBottom _key="aside-allocator" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
      {authorizedAddStrategy && <VaultSelector />}
      {authorizedAddStrategy && <StrategiesByAddress />}
      {!authorizedAddStrategy && <DepositWithdraw chainId={vault?.chainId ?? 0} vault={vault?.address ?? zeroAddress} />}
    </FlyInFromBottom>
    )
  }
}
