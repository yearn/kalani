import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Input from '../elements/Input'
import Skeleton from '../Skeleton'
import { useHashNav } from '../../hooks/useHashNav'
import { compareEvmAddresses, isNothing, kabobCase } from '@kalani/lib/strings'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { cn } from '../../lib/shadcn'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { PiX } from 'react-icons/pi'
import { ScrollArea } from '../shadcn/scroll-area'
import TokenImg from '../TokenImg'
import { EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { fEvmAddress, fPercent, fUSD } from '@kalani/lib/format'
import { ErrorBoundary } from 'react-error-boundary'
import { createPortal } from 'react-dom'
import { springs } from '../../lib/motion'
import { Vault } from '../../hooks/useVault'
import { FinderItem, useFinderItems } from '../Finder/useFinderItems'
import { useReadContracts, useConfig } from 'wagmi'
import abis from '@kalani/lib/abis'
import { readContractQueryOptions } from 'wagmi/query'
import { useSuspenseQuery } from '@tanstack/react-query'
import { parseAbi } from 'viem'

interface SelectStrategyProps {
  vault: Vault,
  placeholder?: string,
  inputClassName?: string,
  className?: string,
  disabled?: boolean,
  selected?: FinderItem,
  onSelect?: (item: FinderItem | undefined) => void
}

const containerClassName = `
group relative z-0

data-[open=true]:pt-16 sm:data-[open=true]:pt-0
data-[open=true]:fixed data-[open=true]:z-[100]
data-[open=true]:top-[50%] data-[open=true]:left-0
data-[open=true]:right-0 data-[open=true]:bottom-0
data-[open=true]:bg-neutral-950
data-[open=true]:flex data-[open=true]:flex-col-reverse data-[open=true]:justify-between

data-[open=true]:rounded-t-primary sm:data-[open=true]:rounded-none
data-[open=true]:border-t-2 sm:data-[open=true]:border-none
data-[open=true]:border-neutral-800

data-[open=true]:before:absolute sm:data-[open=true]:before:hidden
data-[open=true]:before:-top-[calc(100%+2px)]
data-[open=true]:before:left-0
data-[open=true]:before:right-0
data-[open=true]:before:h-[100%]
data-[open=true]:before:bg-black/50
data-[open=true]:before:backdrop-blur-sm

sm:data-[open=true]:relative sm:data-[open=true]:inset-auto sm:data-[open=true]:bg-transparent
sm:data-[open=true]:block
`

const _inputClassName = `
h-18 py-4
group-data-[open=true]:rounded-none group-data-[open=true]:rounded-primary
group-data-[open=true]:z-50 sm:group-data-[open=true]:z-auto

sm:group-data-[selected=true]:cursor-default
pointer-events-auto
`

const suggestionsClassName = `
absolute z-50 w-full mt-3
group-data-[open=true]:grow sm:group-data-[open=true]:grow-0
group-data-[open=true]:relative sm:group-data-[open=true]:absolute
group-data-[open=true]:mt-0 sm:group-data-[open=true]:mt-3
group-data-[open=true]:z-0 sm:group-data-[open=true]:z-50
overflow-y-auto
`

const scrollAreaClassName = `
w-full sm:max-h-80 overflow-auto
bg-transparent sm:bg-neutral-900 border-primary border-secondary-200
group-data-[open=true]:border-transparent sm:group-data-[open=true]:border-secondary-400
rounded-none sm:rounded-primary
`

const tokenBgClassName = 'bg-neutral-950 border-primary border-neutral-800 border-dashed'

function useOnChainDefaultQueue(chainId: number, vault: EvmAddress) {
  const config = useConfig()
  const query = useSuspenseQuery(readContractQueryOptions(config, {
    abi: parseAbi(['function get_default_queue() external view returns (address[])']),
    chainId: chainId,
    address: vault,
    functionName: 'get_default_queue'
  }))
  return { ...query, defaultQueue: query.data.map(a => EvmAddressSchema.parse(a)) }
}

function CustomStrategy({ vault, address, onClick }: { vault: Vault, address: EvmAddress, onClick?: (item: FinderItem) => void }) {
  const breakpoints = useBreakpoints()

  const contracts = useMemo(() => [
    { chainId: vault.chainId, address, abi: abis.vault, functionName: 'asset' },
    { chainId: vault.chainId, address, abi: abis.vault, functionName: 'name' },
    { chainId: vault.chainId, address, abi: abis.vault, functionName: 'symbol' }
  ] as const, [vault.chainId, address])

  const { data } = useReadContracts({ contracts })

  const assetAddress = data?.[0]?.result as EvmAddress | undefined
  const name = data?.[1]?.result as string | undefined
  const symbol = data?.[2]?.result as string | undefined

  const isValid = useMemo(() =>
    assetAddress && compareEvmAddresses(assetAddress, vault.asset.address),
    [assetAddress, vault.asset.address]
  )

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (!isValid || !name) return
    e.stopPropagation()
    onClick?.({
      chainId: vault.chainId,
      address,
      name,
      symbol,
      label: 'erc4626',
      token: vault.asset,
      addressIndex: address.toLowerCase()
    } as FinderItem)
  }, [vault, address, name, symbol, isValid, onClick])

  if (!isValid) {
    return <div className="h-18 px-4 py-3 flex items-center gap-6 text-neutral-400">
      Invalid strategy (wrong asset or not ERC4626)
    </div>
  }

  return <div onClick={handleClick} className={`h-18 px-4 py-3
    flex items-center gap-6 cursor-pointer hover:bg-black hover:text-secondary-200`}>
    <div className="size-12"><TokenImg showChain={true} size={48} chainId={vault.chainId} address={vault.asset.address} bgClassName={tokenBgClassName} /></div>
    <div className="grow truncate">{name}</div>
    <div>{fEvmAddress(address, !breakpoints.sm)}</div>
  </div>
}

const Suspender: React.FC<SelectStrategyProps> = ({
  vault,
  placeholder,
  className,
  inputClassName,
  disabled,
  selected,
  onSelect
}) => {
  const breakpoints = useBreakpoints()
  const nav = useHashNav(kabobCase(placeholder ?? 'select-strategy'))
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const isQueryAddress = useMemo(() => EvmAddressSchema.safeParse(query).success, [query])
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const { items } = useFinderItems()
  const { defaultQueue } = useOnChainDefaultQueue(vault.chainId, vault.address)

  const strategies = useMemo(() => {
    return items
      .filter(item =>
        item.chainId === vault.chainId &&
        compareEvmAddresses(item.token?.address ?? '', vault.asset.address) &&
        !compareEvmAddresses(item.address, vault.address) &&
        !defaultQueue.some(strategyAddress => compareEvmAddresses(strategyAddress, item.address))
      )
      .sort((a, b) => {
        const aHasApy = (a.apy ?? 0) > 0
        const bHasApy = (b.apy ?? 0) > 0

        // Items with APY come before items without APY
        if (aHasApy && !bHasApy) return -1
        if (!aHasApy && bHasApy) return 1

        // Both have APY or both don't have APY, sort by TVL
        return (b.tvl ?? 0) - (a.tvl ?? 0)
      })
  }, [items, vault.chainId, vault.asset.address, vault.address, defaultQueue])

  const filter = useMemo(() => {
    if (isQueryAddress) { return [] }
    if (isNothing(query)) { return strategies }
    const lower = query.toLowerCase()
    return strategies.filter(strategy =>
      strategy.name?.toLowerCase().includes(lower)
      || strategy.symbol?.toLowerCase().includes(lower)
      || strategy.address.toLowerCase().includes(lower)
      || strategy.origin?.toLowerCase().includes(lower)
    )
  }, [isQueryAddress, query, strategies])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (breakpoints.sm && containerRef.current != null && !(event.target as HTMLElement)?.closest('[data-open="true"]')) {
        nav.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => { document.removeEventListener('click', handleClickOutside) }
  }, [nav, containerRef, breakpoints])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
  }

  const handleItemClick = useCallback((item: FinderItem | undefined): void => {
    setQuery('')
    onSelect?.(item)
    if (item !== undefined) { nav.close() }
  }, [setQuery, onSelect, nav])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filter.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filter.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'Enter') {
      handleItemClick(filter[selectedIndex])
    } else if (e.key === 'Escape') {
      nav.close()
    }
  }, [nav, filter, selectedIndex, handleItemClick])

  return <div data-open={nav.isOpen} data-selected={selected !== undefined} ref={containerRef} className={cn(
      containerClassName,
      className
    )}>
    <Input
      ref={inputRef}
      type="text"
      disabled={disabled}
      name="selectStrategy"
      value={query ?? ''}
      onClick={nav.open}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      maxLength={42}
      className={cn(_inputClassName, inputClassName)}
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <button
      onClick={nav.close}
      className="hidden group-data-[open=true]:block sm:group-data-[open=true]:hidden absolute top-6 right-6 text-neutral-700">
      <PiX size={32} />
    </button>

    <div className={`absolute top-0 right-6 h-full hidden sm:flex items-center ${query.length === 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {query.length > 0 && <FlyInFromBottom _key="finder-clear">
        <button className="flex items-center text-sm text-neutral-500 cursor-pointer" onClick={() => setQuery('')} disabled={disabled}>
          <PiX size={24} />
        </button>
      </FlyInFromBottom>}
    </div>

    {selected && <div className={`
      absolute z-[100] inset-2 sm:h-[52px]

      group-data-[open=true]:right-2
      group-data-[open=true]:bottom-1
      group-data-[open=true]:left-2

      border-primary border-transparent
      flex items-center group-data-[open=true]:items-end sm:items-center sm:group-data-[open=true]:items-center gap-6
      pointer-events-none`}>
      <div className="w-full h-[44px] px-2 flex items-center justify-between gap-6 bg-neutral-950 rounded-primary">
        <div className="size-12"><TokenImg size={48} showChain={true} chainId={vault.chainId} address={vault.asset.address} bgClassName={tokenBgClassName} /></div>
        <div className="grow truncate">{selected.name}</div>
        <div>{fEvmAddress(selected.address, !breakpoints.sm)}</div>
        <button className="flex items-center text-sm text-neutral-500 cursor-pointer pointer-events-auto" onClick={() => handleItemClick(undefined)}  disabled={disabled}>
          <PiX size={24} />
        </button>
      </div>
    </div>}

    {nav.isOpen && filter.length == 0 && !selected && !EvmAddressSchema.safeParse(query).success && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div className="w-full h-14 px-6 flex items-center text-neutral-400 rounded-primary">No strategies found =(</div>
        </ScrollArea>
      </div>
    )}

    {nav.isOpen && isQueryAddress && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <ErrorBoundary fallback={<div className="w-full h-14 px-6 flex items-center text-neutral-400 rounded-primary">No strategies found =(</div>}>
            <Suspense fallback={<Skeleton className="w-full h-14 rounded-primary" />}>
              <CustomStrategy vault={vault} address={EvmAddressSchema.parse(query)} onClick={handleItemClick} />
            </Suspense>
          </ErrorBoundary>
        </ScrollArea>
      </div>
    )}

    {nav.isOpen && !isQueryAddress && filter.length > 0 && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div className="w-full flex flex-col gap-3 text-neutral-200">
            {filter.map((item, index) => (
              <div
                key={`${index}-${item.address}`}
                onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                onMouseOver={() => setSelectedIndex(index)}
                className={`
                  px-4 py-3 flex items-center justify-between gap-4 cursor-pointer
                  hover:bg-black hover:text-secondary-200
                  ${index === selectedIndex ? 'bg-black text-secondary-200' : ''}
                  ${index === 0 ? 'sm:rounded-t-primary' : ''}
                  ${index === filter.length - 1 ? 'sm:rounded-b-primary' : ''}
                `}>
                <div className="flex items-center gap-6">
                  <div className="size-12 flex-shrink-0">
                    <TokenImg size={48} chainId={vault.chainId} address={vault.asset.address} showChain={true} bgClassName={tokenBgClassName} />
                  </div>
                  <div className="flex-1 min-w-0 max-w-[320px] truncate">{item.name}</div>
                </div>
                <div className="flex items-center justify-end gap-4 flex-shrink-0">
                  {!isNothing(item.origin) && (
                    <div className={cn(
                      'px-2 py-1 text-xs text-neutral-400 rounded whitespace-nowrap',
                      item.origin?.toLowerCase() === 'yearn' ? 'bg-indigo-600 text-white' : 'bg-neutral-800'
                    )}>
                      {item.origin}
                    </div>
                  )}
                  <div className="w-16 px-2 py-1 text-right text-xs text-neutral-400 bg-neutral-800 rounded whitespace-nowrap">
                    {fUSD(item.tvl ?? 0, { fixed: 0 })}
                  </div>
                  <div className="w-[60px] px-2 py-1 text-right text-xs text-neutral-400 bg-neutral-800 rounded whitespace-nowrap">
                    {fPercent(item.apy ?? 0)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )}
  </div>
}

const SelectStrategy: React.FC<SelectStrategyProps> = props => {
  const { sm } = useBreakpoints()
  const nav = useHashNav(kabobCase(props.placeholder ?? 'select-strategy'))

  if (!sm && nav.isOpen) {
    return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-12 rounded-primary" /></div>}>
      {createPortal(<FlyInFromBottom _key="select-strategy" transition={springs.glitch} className="fixed z-[1000] -bottom-[0] left-0 right-0 top-[0]">
        <Suspender {...props} />
      </FlyInFromBottom>, document.body)}
    </Suspense>
  }

  return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-12 rounded-primary" /></div>}>
    <Suspender {...props} />
  </Suspense>
}

export default SelectStrategy
