import React, { AnchorHTMLAttributes, forwardRef } from 'react'

type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  className?: string
}

export const AnchorClassName = `
underline decoration-neutral-900
text-neutral-100 
hover:text-secondary-50 hover:decoration-secondary-50
active:text-secondary-200 active:decoration-secondary-200
`

const A = forwardRef<HTMLAnchorElement, AnchorProps>(({ className, children, ...props }, ref) => (
  <a ref={ref} {...props} className={`
    ${AnchorClassName}
    ${className}`}>{children}</a>
))

A.displayName = 'A'

export default A
