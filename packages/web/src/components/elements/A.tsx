import { AnchorHTMLAttributes, forwardRef } from 'react'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

export const AnchorClassName = `
underline decoration-neutral-900
hover:text-secondary-50 hover:decoration-secondary-50
active:text-secondary-400 active:decoration-secondary-400
`

const A = forwardRef<HTMLAnchorElement, AnchorProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
    ${AnchorClassName}
    ${className}`}>{children}</a>
))

A.displayName = 'A'

export default A
