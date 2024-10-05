import { useQueryNav } from '../hooks/useQueryNav'
import { cn } from '../lib/shadcn'

function getColorClasses(baseColor: string) {
  return {
    textColor: `text-${baseColor}-950`,
    borderColor: `border-${baseColor}-950`,
    activeBorderColor: `active:border-${baseColor}-950/60`,
    activeTextColor: `active:text-${baseColor}-950/60`
  }
}

export function Tabs({ 
  className, 
  children 
}: { 
  className?: string, 
  children: React.ReactNode 
}) {
  return <div className={cn(className)}>{children}</div>
}

export function Tab({ 
  id, 
  isDefault,
  className,
  children
}: { 
  id: string, 
  isDefault?: boolean, 
  className?: string,
  children: React.ReactNode 
}) {
  const nav = useQueryNav(id, isDefault)
  return <div data-open={nav.isOpen} onClick={nav.open} className={cn(`
    px-3 pt-1 text-sm border-b-8 border-transparent
    cursor-pointer pointer-events-auto`, className)}>
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
