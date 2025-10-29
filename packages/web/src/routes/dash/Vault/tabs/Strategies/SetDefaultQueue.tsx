import { useCallback, useEffect, useMemo } from 'react'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { EvmAddress } from '@kalani/lib/types'
import abis from '@kalani/lib/abis'
import Button from '../../../../../components/elements/Button'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useDefaultQueueComposite } from '../Allocator/useDefaultQueueComposite'

interface SetDefaultQueueProps {
  orderedStrategies: Array<{ address: EvmAddress }>
  className?: string
}

function useSetDefaultQueue(strategies: EvmAddress[]) {
  const { vault } = useVaultFromParams()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.vault,
    address: vault?.address,
    functionName: 'set_default_queue',
    args: [strategies]
  }), [vault?.address, strategies])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data, confirmations: 2 })

  return { simulation, write, confirmation, resolveToast }
}

export function SetDefaultQueue({ orderedStrategies, className }: SetDefaultQueueProps) {
  const { query: { refetch: refetchVault } } = useVaultFromParams()
  const { defaultQueue: onChainDefaultQueue, refetch: refetchDefaultQueue } = useDefaultQueueComposite()
  const authorized = useHasRolesOnChain(ROLES.QUEUE_MANAGER)

  const strategyAddresses = useMemo(() =>
    orderedStrategies.map(s => s.address),
    [orderedStrategies]
  )

  // Compare against on-chain queue, not indexed vault.defaultQueue
  const onChainAddresses = useMemo(() =>
    onChainDefaultQueue.map(s => s.address),
    [onChainDefaultQueue]
  )

  const isDirty = useMemo(() => {
    if (strategyAddresses.length !== onChainAddresses.length) {
      return true
    }
    return strategyAddresses.some((address, index) =>
      !compareEvmAddresses(address, onChainAddresses[index])
    )
  }, [strategyAddresses, onChainAddresses])

  const { simulation, write, confirmation, resolveToast } = useSetDefaultQueue(strategyAddresses)

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized
    || !isDirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, isDirty, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      refetchVault()
      refetchDefaultQueue()
    }
  }, [confirmation.isSuccess, resolveToast, write, refetchVault, refetchDefaultQueue])

  return (
    <Button
      theme={buttonTheme}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      Update queue
    </Button>
  )
}
