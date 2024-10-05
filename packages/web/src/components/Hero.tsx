import { cn } from '../lib/shadcn'
import Screen from './Screen'

export default function Hero({ className, children }: { className?: string, children: React.ReactNode }) {
  return <Screen className={cn(`h-48 px-12 pb-10 
    flex items-end justify-between gap-12 `, className)}>
    {children}
  </Screen>
}
