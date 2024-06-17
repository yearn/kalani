import { ThemeName } from '@/lib/types'
import React, { forwardRef, ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  theme?: ThemeName
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, theme, children, ...props }, ref) => {
  return <button ref={ref} {...props} className={`
    relative h-8 px-8 py-5 flex items-center justify-center
    border border-transparent bg-orange-950 
    text-lg text-neutral-0
    hover:text-violet-300 hover:bg-neutral-900 hover:border-violet-300
    active:text-violet-400 active:border-violet-400
    disabled:bg-neutral-950 disabled:text-neutral-600 
    disabled:cursor-default disabled:border-transparent
    cursor-pointer rounded-primary whitespace-nowrap
    ${`theme-${theme ?? 'default'}`}
    ${className}`}>
    {children}
  </button>
})

Button.displayName = 'Button'

export default Button
