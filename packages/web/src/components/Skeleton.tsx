import { cn } from '../lib/shadcn'

export default function Skeleton({ className }: { className?: string }) {
  return <div className={cn('opacity-50 shimmer', className)} />
}
