import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Vault } from '../../../../../hooks/useVault'
import { withVault } from '../../../../../hooks/useVault/withVault'
import { useReadContract, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { ErrorBoundary } from 'react-error-boundary'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { Switch } from '../../../../../components/shadcn/switch'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import Skeleton from '../../../../../components/Skeleton'

function useUseDefaultQueue(vault: Vault) {
  const query = useReadContract({
    abi: parseAbi(['function use_default_queue() external view returns (bool)']),
    chainId: vault.chainId, address: vault.address,
    functionName: 'use_default_queue'
  })
  return { ...query, useDefaultQueue: query.data ?? false }
}

function useSetUseDefaultQueue(vault: Vault, useDefaultQueue: boolean, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function set_use_default_queue(bool) external view returns ()']),
    address: vault.address,
    functionName: 'set_use_default_queue',
    args: [useDefaultQueue],
    query: { enabled }
  }), [vault, useDefaultQueue, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault }: { vault: Vault }) {
  const { useDefaultQueue } = useUseDefaultQueue(vault)
  const [checked, setChecked] = useState(useDefaultQueue)
  const authorized = useHasRolesOnChain(ROLES.QUEUE_MANAGER)
  const { simulation, write, confirmation, resolveToast } = useSetUseDefaultQueue(vault, !checked, authorized)

  useEffect(() => setChecked(useDefaultQueue), [useDefaultQueue, setChecked])

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
  }, [authorized, simulation, write, confirmation])

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
  }, [setChecked, write, simulation, checked])

  return <div>
    <Switch checked={checked} theme={theme} disabled={disabled} onClick={onToggle} />
  </div>
}

function Component({ vault }: { vault: Vault }) {
  return <ErrorBoundary fallback={<div>N/A</div>}>
    <Suspense fallback={<Skeleton className="h-8 w-16 rounded-full" />}>
      <Suspender vault={vault} />
    </Suspense>
  </ErrorBoundary>
}

const UseDefaultQueue = withVault(Component)
export default UseDefaultQueue
