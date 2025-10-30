import Input from '../elements/Input'
import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
import { PiX } from 'react-icons/pi'
import { useHotkeys } from 'react-hotkeys-hook'
import { fEvmAddress, fUSD, fPercent } from '@kalani/lib/format'
import { isNothing } from '@kalani/lib/strings'
import { ScrollArea } from '../shadcn/scroll-area'
import { useNavigate } from 'react-router-dom'
import { FinderItem, useFinderItems } from './useFinderItems'
import ChainImg from '../ChainImg'
import TokenImg from '../TokenImg'
import Skeleton from '../Skeleton'
import { cn } from '../../lib/shadcn'
import { useHashNav } from '../../hooks/useHashNav'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import FlyInFromBottom from '../motion/FlyInFromBottom'
import { useFinderOptions } from './useFinderOptions'

const MAX_ITEMS = 100
const tokenBgClassName = 'bg-neutral-950 border-primary border-neutral-800 border-dashed'

interface FinderProps {
  placeholder?: string,
  className?: string
  inputClassName?: string,
  disableSuggestions?: boolean,
  disabled?: boolean
}

const containerClassName = `group relative z-0
data-[open=true]:fixed data-[open=true]:z-[100] data-[open=true]:inset-0 data-[open=true]:bg-neutral-900
data-[open=true]:flex data-[open=true]:flex-col-reverse data-[open=true]:justify-between

sm:data-[open=true]:relative sm:data-[open=true]:inset-auto sm:data-[open=true]:bg-transparent
sm:data-[open=true]:block
`

const _inputClassName = `max-h-12 bg-black
group-data-[open=true]:rounded-none sm:group-data-[open=true]:rounded-primary
group-data-[open=true]:z-50 sm:group-data-[open=true]:z-auto
pointer-events-auto`

const suggestionsClassName = `absolute z-50 w-full mt-3
group-data-[open=true]:grow sm:group-data-[open=true]:grow-0
group-data-[open=true]:relative sm:group-data-[open=true]:absolute
group-data-[open=true]:mt-0 sm:group-data-[open=true]:mt-3
group-data-[open=true]:z-0 sm:group-data-[open=true]:z-50
overflow-y-auto
`

const scrollAreaClassName = `w-full sm:max-h-80 overflow-auto 
bg-neutral-900 border-primary border-secondary-200 
group-data-[open=true]:border-transparent sm:group-data-[open=true]:border-secondary-400
rounded-primary
`

const getViewName = (item: FinderItem) => {
  switch (item.label) {
    case 'yVault':
    case 'v3':
      return 'vault'
    case 'yStrategy':
      return 'strategy'
    default:
      return item.label
  }
}

const Suspender: React.FC<FinderProps> = ({ placeholder, className, inputClassName, disableSuggestions, disabled }) => {
  const nav = useHashNav('find')
  const navigate = useNavigate()
  const breakpoints = useBreakpoints()

  const onFind = useCallback((item: FinderItem) => {
    const view = getViewName(item)
    return navigate(`/${view}/${item.chainId}/${item.address}`, { replace: true })
  }, [navigate])

  const { filter } = useFinderItems()

  const { query, setQuery } = useFinderOptions()
  const [filteredItems, setFilteredItems] = useState<FinderItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMac = useMemo(() => /Mac|iPod|iPhone|iPad/.test(navigator.userAgent), [])

  const onHotkey = useCallback(() => {
    inputRef.current?.focus()
    nav.open()
  }, [inputRef, nav])

  useHotkeys(['ctrl+k', 'meta+k'], (event: KeyboardEvent) => {
    event.preventDefault()
    onHotkey()
  }, { enableOnFormTags: true })

  useEffect(() => {
    if (disabled) return

    const handleClickOutside = (event: MouseEvent): void => {
      if (breakpoints.sm && inputRef.current != null && !inputRef.current.contains(event.target as Node)) {
        nav.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [nav, breakpoints, disabled])

  useEffect(() => {
    setFilteredItems(filter.slice(0, MAX_ITEMS))
  }, [filter])

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
  }, [setQuery, setSelectedIndex])

  const handleItemClick = useCallback((item: FinderItem): void => {
    onFind?.(item)
  }, [onFind])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (disabled) return

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleItemClick(filteredItems[selectedIndex])
    } else if (e.key === 'Escape') {
      nav.close()
    }
  }, [filteredItems, selectedIndex, handleItemClick, nav, disabled])

  const handleInputClick = useCallback(() => {
    if (!disableSuggestions && !disabled) { nav.open() }
  }, [disableSuggestions, nav, disabled])

  return <div data-open={nav.isOpen} className={cn(
      containerClassName, 
      className, 
      disableSuggestions && '!bg-transparent pointer-events-none'
    )}>
    <Input
      ref={inputRef}
      type="text"
      name="finder"
      value={query}
      placeholder={placeholder}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onClick={handleInputClick}
      className={cn(_inputClassName, inputClassName)}
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <div className={`absolute top-0 right-6 h-full hidden sm:flex items-center ${query.length === 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {query.length === 0 && <div className="text-xs text-neutral-700">{isMac ? '⌘' : 'Ctrl'}+K</div>}
      {query.length > 0 && <FlyInFromBottom _key="finder-clear">
        <button className="flex items-center text-sm text-neutral-500 cursor-pointer" onClick={() => setQuery('')}>
          <PiX size={24} />
        </button>
      </FlyInFromBottom>}
    </div>

    {!disableSuggestions && nav.isOpen && filteredItems.length > 0 && (
      <div className="sm:hidden fixed inset-0 z-50 px-6 py-6 flex items-start justify-end pointer-events-none">
        <PiX size={32} onClick={() => nav.close()} className="text-neutral-500 pointer-events-auto" />
      </div>
    )}

    {!disableSuggestions && nav.isOpen && filteredItems.length > 0 && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div className="w-full flex flex-col gap-3 text-neutral-200">
            {filteredItems.map((item, index) => (
              <div
                key={`${item.chainId}-${item.address}`}
                onClick={() => handleItemClick(item)}
                onMouseOver={() => setSelectedIndex(index)}
                className={`
                  px-4 py-3 flex items-center justify-between gap-4 cursor-pointer
                  hover:bg-black hover:text-secondary-200
                  ${index === selectedIndex ? 'bg-black text-secondary-200' : ''}
                  ${index === 0 ? 'sm:rounded-t-primary' : ''}
                  ${index === filteredItems.length - 1 ? 'sm:rounded-b-primary' : ''}
                `}>
                <div className="flex items-center gap-6">
                  <div className="size-12 flex-shrink-0">
                    <TokenImg size={48} chainId={item.chainId} address={item.token?.address ?? item.address} showChain={true} bgClassName={tokenBgClassName} />
                  </div>
                  <div className="flex-1 min-w-0 max-w-[320px] truncate">
                    {isNothing(item.name) ? item.label : item.name}
                  </div>
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

const Finder: React.FC<FinderProps> = props => {
  return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-12 rounded-primary" /></div>}>
    <Suspender {...props} />
  </Suspense>
}

export default Finder
