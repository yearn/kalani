import { SkeletonButton } from '../../../../../components/Skeleton'
import { Suspense, useEffect, useCallback, useMemo } from 'react'
import { Vault, withVault } from '../../../../../hooks/useVault'
import Button from '../../../../../components/elements/Button'
import { useHasDebtManagerRole } from './useHasDebtManagerRole'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { useWriteContract } from '../../../../../hooks/useWriteContract'

function useUpdateDebt(vault: Vault, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function update_debt() external view returns ()']),
    address: vault.address,
    functionName: 'update_debt',
    query: { enabled: enabled && false }
  }), [vault, enabled])
  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault }: { vault: Vault }) {
  const authorized = useHasDebtManagerRole()
  const { simulation, write, confirmation, resolveToast } = useUpdateDebt(vault, authorized)

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
    || true
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

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button theme={theme} disabled={disabled} onClick={onClick}>Exec</Button>
}

function Component({ vault }: { vault: Vault }) {
  return <Suspense fallback={<SkeletonButton>Exec</SkeletonButton>}>
    <Suspender vault={vault} />
  </Suspense>
}

const UpdateDebt = withVault(Component)
export default UpdateDebt
