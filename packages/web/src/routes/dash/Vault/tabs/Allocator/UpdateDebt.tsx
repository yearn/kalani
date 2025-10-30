import { SkeletonButton } from '../../../../../components/Skeleton'
import { Suspense, useEffect, useCallback, useMemo } from 'react'
import Button from '../../../../../components/elements/Button'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { useChainId, useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { formatUnits, parseAbi } from 'viem'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { EvmAddress } from '@kalani/lib/types'
import { useEffectiveDebtRatioBps } from './useEffectiveDebtRatioBps'
import { useOnChainStrategyParams } from './useOnChainStrategyParams'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'
import { useMinimumChange } from '../../useAllocator'
import bmath from '@kalani/lib/bmath'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'

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
  const confirmation = useWaitForTransactionReceipt({ hash: write.data, confirmations: 2 })

  return { simulation, write, confirmation, resolveToast }
}

function Suspender({ vault, strategy, targetDebt }: { vault: EvmAddress, strategy: EvmAddress, targetDebt: bigint }) {
  const chainId = useChainId()
  const { vault: vaultIndex } = useVaultFromParams()
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { refetch: refetchEffectiveDebtRatioBps } = useEffectiveDebtRatioBps(chainId, vault, strategy)
  const { strategyParams: { maxDebt, currentDebt }, refetch: refetchStrategyParams } = useOnChainStrategyParams(chainId, vault, strategy)
  const { refetch: refetchEstimatedAssets } = useOnChainEstimatedAssets(chainId, vault, strategy)
  const { minimumChange } = useMinimumChange()

  const debtCanChange = useMemo(() => {
    const gtMinChange = bmath.abs(targetDebt - currentDebt) > minimumChange
    if (targetDebt > currentDebt) {
      return targetDebt <= maxDebt && gtMinChange
    } else {
      return gtMinChange
    }
  }, [minimumChange, targetDebt, currentDebt, maxDebt])

  const { simulation, write, confirmation, resolveToast } = useUpdateDebt(
    vault, strategy, targetDebt, 
    authorized && debtCanChange
  )

  const label = useMemo(() => {
    if (targetDebt > currentDebt) {
      return `+ debt ${formatUnits(targetDebt - currentDebt, vaultIndex?.asset.decimals ?? 18)} ${vaultIndex?.asset.symbol}`
    } else {
      return `- debt ${formatUnits(currentDebt - targetDebt, vaultIndex?.asset.decimals ?? 18)} ${vaultIndex?.asset.symbol}`
    }
  }, [targetDebt, currentDebt, vaultIndex])

  const theme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized 
    || !debtCanChange
    || simulation.isFetching
    || simulation.isError
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, debtCanChange, simulation.isFetching, simulation.isError, write.isPending, write.isSuccess, confirmation.isPending])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      write.reset()
      refetchEffectiveDebtRatioBps()
      refetchStrategyParams()
      refetchEstimatedAssets()
    }
  }, [confirmation, resolveToast, write, refetchEffectiveDebtRatioBps, refetchStrategyParams, refetchEstimatedAssets])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation])

  const onClick = useCallback(() => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <Button theme={theme} disabled={disabled} onClick={onClick} className="!py-2">{label}</Button>
}

export default function UpdateDebt({ vault, strategy, targetDebt }: { vault: EvmAddress, strategy: EvmAddress, targetDebt: bigint }) {
  return <Suspense fallback={<SkeletonButton>Update debt</SkeletonButton>}>
    <Suspender vault={vault} strategy={strategy} targetDebt={targetDebt} />
  </Suspense>
}
