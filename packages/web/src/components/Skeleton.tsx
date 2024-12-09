import { cn } from '../lib/shadcn'

export default function Skeleton({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <div className={cn('opacity-50 shimmer', className)}>
    {children}
  </div>
}

export function SkeletonButton({ className, children }: { className?: string, children?: React.ReactNode }) {
  return <Skeleton className={cn('h-8 px-8 py-5 flex items-center justify-center border-primary border-transparent rounded-primary text-transparent', className)}>
    {children}
  </Skeleton>
}
