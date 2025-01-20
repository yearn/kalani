import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Vault, withVault } from '../../../../../hooks/useVault'
import { useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { ErrorBoundary } from 'react-error-boundary'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { Switch } from '../../../../../components/shadcn/switch'
import { useHasDebtManagerRole } from './Allocation'
import Skeleton from '../../../../../components/Skeleton'

function useAutoAllocate(vault: Vault) {
  const query = useReadContract({
    abi: parseAbi(['function auto_allocate() external view returns (bool)']),
    chainId: vault.chainId, address: vault.address,
    functionName: 'auto_allocate'
  })
  return { ...query, autoAllocate: query.data ?? false }
}

function useSetAutoAllocate(vault: Vault, autoAllocate: boolean, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function set_auto_allocate(bool) external view returns ()']),
    address: vault.address,
    functionName: 'set_auto_allocate',
    args: [autoAllocate],
    query: { enabled }
  }), [vault, autoAllocate, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault }: { vault: Vault }) {
  const { autoAllocate } = useAutoAllocate(vault)
  const [checked, setChecked] = useState(autoAllocate)
  const authorized = useHasDebtManagerRole()
  const { simulation, write, confirmation, resolveToast } = useSetAutoAllocate(vault, !checked, authorized)

  useEffect(() => setChecked(autoAllocate), [autoAllocate, setChecked])

  const theme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized 
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, simulation, write])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
    }
  }, [confirmation, resolveToast, write])

  const onToggle = useCallback(() => {
    write.writeContract(simulation.data!.request)
    setChecked(!checked)
  }, [setChecked, write, simulation])

  return <div>
    <Switch checked={checked} theme={theme} disabled={disabled} onClick={onToggle} />
  </div>
}

function AutoAllocate({ vault }: { vault: Vault }) {
  return <ErrorBoundary fallback={<div>N/A</div>}>
    <Suspense fallback={<Skeleton className="h-8 w-16 rounded-full" />}>
      <Suspender vault={vault} />
    </Suspense>
  </ErrorBoundary>
}

export default withVault(AutoAllocate)
