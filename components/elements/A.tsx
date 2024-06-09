import React, { AnchorHTMLAttributes, forwardRef } from 'react'

type InputProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

export const AnchorClassName = `
underline underline-offset-8
text-neutral-100 decoration-neutral-100/20
hover:text-secondary-300 hover:decoration-secondary-300
active:text-secondary-400 active:decoration-secondary-400
`

const A = forwardRef<HTMLAnchorElement, InputProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
    ${AnchorClassName}
    ${className}`}>{children}</a>
))

A.displayName = 'A'

export default A
