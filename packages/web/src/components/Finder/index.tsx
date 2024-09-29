import Input from '../elements/Input'
import React, { useState, useRef, useEffect, useCallback, useMemo, Suspense } from 'react'
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

const MAX_ITEMS = 100

interface FinderProps {
  placeholder?: string,
  className?: string
  inputClassName?: string,
  disableSuggestions?: boolean
}

const Suspender: React.FC<FinderProps> = ({ placeholder, className, inputClassName, disableSuggestions }) => {
  const navigate = useNavigate()

  const onFind = useCallback((item: FinderItem) => {
    return navigate(`/${item.label}/${item.chainId}/${item.address}`)
  }, [navigate])

  const { filter } = useFinderItems()

  const { query, setQuery } = useFinderQuery()
  const [filteredItems, setFilteredItems] = useState<FinderItem[]>([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const isMac = useMemo(() => /Mac|iPod|iPhone|iPad/.test(navigator.userAgent), [])

  const onHotkey = useCallback(() => {
    inputRef.current?.focus()
    setShowSuggestions(true)
  }, [inputRef])

  useHotkeys(['ctrl+k', 'meta+k'], (event: KeyboardEvent) => {
    event.preventDefault()
    onHotkey()
  }, { enableOnFormTags: true })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (inputRef.current != null && !inputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    setFilteredItems(filter.slice(0, MAX_ITEMS))
  }, [filter])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)
  }

  const handleItemClick = (item: FinderItem): void => {
    setQuery(item.name ?? item.label)
    onFind?.(item)
    setShowSuggestions(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredItems.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => (prev < filteredItems.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      handleItemClick(filteredItems[selectedIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  const handleFocus = (): void => {
    setShowSuggestions(true)
    if (query === '') {
      setFilteredItems(filter.slice(0, MAX_ITEMS))
    }
  }

  return <div className={`relative ${className}`}>
    <Input
      ref={inputRef}
      type="text"
      name="finder"
      value={query}
      placeholder={placeholder}
      onChange={handleInputChange}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      className={cn('max-h-12', inputClassName)}
      spellCheck={false}
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
    />

    <div className="absolute top-0 right-6 h-full hidden sm:flex items-center text-xs text-neutral-700 pointer-events-none">
      {isMac ? '⌘' : 'Ctrl'}+K
    </div>

    {!disableSuggestions && showSuggestions && filteredItems.length > 0 && (
      <div className="absolute z-50 w-full mt-3 saber-glow">
        <ScrollArea className="w-full max-h-80 overflow-auto bg-neutral-950 border border-secondary-200 rounded-primary">
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
                  <td className="w-20 py-4 text-xs">{item.label}</td>
                  <td className="w-36 py-4">{fEvmAddress(item.address)}</td>
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
  return <Suspense fallback={<div className={props.className}><Skeleton className={cn('w-full h-12 rounded-primary')} /></div>}>
    <Suspender {...props} />
  </Suspense>
}

export default Finder
