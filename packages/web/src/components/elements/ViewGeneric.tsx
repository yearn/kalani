import { cn } from '../../lib/shadcn'

export default function ViewGeneric({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn('px-3 py-1 inline rounded-full', className)}>
    {children}
  </div>
}
