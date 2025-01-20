import { cn } from '../../lib/shadcn'
import { forwardRef, InputHTMLAttributes, useMemo } from 'react'
import Info from '../Info'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  theme?: 'default' | 'warn' | 'error'
  infoKey?: string
  className?: string
}

export const InputClassName = cn(`
relative w-full px-6 py-3 text-lg
bg-neutral-950 border-primary border-neutral-900
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
  return <div className="relative">
    <input ref={ref} {...props} className={cn(InputClassName, className, borderClassName)} />
    {props.infoKey && <div className="absolute inset-0 flex items-center justify-end pointer-events-none">
      <Info _key={props.infoKey} size={24} className="absolute right-4" />
    </div>}
  </div>
})

Input.displayName = 'Input'

export default Input
