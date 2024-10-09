import { cn } from '../../lib/shadcn'
import { forwardRef, InputHTMLAttributes, useMemo } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  theme?: 'default' | 'warn' | 'error'
  className?: string
}

export const InputClassName = cn(`
relative w-full px-6 py-3 text-lg
bg-neutral-950 border-primary border-neutral-800
placeholder:text-neutral-500

group-hover:text-secondary-50 group-hover:bg-black group-hover:border-secondary-50
group-has-[:focus]:text-secondary-400 group-has-[:focus]:border-secondary-400
focus:text-secondary-400 focus:border-secondary-400 focus:bg-black

disabled:text-neutral-400 disabled:bg-transparent 
group-hover:disabled:text-neutral-400 group-hover:disabled:border-black
disabled:placeholder-neutral-800 disabled:border-transparent

outline-none focus:ring-0 focus:outline-none
rounded-primary saber-glow`)

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const borderClassName = useMemo(() => {
    if (props.theme === 'warn') return '!border-warn-400'
    if (props.theme === 'error') return '!border-error-500'
    return ''
  }, [props])
  return <input ref={ref} {...props} className={cn(InputClassName, className, borderClassName)} />
})

Input.displayName = 'Input'

export default Input
