import { AutoTextSize } from 'auto-text-size'
import { cn } from '../../lib/shadcn'
import Screen from '../Screen'
import { IconType } from 'react-icons/lib'
import { useHeroIconSize } from './useHeroIconSize'

export function HeroIcon({ className, icon }: { className?: string, icon: IconType }) {
  const size = useHeroIconSize()
  return <div className={cn('p-3 rounded-full flex items-center justify-center text-black', className)}>
    {icon({ size })}
  </div>
}

export function HeroTitle({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn('w-[92%] text-2xl sm:text-4xl font-fancy', className)}>
    <AutoTextSize mode="oneline" maxFontSizePx={46}>{children}</AutoTextSize>
  </div>
}

export function HeroInset({ className, children }: { className?: string, children: React.ReactNode }) {
  return <div className={cn('absolute z-[100] inset-0 px-2 sm:px-12 flex items-end justify-start pointer-events-none', className)}>
    {children}
  </div>
}

export default function Hero({ className, children }: { className?: string, children: React.ReactNode }) {
  return <Screen className={cn(`relative h-48 px-4 sm:px-12 pt-6 
    flex items-start justify-between gap-12 bg-black text-neutral-200`, className)}>
    {children}
  </Screen>
}
