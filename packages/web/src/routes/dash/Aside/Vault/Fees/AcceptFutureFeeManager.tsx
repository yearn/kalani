import { zeroAddress } from 'viem'
import { useAccount, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useCallback, useEffect, useMemo } from 'react'
import abis from '@kalani/lib/abis'
import Notification from '../../Notification'
import Button from '../../../../../components/elements/Button'
import { fEvmAddress } from '@kalani/lib/format'
import { useAccountantForVaultFromParams } from '../../../../../hooks/useAccountantSnapshot'
import String from '../../../../../strings/String'

function useAcceptFutureFeeManager() {
  const { vault } = useVaultFromParams()
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.accountant,
    address: vault?.accountant ?? zeroAddress,
    functionName: 'acceptFeeManager'
  }), [vault])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data, confirmations: 2 })
  return { simulation, write, confirmation, resolveToast }
}

export function AcceptFutureFeeManager() {
  const { address, chainId } = useAccount()
  const { vault } = useVaultFromParams()
  const { simulation, write, confirmation, resolveToast } = useAcceptFutureFeeManager()
  const { refetch: refetchAccountant } = useAccountantForVaultFromParams()

  const isOnSameChain = useMemo(() => chainId === vault?.chainId, [chainId, vault?.chainId])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !isOnSameChain
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [isOnSameChain, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation])

  const onAccept = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      refetchAccountant()
    }
  }, [confirmation, resolveToast, write, refetchAccountant])

  const actions = <Button theme={buttonTheme} disabled={disabled} onClick={onAccept} className="text-warn-400">Accept</Button>

  return <div className="flex flex-col gap-4">
    <Notification actions={actions}>
      <String _key="new-vault-accept-fee-manager" args={[fEvmAddress(address ?? zeroAddress)]} />
    </Notification>
  </div>
}
