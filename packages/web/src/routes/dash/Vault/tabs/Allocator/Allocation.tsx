import { useCallback, useEffect, useMemo } from 'react'
import { useVaultParams } from '../../../../../hooks/useVault'
import { useAllocator, useTotalDebtRatio } from '../../useAllocator'
import { useFinderUtils } from '../../../../../components/Finder/useFinderItems'
import { EvmAddress } from '@kalani/lib/types'
import { parseAbi, zeroAddress } from 'viem'
import { useOnchainTargetRatio } from './useOnchainTargetRatios'
import { useOnchainTargetRatios } from './useOnchainTargetRatios'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useTotalDebtRatioUpdates } from './useTotalDebtRatioUpdates'
import { fPercent, fTokens } from '@kalani/lib/format'
import LinkButton from '../../../../../components/elements/LinkButton'
import InputBps from '../../../../../components/elements/InputBps'
import Button from '../../../../../components/elements/Button'
import ViewBps from '../../../../../components/elements/ViewBps'
import EvmAddressChipSlide from '../../../../../components/ChipSlide/EvmAddressChipSlide'
import LabelValueRow from '../../../../../components/elements/LabelValueRow'
import ProcessReport from './ProcessReport'
import { useHasDebtManagerRole } from './useHasDebtManagerRole'
import UpdateDebt from './UpdateDebt'
import { useOnChainEstimatedAssets } from './useOnChainEstimatedAssets'
import { useVaultFromParams } from '../../../../../hooks/useVault/withVault'
import { useOnChainStrategyParams } from './useOnChainStrategyParams'
import ViewGeneric from '../../../../../components/elements/ViewGeneric'
import { useEffectiveDebtRatioBps } from './useEffectiveDebtRatioBps'
import ReactTimeago from 'react-timeago'

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
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

function useDebtRatioUpdate(strategy: EvmAddress) {
  const { updates } = useDebtRatioUpdates()
  return updates.find(a => a.strategy === strategy)!
}

function MutableAllocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const { vault } = useVaultFromParams()
  const authorized = useHasDebtManagerRole()
  const { strategyParams } = useOnChainStrategyParams(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { estimatedAssets } = useOnChainEstimatedAssets(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { effectiveDebtRatioBps } = useEffectiveDebtRatioBps(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)

  const { refetch: refetchTotalDebtRatio } = useTotalDebtRatio()
  const { refetch: refetchOnchainTargetRatios } = useOnchainTargetRatios()
  const onchainTargetRatio = useOnchainTargetRatio(strategy.address)

  const { updateDebtRatio } = useDebtRatioUpdates()
  const update = useDebtRatioUpdate(strategy.address)
  const { totalDebtRatio } = useTotalDebtRatioUpdates()
  const { findFinderItem, getHrefFor } = useFinderUtils()

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
        refetchOnchainTargetRatios()
      }, 10)
    }
  }, [confirmation, resolveToast, refetchTotalDebtRatio, refetchOnchainTargetRatios])

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

  return <div className="sm:p-3 flex flex-col items-start gap-4 border-primary border-transparent rounded-primary">

    <LinkButton to={getHrefFor(strategy)} h="tertiary" className="max-w-full flex items-center gap-3 px-6 h-14 text-2xl font-bold">
      <ViewBps bps={Number(update.debtRatio)} className="hidden sm:block text-lg" />
      <div className="w-[300px] sm:w-[400px] truncate">{strategy.name}</div>
    </LinkButton>

    <div className="sm:pl-6 w-full flex flex-col items-start gap-primary">
      <LabelValueRow label="Address">
        <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.address} />
      </LabelValueRow>
      <LabelValueRow label="APY">
        <div>{fPercent(findFinderItem(strategy)?.apy) ?? '-.--%'}</div>
      </LabelValueRow>
      <LabelValueRow label="Target debt ratio">
        <div className="flex items-center gap-6">
          <InputBps bps={Number(update.debtRatio)} onChange={onChange} isValid={true} className="w-56 sm:w-64" />
          <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="h-14">Set</Button>
        </div>
      </LabelValueRow>
      <LabelValueRow label="Effective debt ratio">
        <ViewBps bps={effectiveDebtRatioBps} />
      </LabelValueRow>
      <LabelValueRow label="Debt">
        <ViewGeneric>{fTokens(strategyParams.currentDebt, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>
      <LabelValueRow label="Estimated assets">
        <ViewGeneric>{fTokens(estimatedAssets, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="Last report to vault">
        <ViewGeneric>
          <ReactTimeago date={Number(strategyParams.lastReport) * 1000} />
        </ViewGeneric>
      </LabelValueRow>

      <LabelValueRow label="">
        <div className="flex items-center gap-3 sm:gap-6">
          <ProcessReport strategy={strategy.address} />
          <UpdateDebt vault={vault?.address ?? zeroAddress} strategy={strategy.address} targetDebt={update.debtRatio} />
        </div>
      </LabelValueRow>
    </div>
  </div>
}

function ReadonlyAllocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const { findFinderItem, getHrefFor } = useFinderUtils()
  const ratio = useOnchainTargetRatio(strategy.address)
  const { vault } = useVaultFromParams()
  const { strategyParams } = useOnChainStrategyParams(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { estimatedAssets } = useOnChainEstimatedAssets(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { effectiveDebtRatioBps } = useEffectiveDebtRatioBps(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)

  return <div className="sm:p-3 flex flex-col items-start gap-4 border-primary border-transparent rounded-primary">
    <LinkButton to={getHrefFor(strategy)} h="tertiary" className="max-w-full flex items-center gap-3 px-6 h-14 text-2xl">
      <ViewBps bps={Number(ratio)} className="hidden sm:block text-lg" />
      <div className="w-[300px] sm:w-[400px] truncate">{strategy.name}</div>
    </LinkButton>

    <div className="sm:pl-6 w-full flex flex-col items-start gap-primary">
      <LabelValueRow label="Address">
        <EvmAddressChipSlide chainId={strategy.chainId} address={strategy.address} />
      </LabelValueRow>
      <LabelValueRow label="APY">
        <ViewGeneric>{fPercent(findFinderItem(strategy)?.apy) ?? '-.--%'}</ViewGeneric>
      </LabelValueRow>
      <LabelValueRow label="Target debt ratio">
        <ViewBps bps={Number(ratio)} />
      </LabelValueRow>
      <LabelValueRow label="Effective debt ratio">
        <ViewBps bps={effectiveDebtRatioBps} />
      </LabelValueRow>
      <LabelValueRow label="Debt">
        <ViewGeneric>{fTokens(strategyParams.currentDebt, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>
      <LabelValueRow label="Estimated assets">
        <ViewGeneric>{fTokens(estimatedAssets, vault?.asset.decimals ?? 0)}</ViewGeneric>
      </LabelValueRow>
    </div>
  </div>
}

export default function Allocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const authorized = useHasDebtManagerRole()
  if (authorized) { return <MutableAllocation strategy={strategy} /> }
  else { return <ReadonlyAllocation strategy={strategy} /> }
}
