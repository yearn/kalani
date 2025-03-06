import { SkeletonButton } from '../../../../../components/Skeleton'
import { Suspense, useEffect, useCallback, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { useHasDebtManagerRole } from './useHasDebtManagerRole'
import { useChainId, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { EvmAddress } from '@kalani/lib/types'
import { useEffectiveDebtRatioBps } from './useEffectiveDebtRatioBps'
import { useOnChainStrategyParams } from './useOnChainStrategyParams'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'

function useUpdateDebt(vault: EvmAddress, strategy: EvmAddress, targetDebt: bigint, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function update_debt(address strategy, uint256 target_debt) external returns ()']),
    address: vault,
    functionName: 'update_debt',
    args: [strategy, targetDebt],
    query: { enabled: enabled }
  }), [vault, enabled, strategy, targetDebt])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault, strategy, targetDebt }: { vault: EvmAddress, strategy: EvmAddress, targetDebt: bigint }) {
  const chainId = useChainId()
  const authorized = useHasDebtManagerRole()
  const { simulation, write, confirmation, resolveToast } = useUpdateDebt(vault, strategy, targetDebt, authorized)
  const { refetch: refetchEffectiveDebtRatioBps } = useEffectiveDebtRatioBps(chainId, vault, strategy)
  const { refetch: refetchStrategyParams } = useOnChainStrategyParams(chainId, vault, strategy)
  const { refetch: refetchEstimatedAssets } = useOnChainEstimatedAssets(chainId, vault, strategy)

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
    || simulation.isError
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, simulation.isFetching, simulation.isError, write.isPending, write.isSuccess, confirmation.isPending])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      refetchEffectiveDebtRatioBps()
      refetchStrategyParams()
      refetchEstimatedAssets()
    }
  }, [confirmation, resolveToast, write, refetchEffectiveDebtRatioBps, refetchStrategyParams, refetchEstimatedAssets])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button theme={theme} disabled={disabled} onClick={onClick}>Update debt</Button>
}

export default function UpdateDebt({ vault, strategy, targetDebt }: { vault: EvmAddress, strategy: EvmAddress, targetDebt: bigint }) {
  return <Suspense fallback={<SkeletonButton>Update debt</SkeletonButton>}>
    <Suspender vault={vault} strategy={strategy} targetDebt={targetDebt} />
  </Suspense>
}
