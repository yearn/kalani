import * as React from 'react'
import * as SwitchPrimitives from '@radix-ui/react-switch'

import { cn } from '../../lib/shadcn'

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(`
      peer inline-flex h-8 w-14 shrink-0 cursor-pointer 
      items-center rounded-full border
      transition-colors 
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-neutral-950 focus-visible:ring-offset-2 
      focus-visible:ring-offset-white 
      disabled:opacity-50 disabled:cursor-default

      border-neutral-700
      disabled:group-hover:border-neutral-700
      hover:border-secondary-50
      saber-glow

      data-[state=checked]:bg-secondary-600
      data-[state=unchecked]:bg-neutral-900
      dark:focus-visible:ring-neutral-300 dark:focus-visible:ring-offset-neutral-950 
      dark:data-[state=checked]:bg-neutral-50 dark:data-[state=unchecked]:bg-neutral-800`,
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
        data-[state=checked]:translate-x-7
        data-[state=unchecked]:translate-x-1 
        dark:bg-neutral-950`)}
    />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }
