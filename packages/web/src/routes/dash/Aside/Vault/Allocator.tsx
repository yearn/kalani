import { zeroAddress } from 'viem'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../hooks/useMounted'
import { useLocalVaultStrategies, useVaultFromParams, useVaultParams } from '../../../../hooks/useVault'
import { useAllocator, useMinimumChange } from '../../Vault/useAllocator'
import { FinderItem, getItemHref, useFinderItems } from '../../../../components/Finder/useFinderItems'
import { useCallback, useEffect, useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import LinkButton from "../../../../components/elements/LinkButton"
import { fPercent } from '@kalani/lib/format'
import Button from '../../../../components/elements/Button'
import StrategiesByAddress from './StrategiesByAddress'
import { useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { EvmAddress, ROLES } from '@kalani/lib/types'
import { UseSimulateContractParameters } from 'wagmi'
import abis from '@kalani/lib/abis'
import { useWriteContract } from '../../../../hooks/useWriteContract'
import { useHasRoles } from '../../../../hooks/useHasRoles'

export function useAddStrategy(strategy: EvmAddress) {
  const { address: vault } = useVaultParams()

  const parameters = useMemo<UseSimulateContractParameters>(() => ({
    abi: abis.vault,
    address: vault ?? zeroAddress,
    functionName: 'add_strategy',
    args: [strategy],
    query: { enabled: !!vault }
  }), [vault, strategy])

  const simulation = useSimulateContract(parameters)
  const { write, resolveToast } = useWriteContract()
  const confirmation = useWaitForTransactionReceipt({ hash: write.data })
  return { simulation, write, confirmation, resolveToast }
}

export function SelectableVault({ item }: { item: FinderItem }) {
  const { write, simulation, confirmation, resolveToast } = useAddStrategy(item.address)
  const { setLocalVaultStrategies } = useLocalVaultStrategies()
  const { query, vault } = useVaultFromParams()

  const buttonTitle = useMemo(() => {
    if (simulation.isError) return 'Error, check console!'
    return 'Add strategy'
  }, [simulation])

  const buttonTheme = useMemo(() => {
    if (write.isSuccess && confirmation.isPending) return 'confirm'
    if (write.isPending) return 'write'
    if (simulation.isFetching) return 'sim'
    if (simulation.isError) return 'error'
    return 'default'
  }, [simulation, write, confirmation])

  const disabled = useMemo(() => {
    return simulation.isFetching
    || !simulation.isSuccess
    || write.isPending
    || (write.isSuccess && confirmation.isPending)
  }, [simulation, write, confirmation])

  useEffect(() => {
    if (simulation.isError) { console.error(simulation.error) }
  }, [simulation.isError])

  const onAdd = useCallback(async () => {
    write.writeContract(simulation.data!.request)
  }, [write, simulation])

  useEffect(() => {
    if (confirmation.isSuccess) {
      resolveToast()
      const vaultStrategy = {
        chainId: item.chainId,
        vault: vault?.address ?? zeroAddress,
        address: item.address,
        name: item.name ?? '',
      }
      setLocalVaultStrategies(strategies => {
        if (strategies.some(strategy => 
          strategy.chainId === vaultStrategy.chainId
          && compareEvmAddresses(strategy.vault, vaultStrategy.vault)
          && compareEvmAddresses(strategy.address, vaultStrategy.address)
        )) return strategies
        return [...strategies, vaultStrategy]
      })
    }
    query.refetch()
  }, [confirmation, resolveToast, setLocalVaultStrategies, item, query, vault])

  return <div className="flex items-center gap-4">
    <LinkButton to={getItemHref(item)} h="tertiary" className="w-full px-4 grow h-14 flex items-center justify-between">
      <div className="text-sm">{item.symbol}</div>
      <div className="text-xs">{fPercent(item.apy) ?? '-.--%'}</div>
    </LinkButton>
    <Button title={buttonTitle} onClick={onAdd} theme={buttonTheme} disabled={disabled} className="w-12 h-14 text-2xl">+</Button>
  </div>
}

function VaultSelector() {
  const { vault } = useVaultFromParams()
  const { items } = useFinderItems()

  const filter = useMemo(() => {
    if (!vault) return []
    return items.filter(item => 
      item.chainId === vault.chainId
      && compareEvmAddresses(item.token?.address ?? zeroAddress, vault.asset.address)
      && !compareEvmAddresses(item.address, vault.address)
      && !vault.strategies.some(strategy => compareEvmAddresses(strategy.address, item.address))
    )
  }, [items, vault])

  if (filter.length === 0) return <></>

  return <div className="flex flex-col gap-6">
    <div className="text-neutral-400">Available {vault?.asset.symbol} Strategies</div>
    <div className="flex flex-col gap-6">
      {filter.slice(0, 4).map(item => <SelectableVault key={item.address} item={item} />)}
    </div>
  </div>
}

export default function Allocator() {
  const { chainId, address: vault } = useVaultParams()
  const authorized = useHasRoles({ chainId, vault, roleMask: ROLES.ADD_STRATEGY_MANAGER })
  const { minimumChange } = useMinimumChange()
  const { allocator } = useAllocator()
  const mounted = useMounted()

  if (minimumChange < 1) { return (
    <FlyInFromBottom _key="aside-allocator-no-min-change" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
      <div className="flex items-center justify-start gap-6 text-neutral-400">
        Allocator <EvmAddressChipSlide chainId={chainId} address={allocator ?? zeroAddress} className="bg-neutral-900" />
      </div>
    </FlyInFromBottom>
  ) } else { return (
    <FlyInFromBottom _key="aside-allocator" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
      <div className="flex items-center justify-start gap-6 text-neutral-400">
        Allocator <EvmAddressChipSlide chainId={chainId} address={allocator ?? zeroAddress} className="bg-neutral-900" />
      </div>
      {authorized && <VaultSelector />}
      {authorized && <StrategiesByAddress />}
    </FlyInFromBottom>
    )
  }
}
