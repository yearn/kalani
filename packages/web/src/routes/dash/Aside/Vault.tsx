import { useVaultFromParams } from '../../../hooks/useVault'
import Badge from './Badge'
import { PiCalculator, PiScales, PiRobot } from 'react-icons/pi'
import { compareEvmAddresses } from '../../../lib/types'
import { zeroAddress } from 'viem'

export default function Vault() {
  const vault = useVaultFromParams()
  if (!vault) return <></>
  return <div>
    <div className="flex flex-col items-center justify-center gap-12">
      <Badge label="Accountant" icon={PiCalculator} enabled={!compareEvmAddresses(vault.accountant, zeroAddress)} />
      <Badge label="Allocator" icon={PiScales} enabled={vault.strategies.length > 1} />
      <Badge label="yHaaS" icon={PiRobot} />
    </div>
  </div>
}
