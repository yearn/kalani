import { useCallback, useEffect, useMemo, useState } from 'react'
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
import Revoke from './Revoke'
import ScrollContainer from 'react-indiana-drag-scroll'
import { useBreakpoints } from '../../../../../hooks/useBreakpoints'
import { useDefaultQueueColor } from './useDefaultQueueComposite'
import { PiCaretDownBold } from 'react-icons/pi'

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
  const { vault } = useVaultFromParams()
  const { updates } = useDebtRatioUpdates({ vault })
  return updates.find(a => a.strategy === strategy)!
}

function MutableAllocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const { vault } = useVaultFromParams()
  const authorized = useHasDebtManagerRole()
  const { sm } = useBreakpoints()
  const { strategyParams } = useOnChainStrategyParams(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { estimatedAssets } = useOnChainEstimatedAssets(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const { effectiveDebtRatioBps } = useEffectiveDebtRatioBps(strategy.chainId, vault?.address ?? zeroAddress, strategy.address)
  const color = useDefaultQueueColor(strategy.address)

  const { refetch: refetchTotalDebtRatio } = useTotalDebtRatio()
  const { refetch: refetchOnchainTargetRatios } = useOnchainTargetRatios()
  const onchainTargetRatio = useOnchainTargetRatio(strategy.address)

  const { updateDebtRatio } = useDebtRatioUpdates({ vault })
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

  const [isOpen, setIsOpen] = useState(false)

  return <div className="sm:p-3 flex flex-col items-start gap-4 border-primary border-transparent rounded-primary">

    <div className="w-full flex items-center justify-between gap-6">
      <LinkButton to={getHrefFor(strategy)} h="tertiary" className="flex items-center gap-1 sm:gap-3 pl-0 pr-8 h-14">
        <div className="w-4 sm:w-6 h-14 rounded-l-primary group-hover:!bg-secondary-100 group-active:!bg-secondary-400" style={{ backgroundColor: color }} />
        <ViewBps bps={Number(update.debtRatio)} className="text-xs sm:text-lg" />
        <div className="w-[160px] sm:w-[400px] truncate sm:text-2xl font-bold">{strategy.name}</div>
      </LinkButton>

      <Button data-open={isOpen} h="tertiary" className="group grow !px-0 sm:px-auto flex items-center justify-center" onClick={() => setIsOpen(current => !current)}>
        <PiCaretDownBold className="group-data-[open=true]:rotate-180 text-4xl" />
      </Button>
    </div>

    <div data-open={isOpen} className="data-[open=false]:hidden w-full flex flex-col items-start gap-primary">
      <LabelValueRow label=""><></></LabelValueRow>
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

      {sm && <div className="w-full flex items-center justify-start sm:justify-end gap-3 sm:gap-6">
        <Revoke vault={vault?.address ?? zeroAddress} strategy={strategy.address} />
        <ProcessReport strategy={strategy.address} />
        <UpdateDebt vault={vault?.address ?? zeroAddress} strategy={strategy.address} targetDebt={update.debtRatio} />          
      </div>}

      {!sm && <ScrollContainer horizontal className="w-full" style={{ maxWidth: '86vw' }}>
        <div className="relative flex items-center justify-start sm:justify-end gap-3 sm:gap-6">
          <ProcessReport strategy={strategy.address} />
          <UpdateDebt vault={vault?.address ?? zeroAddress} strategy={strategy.address} targetDebt={update.debtRatio} />          
          <Revoke vault={vault?.address ?? zeroAddress} strategy={strategy.address} />
          <div className="sticky z-10 top-0 right-0 min-w-2 h-12 bg-neutral-950/20"></div>
        </div>
      </ScrollContainer>}
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
  const color = useDefaultQueueColor(strategy.address)
  const [isOpen, setIsOpen] = useState(false)

  return <div className="sm:p-3 flex flex-col items-start gap-4 border-primary border-transparent rounded-primary">

    <div className="w-full flex items-center justify-between gap-6">
      <LinkButton data-zero={ratio === 0n} to={getHrefFor(strategy)} h="tertiary" className="flex items-center gap-1 sm:gap-3 pl-0 pr-8 h-14 data-[zero=true]:!text-neutral-800">
        <div className="w-4 sm:w-6 h-14 rounded-l-primary group-hover:!bg-secondary-100 group-active:!bg-secondary-400" style={{ backgroundColor: color }} />
        <ViewBps bps={Number(ratio)} className="text-xs sm:text-lg" />
        <div className="w-[160px] sm:w-[400px] truncate sm:text-2xl font-bold">{strategy.name}</div>
      </LinkButton>

      <Button data-open={isOpen} h="tertiary" className="group grow !px-0 sm:px-auto flex items-center justify-center" onClick={() => setIsOpen(current => !current)}>
        <PiCaretDownBold className="group-data-[open=true]:rotate-180 text-4xl group-hover:!text-secondary-100 group-active:!text-secondary-400" style={{ color }} />
      </Button>
    </div>

    <div data-open={isOpen} className="data-[open=false]:hidden w-full flex flex-col items-start gap-primary">
      <LabelValueRow label=""><></></LabelValueRow>
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
