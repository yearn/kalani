import { useLocalVaultStrategies, useVaultFromParams, useVaultParams } from '../../../../hooks/useVault'
import Badge from '../Badge'
import { PiCalculator, PiScales, PiRobot } from 'react-icons/pi'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { zeroAddress } from 'viem'
import { EvmAddress, ROLES } from '@kalani/lib/types'
import { useIsRelayed } from '../../Yhaas/Whitelist/TargetForm/VaultForm/useIsRelayed'
import { useQueryNav } from '../../../../hooks/useQueryNav'
import { useAllocator, useVaultConfig } from '../../Vault/useAllocator'
import FlyInFromBottom from '../../../../components/motion/FlyInFromBottom'
import { useMounted } from '../../../../hooks/useMounted'
import { FinderItem, getItemHref, useFinderItems } from '../../../../components/Finder/useFinderItems'
import { useCallback, useEffect, useMemo } from 'react'
import { fPercent } from '@kalani/lib/format'
import Button from '../../../../components/elements/Button'
import LinkButton from '../../../../components/elements/LinkButton'
import { useSimulateContract, useWaitForTransactionReceipt } from 'wagmi'
import { useWriteContract } from '../../../../hooks/useWriteContract'
import { UseSimulateContractParameters } from 'wagmi'
import abis from '@kalani/lib/abis'
import EvmAddressChipSlide from '../../../../components/ChipSlide/EvmAddressChipSlide'
import StrategiesByAddress from './StrategiesByAddress'

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

function Badges() {
  const { vault } = useVaultFromParams()
  const { allocator } = useAllocator()
  const { data: isRelayed } = useIsRelayed({
    vault: vault?.address ?? zeroAddress, 
    chainId: vault?.chainId, 
    rolemask: ROLES.REPORTING_MANAGER 
  })

  if (!vault) return <></>

  return <div className="flex flex-col items-center justify-center gap-12">
    <Badge label="Accountant" icon={PiCalculator} enabled={!compareEvmAddresses(vault.accountant, zeroAddress)} />
    <Badge label="Allocator" icon={PiScales} enabled={!compareEvmAddresses(allocator, zeroAddress)} />
    <Badge label="yHaaS" icon={PiRobot} enabled={isRelayed} />
  </div>
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
    <LinkButton to={getItemHref(item)} h="tertiary" className="px-4 grow h-14 flex items-center justify-between">
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
      compareEvmAddresses(item.token?.address ?? zeroAddress, vault.asset.address)
      && !compareEvmAddresses(item.address, vault.address)
      && !vault.strategies.some(strategy => compareEvmAddresses(strategy.address, item.address))
    )
  }, [items, vault])

  if (filter.length === 0) return <></>

  return <div className="flex flex-col gap-6">
    <div className="text-neutral-400">Available {vault?.asset.symbol} Strategies</div>
    <div className="flex flex-col gap-6">
      {filter.map(item => <SelectableVault key={item.address} item={item} />)}
    </div>
  </div>
}

export default function Vault() {
  const mounted = useMounted()
  const allocatorTab = useQueryNav('allocator')
  const { allocator } = useAllocator()
  const { chainId } = useVaultParams()
  const { vaultConfig } = useVaultConfig()

  const content = useMemo(() => {
    if (!allocatorTab.isOpen) { return (
      <FlyInFromBottom _key="badges" parentMounted={mounted} exit={1}>
        <Badges />
      </FlyInFromBottom>
    )} else if (allocatorTab.isOpen) {
      if (vaultConfig.minimumChange < 1) { return (
        <></>
      ) } else { return (
        <FlyInFromBottom _key="strategy-selector" parentMounted={mounted} exit={1} className="flex flex-col gap-12">
          <div className="flex items-center justify-start gap-6 text-neutral-400">
            Allocator <EvmAddressChipSlide chainId={chainId} address={allocator} className="bg-neutral-950" />
          </div>
          <VaultSelector />
          <StrategiesByAddress />
        </FlyInFromBottom>
        )
      }
    }
  }, [allocatorTab, vaultConfig])

  return <div>
    {content}
  </div>
}
