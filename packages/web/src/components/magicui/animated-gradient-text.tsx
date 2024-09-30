import { ReactNode } from 'react'
import { cn } from '../../lib/shadcn'

export default function AnimatedGradientText({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn(`group relative max-w-fit mx-auto 
      flex flex-row items-center justify-center 
      duration-500 ease-out [--bg-size:300%]`,
      className,
    )}>
      {children}
    </div>
  )
}
