import { ButtonHTMLAttributes, forwardRef } from 'react'
import { AnchorClassName } from './A'

export type AButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}

const AButton = forwardRef<HTMLButtonElement, AButtonProps>(({ className, children, ...props }, ref) => (
  <button ref={ref} {...props} className={`
    ${AnchorClassName}
    ${className}`}>{children}</button>
))

AButton.displayName = 'AButton'

export default AButton
