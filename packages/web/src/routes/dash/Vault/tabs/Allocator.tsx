import { useCallback, useEffect, useMemo, useState } from 'react'
import Button from '../../../../components/elements/Button'
import { useVaultFromParams, useVaultParams } from '../../../../hooks/useVault'
import { useAllocator, useVaultConfig } from '../useAllocator'
import { getItemHref, useFinderItems } from '../../../../components/Finder/useFinderItems'
import { compareEvmAddresses } from '@kalani/lib/strings'
import LinkButton from '../../../../components/elements/LinkButton'
import { fBps, fPercent } from '@kalani/lib/format'
import InputBps, { useInputBpsSettings } from '../../../../components/elements/InputBps'
import { EvmAddress } from '@kalani/lib/types'
import { readContractsQueryOptions } from 'wagmi/query'
import { useConfig, useWaitForTransactionReceipt, useSimulateContract, UseSimulateContractParameters } from 'wagmi'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi, zeroAddress } from 'viem'
import { useWriteContract } from '../../../../hooks/useWriteContract'
import InputInteger from '../../../../components/elements/InputInteger'
import { create } from 'zustand'

export function useSetMinimumChange(minimumChange: bigint) {
  const { address: vault } = useVaultParams()
  const { allocator } = useAllocator()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: parseAbi(['function setMinimumChange(address _vault, uint256 _minimumChange) external']),
    address: allocator,
    functionName: 'setMinimumChange',
    args: [vault, minimumChange],
    query: { enabled: !!vault }
  }), [vault, minimumChange])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export function useSetStrategyDebtRatio(strategy: EvmAddress, ratio: bigint, enabled: boolean) {
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

function useOnchainTargetRatios() {
  const { vault } = useVaultFromParams()
  const config = useConfig()
  const { allocator } = useAllocator()

  const contracts = useMemo(() => vault?.strategies.map(strategy => ({
    abi: parseAbi(['function getStrategyTargetRatio(address _vault, address _strategy) external view returns (uint256)']),
    chainId: strategy.chainId, address: allocator,
    functionName: 'getStrategyTargetRatio',
    args: [vault?.address ?? zeroAddress, strategy.address]
  })), [vault])

  const options = readContractsQueryOptions(config, { contracts })
  const query = useSuspenseQuery(options)

  const onChainTargetRatios = useMemo<{ strategy: EvmAddress, debtRatio: bigint }[]>(() => {
    const result: { strategy: EvmAddress, debtRatio: bigint }[] = []
    for (let i = 0; i < (vault?.strategies.length ?? 0); i++) {
      result.push({ strategy: vault?.strategies[i].address ?? zeroAddress, debtRatio: query.data[i].result! })
    }
    return result
  }, [query, vault])

  const getOnchainTargetRatio = useCallback((strategy: EvmAddress) => {
    return onChainTargetRatios.find(a => a.strategy === strategy)?.debtRatio ?? 0n
  }, [onChainTargetRatios])

  return { ...query, onChainTargetRatios, getOnchainTargetRatio }
}

function useOnchainTargetRatio(strategy: EvmAddress) {
  const { getOnchainTargetRatio } = useOnchainTargetRatios()
  return useMemo(() => getOnchainTargetRatio(strategy), [getOnchainTargetRatio, strategy])
}

type DebtRatioUpdate = {
  chainId: number,
  vault: EvmAddress,
  strategy: EvmAddress,
  debtRatio: bigint,
  isDirty: boolean
}

type UseDebtRatioUpdates = {
  updates: DebtRatioUpdate[],
  updateDebtRatio: (debtRatio: DebtRatioUpdate) => void
} 

const useDebtRatioUpdatesStore = create<UseDebtRatioUpdates>(set => ({
  updates: [],
  updateDebtRatio: (debtRatio: DebtRatioUpdate) => {
    set(current => {
      const index = current.updates.findIndex(a => a.vault === debtRatio.vault && a.strategy === debtRatio.strategy)
      if (index === -1) { return { updates: [...current.updates, debtRatio] } }
      return {
        updates: current.updates.map((a, i) => i === index ? debtRatio : a)
      }
    })
  }
}))

function useDebtRatioUpdates() {
  const { vault } = useVaultFromParams()
  const { onChainTargetRatios } = useOnchainTargetRatios()
  const { updates: _updates, updateDebtRatio } = useDebtRatioUpdatesStore(state => state)

  const updates = useMemo(() => {
    return onChainTargetRatios.map(a => {
      const found = _updates.find(b => b.strategy === a.strategy)
      return {
        chainId: Number(vault?.chainId ?? 0),
        vault: vault?.address ?? zeroAddress,
        strategy: a.strategy,
        debtRatio: found?.debtRatio ?? a.debtRatio,
        isDirty: (found && found.debtRatio !== a.debtRatio) ?? false
      }
    })
  }, [onChainTargetRatios, _updates, vault])

  return { updates, updateDebtRatio }
}

function useDebtRatioUpdate(strategy: EvmAddress) {
  const { updates } = useDebtRatioUpdates()
  return updates.find(a => a.strategy === strategy)!
}

function Allocation({ strategy }: { strategy: {
  chainId: number, 
  address: `0x${string}`, 
  name: string 
} }) {
  const { items } = useFinderItems()
  const { vault } = useVaultFromParams()
  const { refetch: refetchVaultConfig } = useVaultConfig()
  const { refetch: refetchOnchainTargetRatios } = useOnchainTargetRatios()
  const onchainTargetRatio = useOnchainTargetRatio(strategy.address)
  const { updateDebtRatio } = useDebtRatioUpdates()
  const update = useDebtRatioUpdate(strategy.address)
  const { totalDebtRatio } = useTotalDebtRatio()

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
    return !update.isDirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [update, simulation, write])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      setTimeout(() => {
        refetchVaultConfig()
        refetchOnchainTargetRatios()
      }, 10)
    }
  }, [confirmation, resolveToast, refetchVaultConfig, refetchOnchainTargetRatios()])

  const getFinderItem = useCallback((strategy: { chainId: number, address: `0x${string}` }) => {
    return items.find(item => compareEvmAddresses(item.address, strategy.address))
  }, [items])

  const getStrategyHref = useCallback((strategy: { chainId: number, address: `0x${string}` }) => {
    const item = getFinderItem(strategy)
    if (item) return getItemHref(item)
    return `/erc4626/${strategy.chainId}/${strategy.address}`
  }, [getFinderItem])

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

  return <div key={strategy.address} className="w-full flex items-center gap-6">
    <LinkButton to={getStrategyHref(strategy)} h="tertiary" className="px-6 grow h-14 flex items-center justify-between">
      <div>{strategy.name}</div>
      <div className="text-sm">{fPercent(getFinderItem(strategy)?.apy) ?? '-.--%'}</div>
    </LinkButton>
    <div className="w-64 text-right text-2xl font-bold">
      <InputBps bps={Number(update.debtRatio)} onChange={onChange} isValid={true} className="w-64" />
    </div>
    <div className="flex justify-end">
      <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="h-14">Set</Button>
    </div>
  </div>
}

function useTotalDebtRatio() {
  const { vaultConfig } = useVaultConfig()
  const { updates } = useDebtRatioUpdates()
  const totalDebtRatio = useMemo(() => updates.reduce((acc, update) => acc + update.debtRatio, 0n), [updates])
  return { 
    totalDebtRatio, 
    isDirty: Number(totalDebtRatio) !== vaultConfig.totalDebtRatio 
  }
}

function TotalAllocation() {
  const { setting: bpsSetting } = useInputBpsSettings()
  const { totalDebtRatio, isDirty } = useTotalDebtRatio()
  return <div className={`pl-4 text-2xl font-bold ${isDirty ? 'text-primary-400' : ''}`}>
    {fBps(Number(totalDebtRatio), { percent: bpsSetting === '%' })}
  </div>
}

function EstimatedApy() {
  const { items } = useFinderItems()
  const { updates } = useDebtRatioUpdates()
  const isDirty = useMemo(() => updates.some(a => a.isDirty), [updates])

  const apys = useMemo(() => {
    const result: { strategy: EvmAddress, apy: number | null | undefined, debtRatio: bigint }[] = []
    for (const update of updates) {
      const item = items.find(a => compareEvmAddresses(a.address, update.strategy))
      if (item) { result.push({ strategy: update.strategy, apy: item.apy, debtRatio: update.debtRatio }) }
      else { result.push({ strategy: update.strategy, apy: 0, debtRatio: update.debtRatio }) }
    }
    return result
  }, [updates, items])

  const weightedApy = useMemo(() => {
    if (apys.every(a => a.apy === undefined)) return undefined
    return apys.reduce((acc, a) => {
      if (a.apy === undefined) { return acc }
      return (acc ?? 0) + ((a.apy ?? 0) * Number(a.debtRatio))
    }, 0) / 10_000
  }, [apys])

  return <div className={`pr-4 text-2xl font-bold ${isDirty ? 'text-primary-400' : ''}`}>
    {fPercent(weightedApy) ?? '-.--%'}
  </div>
}

function Allocations() {
  const { vault } = useVaultFromParams()

  return <div className="w-full flex flex-col gap-6">
    <div className="w-full flex items-center gap-6">
      <div className="grow"></div>
      <div className="pl-2 w-64 text-neutral-400 text-sm">Allocation</div>
      <div><Button className="invisible">Set</Button></div>
    </div>

    {vault?.strategies.map(strategy => <Allocation key={strategy.address} strategy={strategy} />)}

    <div className="mt-8 w-full flex items-center gap-6">
      <div className="pr-2 grow flex flex-col items-end gap-2">
        <div className="text-sm text-neutral-400">Estimated APY</div>
        <EstimatedApy />
      </div>
      <div className="w-64 pl-2 flex flex-col items-start gap-2">
        <div className="text-sm text-neutral-400">Total allocation</div>
        <TotalAllocation />
      </div>
      <div><Button className="invisible">Set</Button></div>
    </div>
  </div>
}

function SetMinimumChange() {
  const [minimumChange, setMinimumChange] = useState(0n)
  const { simulation, write, confirmation, resolveToast } = useSetMinimumChange(minimumChange)
  const dirty = useMemo(() => minimumChange !== 0n, [minimumChange])
  const { refetch: refetchVaultConfig } = useVaultConfig()

  const disabled = useMemo(() => {
    return !dirty
    || simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [dirty, simulation, write, confirmation])

  const buttonTheme = useMemo(() => {
    if (!dirty) return 'default'
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      refetchVaultConfig()
    }
  }, [confirmation, resolveToast, refetchVaultConfig])

  const onSet = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  return <div className={`
    px-6 py-24 flex items-center justify-center 
     border-primary border-neutral-900 rounded-primary`}>
    <div className="flex flex-col gap-4">
      <div className="text-xl text-neutral-600">Minimum change</div>
      <div className="flex items-center gap-4">
        <InputInteger value={Number(minimumChange)} onChange={e => setMinimumChange(BigInt(e.target.value))} isValid={true} />
        <Button onClick={onSet} disabled={disabled} theme={buttonTheme} className="h-14">Set</Button>
      </div>
    </div>
  </div>
}

function NoStrategies() {
  return <div className={`
    px-6 py-24 flex items-center justify-center 
    text-xl text-neutral-600 border-primary border-neutral-900 rounded-primary`}>
    No strategies yet
  </div>
}

export default function Allocator() {
  const { vault } = useVaultFromParams()
  const { vaultConfig } = useVaultConfig()

  const content = useMemo(() => {
    if (vaultConfig.minimumChange < 1) return <SetMinimumChange />
    if ((vault?.strategies.length ?? 0) > 0) return <Allocations />
    return <NoStrategies />
  }, [vaultConfig, vault])

  return <div className="w-full p-4 flex flex-col gap-12">
    {content}
  </div>
}
