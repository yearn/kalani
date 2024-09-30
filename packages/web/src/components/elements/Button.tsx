import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/shadcn'

export type ThemeName = 'default' | 'disabled' | 'sim' | 'write' | 'confirm' | 'active' | 'secondary' | 'cta' | 'error'
export type Hierarchy = 'primary' | 'secondary'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
  theme?: ThemeName
  h?: Hierarchy
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, theme, h, children, ...props }, ref) => {
  const bg = h === 'secondary' ? 'bg-neutral-950' : 'bg-primary-1000'
  const text = h === 'secondary' ? 'text-neutral-300' : 'text-neutral-0'
  const border = h === 'secondary' ? 'border-neutral-800' : 'border-transparent'

  return <button ref={ref} {...props} className={cn(`
    relative h-8 px-8 py-5 flex items-center justify-center
    border-primary ${border} ${bg} text-lg ${text}
    hover:text-secondary-50 hover:bg-neutral-900 hover:border-secondary-50
    active:text-secondary-200 active:border-secondary-200
    disabled:bg-neutral-950 disabled:text-neutral-600 
    disabled:hover:border-primary-950 disabled:hover:text-primary-950
    disabled:hover:bg-neutral-950
    disabled:cursor-default disabled:border-transparent
    cursor-pointer rounded-primary whitespace-nowrap
    saber-glow
    ${`theme-${theme ?? 'default'}`}
    ${className}`)}>
    {children}
  </button>
})

Button.displayName = 'Button'

export default Button
