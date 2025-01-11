import { useCallback, useEffect, useMemo } from 'react'
import { useVaultFromParams, useVaultParams } from '../../../../../hooks/useVault'
import { useAllocator, useTotalDebtRatio } from '../../useAllocator'
import { useFinderUtils } from '../../../../../components/Finder/useFinderItems'
import { EvmAddress, ROLES } from '@kalani/lib/types'
import { parseAbi, zeroAddress } from 'viem'
import { useHasRoles } from '../../../../../hooks/useHasRoles'
import { useOnchainTargetRatio } from './useOnchainTargetRatios'
import { useOnchainTargetRatios } from './useOnchainTargetRatios'
import { useDebtRatioUpdates } from './useDebtRatioUpdates'
import { useSimulateContract, UseSimulateContractParameters, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../../hooks/useWriteContract'
import { useTotalDebtRatioUpdates } from './useTotalDebtRatioUpdates'
import { fPercent } from '@kalani/lib/format'
import LinkButton from '../../../../../components/elements/LinkButton'
import InputBps from '../../../../../components/elements/InputBps'
import Button from '../../../../../components/elements/Button'
import ViewBps from '../../../../../components/elements/ViewBps'

export function useHasDebtManagerRole() {
  const { vault } = useVaultFromParams()
  return useHasRoles({
    chainId: vault?.chainId ?? 0,
    vault: vault?.address ?? zeroAddress,
    roleMask: ROLES.DEBT_MANAGER
  })
}

function useSetStrategyDebtRatio(strategy: EvmAddress, ratio: bigint, enabled: boolean) {
  const { allocator } = useAllocator()
  const { address: vault } = useVaultParams()
  
  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function setStrategyDebtRatio(address _vault, address _strategy, uint256 _ratio) external']),
    address: allocator,
    functionName: 'setStrategyDebtRatio',
    args: [vault, strategy, ratio],
    query: { enabled }
  }), [strategy, ratio, enabled])

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
  }, [authorized, update, simulation, write])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

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
  }, [totalDebtRatio, update, updateDebtRatio, onchainTargetRatio])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className="w-full flex items-center gap-6">
    <LinkButton to={getHrefFor(strategy)} h="tertiary" className="px-6 grow h-14 flex items-center justify-between">
      <div>{strategy.name}</div>
      <div className="text-sm">{fPercent(findFinderItem(strategy)?.apy) ?? '-.--%'}</div>
    </LinkButton>
    <div className="w-64 text-right text-2xl font-bold">
      <InputBps bps={Number(update.debtRatio)} onChange={onChange} isValid={true} className="w-64" />
    </div>
    <div className="flex justify-end">
      <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="h-14">Set</Button>
    </div>
  </div>
}

function ReadonlyAllocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const { findFinderItem, getHrefFor } = useFinderUtils()
  const update = useDebtRatioUpdate(strategy.address)
  return <div className="w-full flex items-center gap-6">
    <LinkButton to={getHrefFor(strategy)} h="tertiary" className="sm:w-64 px-6 grow h-14 flex items-center justify-between">
      <div className="max-w-[80%] truncate">{strategy.name}</div>
      <div className="text-sm">{fPercent(findFinderItem(strategy)?.apy) ?? '-.--%'}</div>
    </LinkButton>
    <div className="w-64 text-2xl font-bold">
      <ViewBps bps={Number(update.debtRatio)} className="w-64 px-6" />
    </div>
    <div className="flex justify-end">
      <Button disabled={true} className="h-14">Set</Button>
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
