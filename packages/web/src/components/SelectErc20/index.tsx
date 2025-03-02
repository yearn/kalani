import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Input from '../elements/Input'
import Skeleton from '../Skeleton'
import { useHashNav } from '../../hooks/useHashNav'
import { isNothing, kabobCase } from '@kalani/lib/strings'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import { cn } from '../../lib/shadcn'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { PiX } from 'react-icons/pi'
import { ScrollArea } from '../shadcn/scroll-area'
import TokenImg from '../TokenImg'
import { Erc20, EvmAddress, EvmAddressSchema } from '@kalani/lib/types'
import { fEvmAddress } from '@kalani/lib/format'
import { useErc20 } from '../../hooks/useErc20'
import { ErrorBoundary } from 'react-error-boundary'
import { TOKENS } from './tokens'
import { createPortal } from 'react-dom'
import { springs } from '../../lib/motion'

interface SelectErc20Props {
  chainId?: number,
  placeholder?: string,
  inputClassName?: string,
  className?: string,
  disabled?: boolean,
  selected?: Erc20,
  onSelect?: (item: Erc20 | undefined) => void
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

function CustomToken({ chainId, address, onClick }: { chainId?: number, address: EvmAddress, onClick?: (item: Erc20) => void }) {
  const breakpoints = useBreakpoints()
  const { token } = useErc20({ chainId, address })

  const handleClick = useCallback(() => {
    onClick?.({ chainId: chainId ?? 0, address, name: token.name ?? 'Error', symbol: token.symbol ?? 'Error', decimals: token.decimals ?? 18 })
  }, [chainId, address, token, onClick])

  return <div onClick={handleClick} className={`h-18 px-4 py-3 
    flex items-center gap-6 cursor-pointer hover:bg-black hover:text-secondary-200`}>
    <div className="size-12"><TokenImg size={48} chainId={chainId} address={address} bgClassName={tokenBgClassName} /></div>
    <div>{fEvmAddress(address, !breakpoints.sm)}</div>
    <div className="grow truncate">{token.name}</div>
  </div>
}

const Suspender: React.FC<SelectErc20Props> = ({ 
  chainId, 
  placeholder, 
  className, 
  inputClassName, 
  disabled, 
  selected,
  onSelect 
}) => {
  const breakpoints = useBreakpoints()
  const nav = useHashNav(kabobCase(placeholder ?? 'select-erc20'))
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const isQueryAddress = useMemo(() => EvmAddressSchema.safeParse(query).success, [query])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const tokens = useMemo(() => TOKENS[chainId ?? 1], [chainId])

  const filter = useMemo(() => {
    if (isQueryAddress) { return [] }
    if (isNothing(query)) { return tokens }
    const lower = query.toLowerCase()
    return tokens.filter(token => 
      token.name.toLowerCase().includes(lower) 
      || token.symbol.toLowerCase().includes(lower)
      || token.address.toLowerCase().includes(lower)
    )
  }, [isQueryAddress, query, tokens])

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

  const handleItemClick = useCallback((item: Erc20 | undefined): void => {
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
      name="selectErc20"
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
      <div className="w-full h-[52px] px-2 flex items-center justify-between gap-6 bg-neutral-950 rounded-primary">
        <div className="size-12"><TokenImg size={48} chainId={selected.chainId} address={selected.address} bgClassName={tokenBgClassName} /></div>
        <div>{fEvmAddress(selected.address, !breakpoints.sm)}</div>
        <div className="grow truncate">{selected.name}</div>
        <button className="flex items-center text-sm text-neutral-500 cursor-pointer pointer-events-auto" onClick={() => handleItemClick(undefined)}  disabled={disabled}>
          <PiX size={24} />
        </button>
      </div>
    </div>}

    {nav.isOpen && filter.length == 0 && !selected && !EvmAddressSchema.safeParse(query).success && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div className="w-full h-14 px-6 flex items-center text-neutral-400 rounded-primary">No tokens found =(</div>
        </ScrollArea>
      </div>
    )}

    {nav.isOpen && isQueryAddress && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <ErrorBoundary fallback={<div className="w-full h-14 px-6 flex items-center text-neutral-400 rounded-primary">No tokens found =(</div>}>
            <Suspense fallback={<Skeleton className="w-full h-14 rounded-primary" />}>
              <CustomToken chainId={chainId} address={EvmAddressSchema.parse(query)} onClick={handleItemClick} />
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
                onClick={() => handleItemClick(item)}
                onMouseOver={() => setSelectedIndex(index)}
                className={`
                  px-4 py-3 flex items-center gap-6 cursor-pointer
                  hover:bg-black hover:text-secondary-200
                  ${index === 0 ? 'sm:rounded-t-primary' : ''}
                  ${index === filter.length - 1 ? 'sm:rounded-b-primary' : ''}
                `}>
                <div className="size-12">
                  <TokenImg size={48} chainId={item.chainId} address={item.address} bgClassName={tokenBgClassName} />
                </div>
                <div>{fEvmAddress(item.address, !breakpoints.sm)}</div>
                <div className="grow truncate">{item.name}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    )}
  </div>
}

const SelectErc20: React.FC<SelectErc20Props> = props => {
  const { sm } = useBreakpoints()
  const nav = useHashNav(kabobCase(props.placeholder ?? 'select-erc20'))

  if (!sm && nav.isOpen) {
    return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-12 rounded-primary" /></div>}>
      {createPortal(<FlyInFromBottom _key="select-erc20" transition={springs.glitch} className="fixed z-[1000] -bottom-[0] left-0 right-0 top-[0]">
        <Suspender {...props} />
      </FlyInFromBottom>, document.body)}
    </Suspense>
  }

  return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-12 rounded-primary" /></div>}>
    <Suspender {...props} />
  </Suspense>
}

export default SelectErc20
