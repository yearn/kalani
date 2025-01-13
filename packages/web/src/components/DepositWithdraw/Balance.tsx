import { useSuspendedParameters } from './useParameters'
import { useVaultAsset } from './useVaultAsset'
import { useBalance } from '../../hooks/useBalance'
import Odometer from 'react-odometerjs'
import { formatUnits } from 'viem'

export default function Balance() {
  const { chainId, vault, wallet } = useSuspendedParameters()
  const { asset } = useVaultAsset(chainId!, vault!)
  const { balance, decimals } = useBalance({ chainId, token: asset!.address, address: wallet! })
  return <div className="flex items-center gap-2">
    <div>Balance</div>
    <Odometer value={Number(formatUnits(balance ?? 0n, decimals ?? 18))} format="(,ddd).dd" />
  </div>
}
