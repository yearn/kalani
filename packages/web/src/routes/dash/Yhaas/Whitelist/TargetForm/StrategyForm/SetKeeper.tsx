import { useAccount } from 'wagmi'
import SetAddress from '../../../../../../components/SetAddress'
import { zeroAddress } from 'viem'
import abis from '../../../../../../lib/abis'
import { getRelayer } from '../../relayers'
import { useCallback } from 'react'
import { useIsManagement } from './useIsManagement'
import { useIsRelayed } from './useIsRelayed'
import { useWhitelist } from '../../provider'

export default function SetKeeper() {
  const { targetOrUndefined: target } = useWhitelist()
  const { address, chainId } = useAccount()
  const { data: permitted } = useIsManagement()
  const { data: isRelayed, refetch: refetchIsRelayed } = useIsRelayed()
  const relayer = getRelayer(chainId)

  const onConfirm = useCallback(() => refetchIsRelayed(), [refetchIsRelayed])

  if (!(address && chainId && relayer)) return <></>

  return <div className="flex flex-col gap-6">
    <p>Set your keeper to the yHaaS relayer</p>
    <SetAddress
      to={relayer}
      verb="Set"
      permitted={permitted}
      checked={isRelayed}
      onConfirm={onConfirm}
      contract={{
        chainId,
        address: target ?? zeroAddress,
        abi: abis.strategy,
        get: 'keeper',
        set: 'setKeeper',
      }}
    />
  </div>
}
