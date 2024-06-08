import SetRoles from '@/app/vault/[chainId]/[address]/SetRoles'
import { useVaultFromParams } from '@/hooks/useVault'
import { EvmAddress } from '@/lib/types'
import { useCallback } from 'react'
import TransferRoleManager from '../TransferRoleManager'
import Button from '@/components/elements/Button'
import { PiPlus } from 'react-icons/pi'

export default function Roles() {
  const vault = useVaultFromParams()
  if (!vault) return <></>

  const isRoleManager = useCallback((address: EvmAddress) => {
    return address === vault.roleManager
  }, [vault])

  return <div className="flex flex-col gap-8">
    <div>
      {vault.accounts.map(account => <SetRoles 
        key={account.address} 
        vault={account.vault} 
        account={account.address}
        isRoleManager={isRoleManager(account.address)}
      />)}
    </div>
    <div className="flex justify-end">
      <Button onClick={() => {}}><PiPlus /></Button>
    </div>
    <div className="p-8 border border-neutral-900 rounded-primary">
      <TransferRoleManager vault={vault.address} />
    </div>
  </div>
}
