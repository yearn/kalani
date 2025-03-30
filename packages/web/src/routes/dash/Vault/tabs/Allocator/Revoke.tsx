import { SkeletonButton } from '../../../../../components/Skeleton'
import { Suspense, useEffect, useCallback, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { useChainId, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { parseAbi } from 'viem'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { EvmAddress } from '@kalani/lib/types'
import { useEffectiveDebtRatioBps } from './useEffectiveDebtRatioBps'
import { useOnChainStrategyParams } from './useOnChainStrategyParams'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'
import { useHasRevokeRole } from './useHasRevokeRole'
import { useDefaultQueueComposite } from './useDefaultQueueComposite'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { useLocalVaultStrategies } from '../../../../../hooks/useVault'
import { useOnChainTargetRatio } from './useOnChainTargetRatios'

function useRevoke(vault: EvmAddress, strategy: EvmAddress, enabled: boolean) {
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function revoke_strategy(address strategy) external returns ()']),
    address: vault,
    functionName: 'revoke_strategy',
    args: [strategy],
    query: { enabled: enabled }
  }), [vault, enabled, strategy])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })

  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault, strategy }: { vault: EvmAddress, strategy: EvmAddress }) {
  const chainId = useChainId()
  const authorized = useHasRevokeRole()
  const targetRatio = useOnChainTargetRatio(strategy)
  const { effectiveDebtRatioBps, refetch: refetchEffectiveDebtRatioBps } = useEffectiveDebtRatioBps(chainId, vault, strategy)
  const { strategyParams, refetch: refetchStrategyParams } = useOnChainStrategyParams(chainId, vault, strategy)
  const { refetch: refetchEstimatedAssets } = useOnChainEstimatedAssets(chainId, vault, strategy)
  const { refetch: refetchDefaultQueueComposite } = useDefaultQueueComposite()
  const { setLocalVaultStrategies } = useLocalVaultStrategies()
  const { simulation, write, confirmation, resolveToast } = useRevoke(vault, strategy, authorized && strategyParams.currentDebt === 0n)

  const theme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized 
    || strategyParams.currentDebt > 0n
    || effectiveDebtRatioBps > 0n
    || targetRatio > 0n
    || simulation.isFetching
    || simulation.isError
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, strategyParams, simulation.isFetching, simulation.isError, write.isPending, write.isSuccess, confirmation.isPending, effectiveDebtRatioBps, targetRatio])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      refetchEffectiveDebtRatioBps()
      refetchStrategyParams()
      refetchEstimatedAssets()
      refetchDefaultQueueComposite()

      setLocalVaultStrategies(current => {
        const index = current.findIndex(s => s.chainId === chainId && compareEvmAddresses(s.address, strategy))
        if (index === -1) return current
        const newStrategies = [...current]
        newStrategies.splice(index, 1)
        return newStrategies
      })
    }
  }, [chainId, confirmation, resolveToast, write, refetchEffectiveDebtRatioBps, refetchStrategyParams, refetchEstimatedAssets, refetchDefaultQueueComposite, setLocalVaultStrategies, strategy])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button h="secondary" theme={theme} disabled={disabled} onClick={onClick} className="text-error-600">Revoke</Button>
}

export default function Revoke({ vault, strategy }: { vault: EvmAddress, strategy: EvmAddress }) {
  return <Suspense fallback={<SkeletonButton>Revoke</SkeletonButton>}>
    <Suspender vault={vault} strategy={strategy} />
  </Suspense>
}
