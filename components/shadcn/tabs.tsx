'use client'

import * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/lib/shadcn'

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      `h-10 inline-flex items-center justify-center gap-6
      rounded-md bg-transparent p-1 text-neutral-500 
      dark:bg-neutral-800 dark:text-neutral-400`,
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      `px-3 py-1.5 inline-flex items-center justify-center whitespace-nowrap 
      rounded-full text-sm font-medium ring-offset-white  
      focus-visible:outline-none focus-visible:ring-2 
      focus-visible:ring-neutral-950 focus-visible:ring-offset-2 
      disabled:pointer-events-none disabled:opacity-50
      hover:bg-violet-400 hover:text-neutral-950
      data-[state=active]:bg-violet-400 data-[state=active]:text-neutral-950
      hover:data-[state=active]:bg-violet-400 hover:data-[state=active]:text-neutral-950`,
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      `mt-6 ring-offset-white 
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 
      dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300`,
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
