import { cn } from '@/lib/shadcn'
import { ReactNode } from 'react'

export default function ScrollArea({ children }: { children: ReactNode }) {
  return <div className={cn(`w-full h-screen overflow-x-hidden overflow-y-auto
    sm:scrollbar-thin sm:scrollbar-track-primary-1000 sm:scrollbar-thumb-primary-950
    sm:hover:!scrollbar-thumb-pink-500`)}>
    {children}
  </div>
}
