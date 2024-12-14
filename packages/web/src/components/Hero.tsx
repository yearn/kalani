import { AutoTextSize } from 'auto-text-size'
import { cn } from '../lib/shadcn'
import Screen from './Screen'

export function HeroTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn(`w-[92%] text-4xl font-fancy`, className)}>
    <AutoTextSize mode="oneline" minFontSizePx={16} maxFontSizePx={46}>{children}</AutoTextSize>
  </div>
}

export function HeroInset({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn(`absolute z-[100] inset-0 px-2 sm:px-12 flex items-end justify-start pointer-events-none`, className)}>
    {children}
  </div>
}

export default function Hero({ className, children }: { className?: string, children: React.ReactNode }) {
  return <Screen className={cn(`relative h-48 px-4 sm:px-12 pb-10 
    flex items-end justify-between gap-12`, className)}>
    {children}
  </Screen>
}
