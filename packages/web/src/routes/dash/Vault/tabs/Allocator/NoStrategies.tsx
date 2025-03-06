import { ROLES } from '@kalani/lib/types'
import Dialog from '../../../../../components/Dialog'
import { useDialog } from '../../../../../components/Dialog/useDialog'
import AButton from '../../../../../components/elements/AButton'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { useVaultParams } from '../../../../../hooks/useVault'
import { VaultSelector } from '../../../Aside/Vault/Allocator/Selector'
import StrategiesByAddress from '../../../Aside/Vault/Allocator/StrategiesByAddress'

export function AddStrategyButton() {
  const dialog = useDialog('add-strategy')
  const { chainId, address: vault } = useVaultParams()
  const authorizedAddStrategy = useHasRoles({ chainId, vault, roleMask: ROLES.ADD_STRATEGY_MANAGER })

  if (!authorizedAddStrategy) return <></>

  return <>
    <AButton onClick={dialog.openDialog} className="font-bold text-xl">Add a strategy</AButton>
    <Dialog title="Add a strategy" dialogId="add-strategy">
      <div className="flex flex-col gap-12">
        {authorizedAddStrategy && <VaultSelector />}
        {authorizedAddStrategy && <StrategiesByAddress />}
      </div>
    </Dialog>
  </>
}

export default function NoStrategies() {
  const { sm } = useBreakpoints()

  return <div className={'flex items-center justify-center text-xl'}>
    {sm && 'No strategies yet'}
    {!sm && <AddStrategyButton />}
  </div>
}
