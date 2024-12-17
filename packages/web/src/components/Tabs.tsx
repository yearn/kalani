import { useQueryNav } from '../hooks/useQueryNav'
import { cn } from '../lib/shadcn'

export function Tabs({ 
  className, 
  children 
}: { 
  className?: string, 
  children: React.ReactNode 
}) {
  return <div className={cn(`flex gap-6`, className)}>{children}</div>
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
  return <div data-selected={selected ?? nav.isOpen} onClick={onClick ?? nav.open} className={cn(`
    group relative my-2 px-6 text-lg
    flex items-center justify-center gap-2
    cursor-pointer pointer-events-auto
    text-neutral-950 bg-transparent
    hover:bg-neutral-950/20
    active:bg-neutral-950/20
    active:text-secondary-400
    data-[selected=true]:text-secondary-400
    data-[selected=true]:bg-neutral-950
    rounded-full drop-shadow-lg`, className)}>
    {children}
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
