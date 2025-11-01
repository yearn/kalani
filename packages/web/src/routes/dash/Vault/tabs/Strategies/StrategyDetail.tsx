import { Suspense, useCallback, useEffect, useMemo } from 'react'
import { useStrategyDetail } from './StrategyDetailProvider'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useOnChainStrategyParams } from '../Allocator/useOnChainStrategyParams'
import { useOnChainEstimatedAssets } from '../Allocator/useOnChainEstimatedAssets'
import { useOnChainTargetRatio, useOnChainTargetRatios } from '../Allocator/useOnChainTargetRatios'
import { useEffectiveDebtRatioBps } from '../Allocator/useEffectiveDebtRatioBps'
import { useDebtRatioUpdates } from '../Allocator/useDebtRatioUpdates'
import { useTotalDebtRatioUpdates } from '../Allocator/useTotalDebtRatioUpdates'
import { useHasRolesOnChain, ROLES } from '../../../../../hooks/useHasRolesOnChain'
import { useFinderUtils } from '../../../../../components/Finder/useFinderItems'
import { useTotalDebtRatio, useAllocator } from '../../useAllocator'
import { useVaultParams } from '../../../../../hooks/useVault'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { maxUint256, parseAbi, zeroAddress } from 'viem'
import { fTokens } from '@kalani/lib/format'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import ViewGeneric from '../../../../../components/elements/ViewGeneric'
import ViewBps from '../../../../../components/elements/ViewBps'
import InputBps from '../../../../../components/elements/InputBps'
import Button from '../../../../../components/elements/Button'
import ReactTimeago from 'react-timeago'
import { SetMaxDebt } from '../Allocator/SetMaxDebt'
import ProcessReport from '../Allocator/ProcessReport'
import UpdateDebt from '../Allocator/UpdateDebt'
import Revoke from '../Allocator/Revoke'
import ScrollContainer from 'react-indiana-drag-scroll'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import { EvmAddress } from '@kalani/lib/types'
import { PiArrowRightBold } from 'react-icons/pi'
import LinkButton from '../../../../../components/elements/LinkButton'
import Skeleton from '../../../../../components/Skeleton'

function useSetStrategyDebtRatio(strategy: EvmAddress, ratio: bigint, enabled: boolean) {
  const { allocator } = useAllocator()
  const { address: vault } = useVaultParams()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function setStrategyDebtRatio(address _vault, address _strategy, uint256 _ratio) external']),
    address: allocator,
    functionName: 'setStrategyDebtRatio',
    args: [vault, strategy, ratio],
    query: { enabled }
  }), [strategy, ratio, enabled, vault, allocator])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data, confirmations: 2 })
  return { simulation, write, confirmation, resolveToast }
}

function useDebtRatioUpdate(strategy: EvmAddress) {
  const { vault } = useVaultFromParams()
  const { updates } = useDebtRatioUpdates({ vault })
  return updates.find(a => a.strategy === strategy)!
}

function StrategyDetailContent() {
  const { strategy } = useStrategyDetail()
  const { vault } = useVaultFromParams()
  const authorized = useHasRolesOnChain(ROLES.DEBT_MANAGER)
  const { sm } = useBreakpoints()
  const { strategyParams } = useOnChainStrategyParams(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { estimatedAssets } = useOnChainEstimatedAssets(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { effectiveDebtRatioBps } = useEffectiveDebtRatioBps(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { getHrefFor } = useFinderUtils()

  const { refetch: refetchTotalDebtRatio } = useTotalDebtRatio()
  const { refetch: refetchOnChainTargetRatios } = useOnChainTargetRatios()
  const onchainTargetRatio = useOnChainTargetRatio(strategy.address)

  const { updateDebtRatio } = useDebtRatioUpdates({ vault })
  const update = useDebtRatioUpdate(strategy.address)
  const { totalDebtRatio } = useTotalDebtRatioUpdates()

  const { simulation, write, confirmation, resolveToast } = useSetStrategyDebtRatio(
    strategy.address,
    update.debtRatio,
    update.isDirty
  )

  const buttonTheme = useMemo(() => {
    if (!update.isDirty) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [update, simulation, write, confirmation])

  const disabled = useMemo(() => {
    return !authorized
    || !update.isDirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [authorized, update, simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError, simulation.error])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      setTimeout(() => {
        refetchTotalDebtRatio()
        refetchOnChainTargetRatios()
      }, 10)
    }
  }, [confirmation.isSuccess, resolveToast, refetchTotalDebtRatio, refetchOnChainTargetRatios])

  const onChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newRatio = BigInt(e.target.value)
    const previousRatio = update.debtRatio
    const newTotalDebtRatio = totalDebtRatio + (newRatio - previousRatio)
    if (newRatio < 0n || newTotalDebtRatio > 10_000n) { return }
    updateDebtRatio({
      chainId: strategy.chainId,
      vault: vault?.address ?? zeroAddress,
      strategy: strategy.address,
      debtRatio: newRatio,
      isDirty: newRatio !== onchainTargetRatio
    })
  }, [totalDebtRatio, update, updateDebtRatio, onchainTargetRatio, strategy.address, strategy.chainId, vault])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return (
    <div className="w-full flex flex-col items-start px-8 py-4 pb-8 space-y-2">
      {authorized && <LabelValueRow labelClassName="py-4 text-lg text-primary-400" label="">
        {sm && <div className="py-3 w-full flex items-center justify-start sm:justify-end gap-3 sm:gap-6">
          <Revoke vault={vault?.address ?? zeroAddress} strategy={strategy.address} />
          <UpdateDebt vault={vault?.address ?? zeroAddress} strategy={strategy.address} targetDebt={0n} />
          <ProcessReport strategy={strategy.address} />
        </div>}

        {!sm && <ScrollContainer horizontal className="w-full" style={{ maxWidth: '86vw' }}>
          <div className="relative flex items-center justify-start sm:justify-end gap-3 sm:gap-6">
            <ProcessReport strategy={strategy.address} />
            <UpdateDebt vault={vault?.address ?? zeroAddress} strategy={strategy.address} targetDebt={0n} />
            <Revoke vault={vault?.address ?? zeroAddress} strategy={strategy.address} />
            <div className="sticky z-10 top-0 right-0 min-w-2 h-12 bg-neutral-950/20"></div>
          </div>
        </ScrollContainer>}
      </LabelValueRow>}

      <LabelValueRow labelClassName="text-lg" label="Address">
        <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.address} className="sm:-mr-3" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Last report to vault">
        <ViewGeneric>
          <ReactTimeago date={Number(strategyParams.lastReport) * 1000} />
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Target debt ratio" infoKey="target-debt-ratio" theme={update.debtRatio === 0n && 'warning'}>
        {authorized ? (
          <div className="sm:-mr-3 flex items-center gap-4 sm:gap-6">
            <InputBps bps={Number(update.debtRatio)} onChange={onChange} isValid={true} className="w-56 sm:w-64" />
            <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="w-12">Set</Button>
          </div>
        ) : (
          <ViewBps bps={Number(update.debtRatio)} className="sm:-mr-3" />
        )}
      </LabelValueRow>
      <LabelValueRow labelClassName="text-lg" label="Effective debt ratio" infoKey="effective-debt-ratio">
        <ViewBps bps={effectiveDebtRatioBps} className="sm:-mr-3" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Max debt" infoKey="max-debt" theme={strategyParams.maxDebt === 0n && 'warning'}>
        {authorized ? (
          <SetMaxDebt strategy={strategy.address} className="sm:-mr-3" />
        ) : (
          <ViewGeneric>{strategyParams.maxDebt === maxUint256 ? 'MAX' : fTokens(strategyParams.maxDebt, vault?.asset.decimals ?? 0)}</ViewGeneric>
        )}
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Current debt">
        <ViewGeneric>{fTokens(strategyParams.currentDebt, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>
      <LabelValueRow labelClassName="text-lg" label="Estimated assets">
        <ViewGeneric>{fTokens(estimatedAssets, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>
      <LabelValueRow labelClassName="text-lg" label="">
        <LinkButton to={getHrefFor(strategy)} h="tertiary" className="my-4 !py-2 flex items-center gap-4">
          <div>Dashboard</div>
          <PiArrowRightBold />
        </LinkButton>
      </LabelValueRow>
    </div>
  )
}

function StrategyDetailSkeleton() {
  return (
    <div className="w-full flex flex-col items-start px-8 pb-8 space-y-4">
      <LabelValueRow labelClassName="py-2 text-lg text-primary-400" label="">
        <div className="flex gap-3">
          <Skeleton className="w-24 h-6 rounded" />
          <Skeleton className="w-24 h-6 rounded" />
          <Skeleton className="w-24 h-6 rounded" />
        </div>
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Address">
        <Skeleton className="w-64 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Last report to vault">
        <Skeleton className="w-32 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Target debt ratio">
        <div className="flex items-center gap-4">
          <Skeleton className="w-56 h-10 rounded" />
          <Skeleton className="w-12 h-10 rounded" />
        </div>
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Effective debt ratio">
        <Skeleton className="w-24 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Max debt">
        <Skeleton className="w-32 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Current debt">
        <Skeleton className="w-32 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="Estimated assets">
        <Skeleton className="w-32 h-8 rounded" />
      </LabelValueRow>

      <LabelValueRow labelClassName="text-lg" label="">
        <Skeleton className="w-32 h-10 rounded" />
      </LabelValueRow>
    </div>
  )
}

export default function StrategyDetail() {
  const { isOpen } = useStrategyDetail()

  // Early return if not open - prevents StrategyDetailContent from rendering
  if (!isOpen) return null

  return (
    <Suspense fallback={<StrategyDetailSkeleton />}>
      <StrategyDetailContent />
    </Suspense>
  )
}
