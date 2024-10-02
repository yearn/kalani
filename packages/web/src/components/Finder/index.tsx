import Input from '../elements/Input'
import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
import { PiX } from 'react-icons/pi'
import { useHotkeys } from 'react-hotkeys-hook'
import { fEvmAddress } from '@kalani/lib/format'
import { isNothing } from '@kalani/lib/strings'
import { ScrollArea } from '../shadcn/scroll-area'
import { useNavigate } from 'react-router-dom'
import { FinderItem, useFinderItems } from './useFinderItems'
import ChainImg from '../ChainImg'
import { useFinderQuery } from './useFinderQuery'
import Skeleton from '../Skeleton'
import { cn } from '../../lib/shadcn'
import { useHashNav } from '../../hooks/useHashNav'
import { useBreakpoints } from '../../hooks/useBreakpoints'
import FlyInFromBottom from '../motion/FlyInFromBottom'

const MAX_ITEMS = 100

interface FinderProps {
  placeholder?: string,
  className?: string
  inputClassName?: string,
  disableSuggestions?: boolean
}

const containerClassName = `group relative z-0
data-[open=true]:fixed data-[open=true]:z-[100] data-[open=true]:inset-0 data-[open=true]:bg-neutral-900
data-[open=true]:flex data-[open=true]:flex-col-reverse data-[open=true]:justify-between

sm:data-[open=true]:relative sm:data-[open=true]:inset-auto sm:data-[open=true]:bg-transparent
sm:data-[open=true]:block
`

const _inputClassName = `max-h-12
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
group-data-[open=true]:border-transparent sm:group-data-[open=true]:border-secondary-200
rounded-primary
`

const Suspender: React.FC<FinderProps> = ({ placeholder, className, inputClassName, disableSuggestions }) => {
  const nav = useHashNav('find')
  const navigate = useNavigate()
  const breakpoints = useBreakpoints()

  const onFind = useCallback((item: FinderItem) => {
    return navigate(`/${item.label}/${item.chainId}/${item.address}`, { replace: true })
  }, [navigate])

  const { filter } = useFinderItems()

  const { query, setQuery } = useFinderQuery()
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
    const handleClickOutside = (event: MouseEvent): void => {
      if (breakpoints.sm && inputRef.current != null && !inputRef.current.contains(event.target as Node)) {
        nav.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [nav, breakpoints])

  useEffect(() => {
    setFilteredItems(filter.slice(0, MAX_ITEMS))
  }, [filter])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
  }

  const handleItemClick = useCallback((item: FinderItem): void => {
    setQuery(item.name ?? item.label)
    onFind?.(item)
  }, [setQuery, onFind])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
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
  }, [filteredItems, selectedIndex, handleItemClick, nav])

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
      onClick={() => nav.open()}
      className={cn(_inputClassName, inputClassName)}
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <div className={`absolute top-0 right-6 h-full hidden sm:flex items-center ${query.length === 0 ? 'pointer-events-none' : ''}`}>
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
          <table className="table-fixed w-full text-neutral-200">
            <tbody>
              {filteredItems.map((item, index) => (
                <tr
                  key={`${index}-${item.address}`}
                  onClick={() => handleItemClick(item)}
                  onMouseOver={() => setSelectedIndex(index)}
                  className={`
                    cursor-pointer
                    hover:bg-black hover:text-secondary-200
                    ${index === selectedIndex ? 'bg-black text-secondary-200' : ''}
                    ${index === 0 ? 'rounded-t-primary' : ''}
                    ${index === filteredItems.length - 1 ? 'rounded-b-primary' : ''}
                  `}
                >
                  <td className="w-20 px-4 py-4 text-xs text-center">
                    <ChainImg chainId={item.chainId} />
                  </td>
                  <td className="hidden sm:table-cell w-20 py-4 text-xs">{item.label}</td>
                  <td className="w-20 sm:w-36 py-4">{fEvmAddress(item.address, !breakpoints.sm)}</td>
                  <td className="max-w-0 px-4 py-4 truncate">
                    {isNothing(item.name) ? item.label : item.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
