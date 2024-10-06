import { cn } from '../lib/shadcn'
import Screen from './Screen'

export function HeroInset({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn(`absolute inset-0 px-2 sm:px-12 flex items-end justify-start pointer-events-none`, className)}>
    {children}
  </div>
}

export default function Hero({ className, children }: { className?: string, children: React.ReactNode }) {
  return <Screen className={cn(`relative h-48 px-4 sm:px-12 pb-10 
    flex items-end justify-between gap-12 `, className)}>
    {children}
  </Screen>
}
