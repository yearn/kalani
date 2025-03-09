import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'
import { cn } from '../../lib/shadcn'

export type ThemeName = 'default' | 'disabled' | 'sim' | 'write' | 'confirm' | 'active' | 'secondary' | 'cta' | 'error'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> & {
    theme?: ThemeName
  }
>(({ className, theme, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(`
      peer inline-flex h-8 w-16 shrink-0 cursor-pointer 
      items-center rounded-full border-primary
      transition-colors 
      disabled:cursor-default
      saber-glow

      data-[state=checked]:border-secondary-950
      data-[state=unchecked]:border-black
      data-[state=checked]:hover:border-secondary-50
      data-[state=unchecked]:hover:border-secondary-50
      disabled:!border-black

      focus-visible:outline-none 
      focus-visible:ring-2 
      focus-visible:ring-neutral-950
      focus-visible:ring-offset-2 
      focus-visible:ring-offset-white 
      data-[state=checked]:bg-secondary-400
      data-[state=unchecked]:bg-neutral-950

      dark:focus-visible:ring-neutral-300
      dark:focus-visible:ring-offset-neutral-950 
      dark:data-[state=checked]:bg-neutral-50 
      dark:data-[state=unchecked]:bg-neutral-800`,
      `theme-${theme ?? 'default'}`,
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(`
        pointer-events-none block h-5 w-5 rounded-full 
        ring-0 transition-transform
        data-[state=checked]:bg-secondary-50
        data-[state=unchecked]:bg-neutral-200
        data-[state=checked]:translate-x-8
        data-[state=unchecked]:translate-x-1 
        dark:bg-neutral-950`)}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
