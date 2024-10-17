import { useVaultFromParams } from '../../../hooks/useVault'
import Badge from './Badge'
import { PiCalculator, PiScales, PiRobot } from 'react-icons/pi'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { zeroAddress } from 'viem'
import { ROLES } from '@kalani/lib/types'
import { useIsRelayed } from '../Yhaas/Whitelist/TargetForm/VaultForm/useIsRelayed'

export default function Vault() {
  const vault = useVaultFromParams()
  const { data: isRelayed } = useIsRelayed({ 
    vault: vault?.address ?? zeroAddress, 
    chainId: vault?.chainId, 
    rolemask: ROLES.REPORTING_MANAGER 
  })

  if (!vault) return <></>
  return <div>
    <div className="flex flex-col items-center justify-center gap-12">
      <Badge label="Accountant" icon={PiCalculator} enabled={!compareEvmAddresses(vault.accountant, zeroAddress)} />
      <Badge label="Allocator" icon={PiScales} enabled={vault.strategies.length > 1} />
      <Badge label="yHaaS" icon={PiRobot} enabled={isRelayed} />
    </div>
  </div>
}
