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
import { fHexString } from '@kalani/lib/format'
import { create } from 'zustand'
import { Project, useProjects } from './useProjects'
import Dialog, { useDialog } from '../../components/Dialog'
import NewProject from './NewProject'
import { useChainId } from 'wagmi'

type UseSelectedProject = {
  selectedProject: Project | undefined,
  setSelectedProject: (project: Project | undefined) => void
} 

export const useSelectedProject = create<UseSelectedProject>(set => ({
  selectedProject: undefined,
  setSelectedProject: (project: Project | undefined) => set({ selectedProject: project })
}))

interface SelectProjectProps {
  navkey?: string,
  chainId?: number,
  placeholder?: string,
  inputClassName?: string,
  className?: string,
  disabled?: boolean,
  onSelect?: (item: Project | undefined) => void
}

const containerClassName = `group relative z-0
data-[open=true]:fixed data-[open=true]:z-[100] data-[open=true]:inset-0 data-[open=true]:bg-neutral-900
data-[open=true]:flex data-[open=true]:flex-col-reverse data-[open=true]:justify-between

sm:data-[open=true]:relative sm:data-[open=true]:inset-auto sm:data-[open=true]:bg-transparent
sm:data-[open=true]:block
`

const _inputClassName = `h-12 py-4
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

const Suspender: React.FC<SelectProjectProps> = ({
  navkey,
  chainId,
  placeholder = 'Select Project',
  className,
  inputClassName,
  disabled,
  onSelect
}) => {
  const _navkey = useMemo(() => navkey ?? kabobCase(placeholder ?? 'select-project'), [navkey, placeholder])
  const _dialogId = useMemo(() => `${_navkey}-new-project`, [_navkey])
  const activeChainId = useChainId()
  const breakpoints = useBreakpoints()
  const nav = useHashNav(_navkey)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState<string>('')
  const selected = useSelectedProject(state => state.selectedProject)
  const [cursorIndex, setCursorIndex] = useState(-1)
  const { projects } = useProjects(chainId ?? activeChainId ?? 0)
  const { openDialog } = useDialog(_dialogId)

  const filter = useMemo(() => {
    if (isNothing(query)) { return projects }
    const lower = query.toLowerCase()
    return projects.filter(project => project.name.toLowerCase().includes(lower))
  }, [query, projects])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (breakpoints.sm && inputRef.current != null && !inputRef.current.contains(event.target as Node)) {
        nav.close()
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => { document.removeEventListener('click', handleClickOutside) }
  }, [nav, inputRef, breakpoints])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setQuery(value)
    setCursorIndex(-1)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCursorIndex(prev => (prev > 0 ? prev - 1 : filter.length - 1))
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCursorIndex(prev => (prev < filter.length - 1 ? prev + 1 : 0))
    } else if (e.key === 'Enter') {
      handleItemClick(filter[cursorIndex])
    } else if (e.key === 'Escape') {
      nav.close()
    }
  }, [nav, filter])

  const handleItemClick = useCallback((item: Project | undefined): void => {
    setQuery('')
    onSelect?.(item)
  }, [setQuery, onSelect])

  const handleNewProjectClick = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 10))
    openDialog()
  }, [openDialog])

  return <div data-open={nav.isOpen} className={cn(
      containerClassName, 
      className
    )}>
    <Input
      ref={inputRef}
      type="text"
      disabled={disabled || (chainId ?? activeChainId) === undefined}
      name="selectProject"
      value={query ?? ''}
      onClick={() => nav.open()}
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

    <div className={`absolute top-0 right-6 h-full hidden sm:flex items-center ${query.length === 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
      {query.length > 0 && <FlyInFromBottom _key="finder-clear">
        <button className="flex items-center text-sm text-neutral-500 cursor-pointer" onClick={() => setQuery('')}>
          <PiX size={24} />
        </button>
      </FlyInFromBottom>}
    </div>

    {selected && <div className="absolute inset-2 z-10 px-2 border-primary border-transparent flex items-center gap-6 bg-neutral-950 rounded-primary pointer-events-none">
      <div className="grow truncate">{selected.name}</div>
      <button className="flex items-center text-sm text-neutral-500 cursor-pointer pointer-events-auto" onClick={() => handleItemClick(undefined)}>
        <PiX size={24} />
      </button>
    </div>}

    {nav.isOpen && filter.length == 0 && !selected && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div onClick={handleNewProjectClick} className={`
              px-4 py-3 flex items-center justify-between gap-6 cursor-pointer
              hover:bg-black hover:text-secondary-200 rounded-b-primary
            `}>
            Start new project...
          </div>
        </ScrollArea>
      </div>
    )}

    {nav.isOpen && filter.length > 0 && (
      <div className={cn(suggestionsClassName, breakpoints.sm ? 'saber-glow' : '')}>
        <ScrollArea className={scrollAreaClassName}>
          <div className="w-full flex flex-col text-neutral-200">
            {filter.map((item, index) => (
              <div
                key={`${index}-${item.id}`}
                onClick={() => handleItemClick(item)}
                onMouseOver={() => setCursorIndex(index)}
                className={`
                  px-4 py-3 flex items-center justify-between gap-6 cursor-pointer
                  hover:bg-black hover:text-secondary-200
                  ${index === cursorIndex ? 'bg-black text-secondary-200' : ''}
                  ${index === 0 ? 'rounded-t-primary' : ''}
                `}>
                <div className="truncate">{item.name}</div>
                <div className="sm:pr-6 text-xs">{fHexString(item.id, !breakpoints.sm)}</div>
              </div>
            ))}

            <div onClick={handleNewProjectClick} className={`
                px-4 py-3 flex items-center justify-between gap-6 cursor-pointer
                hover:bg-black hover:text-secondary-200 rounded-b-primary
              `}>
              Start new project...
            </div>
          </div>
        </ScrollArea>
      </div>
    )}

    <Dialog title="New project" dialogId={_dialogId}>
      <NewProject dialogId={_dialogId} />
    </Dialog>
  </div>
}

const SelectProject: React.FC<SelectProjectProps> = props => {
  return <Suspense fallback={<div className={props.className}><Skeleton className="w-full h-14 rounded-primary" /></div>}>
    <Suspender {...props} />
  </Suspense>
}

export default SelectProject
