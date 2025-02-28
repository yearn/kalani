import { zeroAddress } from 'viem'
import { useLocalVaultStrategies, useVaultFromParams } from '../../../../../hooks/useVault'
import { FinderItem, getItemHref, useFinderItems } from '../../../../../components/Finder/useFinderItems'
import { useCallback, useEffect, useMemo } from 'react'
import { compareEvmAddresses } from '@kalani/lib/strings'
import { fPercent } from '@kalani/lib/format'
import Button from '../../../../../components/elements/Button'
import LinkButton from '../../../../../components/elements/LinkButton'
import { useAddStrategy } from './useAddStrategy'

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
  }, [simulation.isError, simulation.error])

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
      <div className="w-[140px] text-sm truncate">{item.name}</div>
      <div className="text-xs">{fPercent(item.apy) ?? '-.--%'}</div>
    </LinkButton>
    <Button title={buttonTitle} onClick={onAdd} theme={buttonTheme} disabled={disabled} className="w-12 text-2xl">+</Button>
  </div>
}

export function VaultSelector() {
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
      {filter.slice(0, 3).map(item => <SelectableVault key={item.address} item={item} />)}
    </div>
  </div>
}
