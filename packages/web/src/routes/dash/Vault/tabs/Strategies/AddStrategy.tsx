import { useCallback, useEffect, useMemo, useState } from 'react'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { FinderItem } from '../../../../../components/Finder/useFinderItems'
import { compareEvmAddresses } from '@kalani/lib/strings'
import SelectStrategy from '../../../../../components/SelectStrategy'
import Button from '../../../../../components/elements/Button'
import { useLocalVaultStrategies } from '../../../../../hooks/useVault'
import { zeroAddress, SimulateContractParameters } from 'viem'
import { useDefaultQueueComposite } from '../Allocator/useDefaultQueueComposite'
import { useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useWriteContract } from '../../../../../hooks/useWriteContract'

export function AddStrategy() {
  const { vault, query } = useVaultFromParams()
  const [selectedStrategy, setSelectedStrategy] = useState<FinderItem | undefined>(undefined)
  const { setLocalVaultStrategies } = useLocalVaultStrategies()
  const { refetch: refetchDefaultQueue } = useDefaultQueueComposite()

  const parameters = useMemo<SimulateContractParameters>(() => ({
    abi: abis.vault,
    address: vault?.address ?? zeroAddress,
    functionName: 'add_strategy',
    args: [selectedStrategy?.address ?? zeroAddress],
    query: { enabled: !!vault && !!selectedStrategy }
  }), [vault, selectedStrategy])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  const buttonTitle = useMemo(() => {
    if (!selectedStrategy) return 'Select strategy'
    if (simulation.isError) return 'Error, check console!'
    return 'Add strategy'
  }, [selectedStrategy, simulation])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    if (!selectedStrategy) return true
    return simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [selectedStrategy, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  const onAdd = useCallback(async () => {
    if (!selectedStrategy) return
    write.writeContract(simulation.data!.request)
  }, [write, simulation, selectedStrategy])

  useEffect(() => {
    if (confirmation.isSuccess && selectedStrategy) {
      resolveToast()
      const vaultStrategy = {
        chainId: selectedStrategy.chainId,
        vault: vault?.address ?? zeroAddress,
        address: selectedStrategy.address,
        name: selectedStrategy.name ?? '',
      }
      setLocalVaultStrategies(strategies => {
        if (strategies.some(strategy =>
          strategy.chainId === vaultStrategy.chainId
          && compareEvmAddresses(strategy.vault, vaultStrategy.vault)
          && compareEvmAddresses(strategy.address, vaultStrategy.address)
        )) return strategies
        return [...strategies, vaultStrategy]
      })
      query.refetch()
      refetchDefaultQueue()
      setSelectedStrategy(undefined)
    }
  }, [confirmation, resolveToast, setLocalVaultStrategies, selectedStrategy, query, vault, refetchDefaultQueue])

  if (!vault) return null

  return (
    <div className="grid grid-cols-[1fr_auto] gap-x-8">
      <div className="">
        <SelectStrategy
          vault={vault}
          placeholder="+ Add strategy by name or address"
          selected={selectedStrategy}
          onSelect={setSelectedStrategy}
        />
      </div>
      <div className="flex items-center justify-center">
        <Button title={buttonTitle} onClick={onAdd} theme={buttonTheme} disabled={disabled} className="w-12 h-12 text-2xl">+</Button>
      </div>
    </div>
  )
}
