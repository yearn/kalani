import { cn } from '../../lib/shadcn'
import { forwardRef, TextareaHTMLAttributes } from 'react'

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  className?: string
}

export const TextAreaClassName = cn(`
relative w-full px-6 py-3 text-lg
bg-neutral-950 border-primary border-neutral-900
placeholder:text-neutral-500

hover:text-secondary-50 hover:bg-black hover:border-secondary-50
has-[:focus]:text-secondary-200 has-[:focus]:border-secondary-200 focus:bg-black

disabled:text-neutral-400 disabled:bg-transparent 
hover:disabled:text-neutral-400 hover:disabled:border-black
disabled:placeholder-neutral-800 disabled:border-transparent

outline-none focus:ring-0 focus:outline-none
rounded-primary resize-none

saber-glow
`)

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({ className, ...props }, ref) => {
  return <textarea ref={ref} {...props} className={cn(TextAreaClassName, className)} />
})

TextArea.displayName = 'TextArea'

export default TextArea
