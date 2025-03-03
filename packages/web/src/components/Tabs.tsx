import { useMounted } from '../hooks/useMounted'
import { useQueryNav } from '../hooks/useQueryNav'
import { cn } from '../lib/shadcn'
import FlyInFromBottom from './motion/FlyInFromBottom'
import ScrollContainer from 'react-indiana-drag-scroll'

export function Tabs({
  className, 
  children 
}: { 
  className?: string, 
  children: React.ReactNode 
}) {
  return <ScrollContainer className={cn('flex gap-3 sm:gap-6', className)}>{children}</ScrollContainer>
}

export function Tab({
  id, 
  isDefault,
  selected,
  onClick,
  className,
  children
}: { 
  id?: string, 
  isDefault?: boolean, 
  selected?: boolean,
  onClick?: () => void,
  className?: string,
  children: React.ReactNode 
}) {
  const nav = useQueryNav(id, isDefault)
  const isMounted = useMounted()
  return <div className="relative">
    <div className={cn('px-6 py-1 flex items-center justify-center gap-2 invisible', className)}>{children}</div>

    <div className="absolute z-0 inset-0">
      {(selected ?? nav.isOpen) && <FlyInFromBottom _key="tabBg" parentMounted={isMounted}>
        <div data-selected={selected ?? nav.isOpen} className={cn('h-[32px] px-6 py-1 text-lg flex items-center justify-center gap-2 !text-black rounded-full', className)}>{children}</div>
      </FlyInFromBottom>}
    </div>

    <div data-selected={selected ?? nav.isOpen} onClick={onClick ?? nav.open} className={cn(className, `
      group absolute z-10 inset-0 px-6 py-1 text-lg
      flex items-center justify-center gap-2
      cursor-pointer pointer-events-auto
      data-[selected=true]:bg-transparent
      data-[selected=true]:text-transparent
      rounded-full`)}>
      {children}
    </div>
  </div>
}

export function TabContent({ 
  id, 
  isDefault, 
  children 
}: { 
  id: string, 
  isDefault?: boolean, 
  children: React.ReactNode 
}) {
  const nav = useQueryNav(id, isDefault)
  if (!nav.isOpen) return undefined
  return children
}
