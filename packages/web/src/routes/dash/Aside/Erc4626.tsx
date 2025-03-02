import DepositWithdraw from '../../../components/DepositWithdraw'
import { useVaultFromParams } from '../../../hooks/useVault/withVault'
import { zeroAddress } from 'viem'

export default function Erc4626() {
  const { vault } = useVaultFromParams()

  return <div className="w-full flex flex-col gap-8">
    <DepositWithdraw chainId={vault?.chainId ?? 0} vault={vault?.address ?? zeroAddress} />
  </div>
}
