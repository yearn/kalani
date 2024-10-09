import { useQueryNav } from '../hooks/useQueryNav'
import { cn } from '../lib/shadcn'

export function Tabs({ 
  className, 
  children 
}: { 
  className?: string, 
  children: React.ReactNode 
}) {
  return <div className={cn(className)}>{children}</div>
}

type TabClassNames = {
  textClassName?: string,
  bgClassName?: string,
}

export function Tab({ 
  id, 
  isDefault,
  classNames,
  children
}: { 
  id: string, 
  isDefault?: boolean, 
  classNames?: TabClassNames,
  children: React.ReactNode 
}) {
  const nav = useQueryNav(id, isDefault)
  return <div data-open={nav.isOpen} onClick={nav.open} className={cn(`
    group relative px-3 pt-1 text-sm border-b-8 border-transparent
    flex items-center justify-center
    cursor-pointer pointer-events-auto`, classNames?.textClassName)}>
    {children}
    <div className={cn('absolute -bottom-2 w-full h-2 rounded-t-full', classNames?.bgClassName)}></div>
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
